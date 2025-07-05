import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const data = { ...createPostDto };
    delete data.categories;
    const post = await this.prisma.post.create({
      data,
    });
    // const categories = []
    // for(let i = 0; i < createPostDto.categories.length; i++) {
    //   const categoryInPost = await this.prisma.categoryInPost.create({
    //     data: {
    //       postId: post.id,
    //       categoryId: createPostDto.categories[i]
    //     }
    //   })
    //   categories.push(categoryInPost)
    // }

    return { ...post };
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findUserPosts(authorId: number) {
    return this.prisma.post.findMany({ where: { authorId } });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: {
        id,
      },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
