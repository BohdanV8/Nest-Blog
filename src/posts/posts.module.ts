import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
