import { HttpModule, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ArticleSeederService } from './ArticleSeederService';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    HttpModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleSeederService],
})
export class ArticleModule {}
