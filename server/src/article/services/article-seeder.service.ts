import {
  HttpService,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { map } from 'rxjs/operators';

@Injectable()
export class ArticleSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ArticleSeederService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private httpService: HttpService,
  ) {}

  onApplicationBootstrap() {
    this.getHNDataAndPopulateDb();
  }

  @Cron(CronExpression.EVERY_HOUR)
  getHNDataAndPopulateDb(): void {
    const url = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';

    this.httpService
      .get(url)
      .pipe(
        map((res) => (res.data?.hits instanceof Array && res.data.hits) || []),
      )
      .subscribe({
        next: (hits) => this.saveHNHits(hits),
        error: (err) => this.logger.error(err.message),
      });
  }

  async saveHNHits(hits: any[]): Promise<void> {
    for (const hit of hits) {
      try {
        const {
          created_at,
          story_title,
          story_url,
          title,
          url,
          author,
          objectID,
          story_id,
        } = hit;

        const existingArticle = await this.articleModel
          .findOne({ sourceId: story_id || objectID })
          .exec();

        if (existingArticle) {
          continue;
        }

        const article = new this.articleModel({
          createdAt: created_at,
          title: story_title || title,
          url: story_url || url,
          author: author,
          sourceId: story_id || objectID,
        });
        await article.save();
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
