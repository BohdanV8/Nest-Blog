import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body, Res, Req, Param, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async registration(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const filePath = `uploads/${file.filename}`;
    const userData = await this.authService.registration({
      ...createUserDto,
      photo: filePath,
    });
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(body.email, body.password);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const token = this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
    return token;
  }

  @Get('/activate/:link')
  async activateLink(
    @Param('link') link: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.activate(link);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }

  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const userData = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }
}
