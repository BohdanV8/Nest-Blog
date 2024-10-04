import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { TokensModule } from './tokens/tokens.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule, CommentsModule, LikesModule, CategoriesModule, FilesModule, TokensModule, MailsModule]
})
export class AppModule {}
