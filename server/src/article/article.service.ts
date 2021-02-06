import {
  HttpService,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { map } from 'rxjs/operators';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private httpService: HttpService,
  ) {}

  findAll() {
    return this.articleModel.find({ deleted: false }).exec();
  }

  async remove(id: string) {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.deleted = true;
    return article.save();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  getHNDataAndPopulateDb(): void {
    const url = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';

    this.httpService
      .get(url)
      .pipe(
        map((res) => (res.data?.hits instanceof Array && res.data.hits) || []),
      )
      .subscribe((hits) => this.saveHNHits(hits), this.logger.error);
  }

  async saveHNHits(hits: any[]): Promise<void> {
    for (const hit of hits) {
      try {
        const existingArticle = await this.articleModel
          .findOne({ storyId: hit.story_id })
          .exec();

        if (!existingArticle) {
          const article = new this.articleModel({
            createdAt: hit.created_at,
            title: hit.story_title || hit.title,
            url: hit.story_url || hit.url,
            author: hit.author,
            storyId: hit.story_id,
          });

          article.save();
        }
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  @Timeout(1000)
  seeder(): void {
    console.log(this.articleModel);
    if (!this.articleModel) {
      this.logger.log('y entonc');
      return;
    }
    this.getHNDataAndPopulateDb();
  }
}
