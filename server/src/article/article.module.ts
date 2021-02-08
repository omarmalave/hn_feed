import { HttpModule, Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ArticleSeederService } from './services/article-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    HttpModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleSeederService],
})
export class ArticleModule {}
