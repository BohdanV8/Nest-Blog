import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/customDecorators/roles.decorator';
import { AddCategoryDto } from './dto/add-category.dto';
@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @Roles('user', 'admin')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Roles('user', 'admin')
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('user', 'admin')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post('addCategory')
  @Roles('user', 'admin')
  addCategory(@Body() body: AddCategoryDto) {
    return this.postsService.addCategory(body)
  }

  removeCategory(@Param('id') id: string) {
    this.postsService.removeCategory(+id);
  }
}
