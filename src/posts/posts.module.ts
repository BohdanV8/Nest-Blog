import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [TokensModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
