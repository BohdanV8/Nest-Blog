import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateLikeDto) {
    return this.prisma.like.create({
      data,
    });
  }

  findAll() {
    return this.prisma.like.findMany();
  }

  findOne(id: number) {
    return this.prisma.like.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return this.prisma.like.update({
      where: {
        id,
      },
      data: {
        ...updateLikeDto,
      },
    });
  }

  remove(id: number) {
    return this.prisma.like.delete({
      where: {
        id,
      },
    });
  }
}
