import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { MailsService } from 'src/mails/mails.service';
import { CreateTokenPayloadDto } from 'src/tokens/dto/create-token-payload.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailsService,
  ) {}

  async registration(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email is already exist');
    }

    const hashPassword = await bcrypt.hash(data.password, 4);
    const activationLink = uuidv4();
    let newUser: User = await this.prisma.user.create({
      data: { ...data, password: hashPassword, activationLink },
    });

    await this.mailService.sendActivationMail(
      data.email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    );

    const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(newUser);
    const tokens = await this.tokensService.generateTokens({ ...payload });
    const refreshToken = await this.tokensService.saveToken(
      newUser.id,
      tokens.refreshToken,
    );
    return { ...tokens, user: payload };
  }

  async login(email: string, password: string) {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (isPassEquals) {
      const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(user);
      const tokens = await this.tokensService.generateTokens({ ...payload });
      const refreshToken = await this.tokensService.saveToken(
        user.id,
        tokens.refreshToken,
      );
      return { ...tokens, user: payload };
    } else {
      throw new BadRequestException('Password is not correct');
    }
  }

  async logout(refreshToken: string) {
    const token = await this.tokensService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        activationLink,
      },
    });

    if (!user) {
      throw new BadRequestException('Activation link is not corect');
    }

    const activatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActivated: true,
      },
    });

    const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(activatedUser);
    const tokens = await this.tokensService.generateTokens({ ...payload });
    const refreshToken = await this.tokensService.saveToken(
      activatedUser.id,
      tokens.refreshToken,
    );
    return { ...tokens, user: payload };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is empty');
    }

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const refreshTokenFromDB = await this.tokensService.findToken(refreshToken);
    if (!userData || !refreshTokenFromDB) {
      throw new UnauthorizedException('Refresh token is not valid anymore');
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(user);
    const tokens = await this.tokensService.generateTokens({ ...payload });
    const newRefreshToken = await this.tokensService.saveToken(
      user.id,
      tokens.refreshToken,
    );
    return { ...tokens, user: payload };
  }
}
