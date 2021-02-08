import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ArticleService } from '../services/article.service';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const _id = await this.articleService.remove(id);
    return { id: _id };
  }
}
