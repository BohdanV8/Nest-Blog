import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const data = { ...createPostDto }
    delete data.categories
    const post = await this.prisma.post.create({
      data
    });
    const categories = []
    for(let i = 0; i < createPostDto.categories.length; i++) {
      const categoryInPost = await this.prisma.categoryInPost.create({
        data: {
          postId: post.id,
          categoryId: createPostDto.categories[i]
        }
      })
      categories.push(categoryInPost)
    }

    return { ...post, categories}
  }

  findAll() {
    return this.prisma.post.findMany();
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

  addCategory(data: AddCategoryDto) {
    this.prisma.categoryInPost.create({
      data
    })
  }

  removeCategory(id: number) {
    this.prisma.categoryInPost.delete({
      where: {
        id
      }
    })
  }
}
