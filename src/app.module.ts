import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // робить змінні доступними для всіх модулів
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
