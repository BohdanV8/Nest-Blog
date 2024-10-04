import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { PrismaService } from 'src/prisma.service';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [TokensModule, MailsModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
