import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongoConnection,
  rootMongooseTestModule,
} from '../../../test/util/mongo-in-memory';
import { ArticleDocument, ArticleSchema } from '../schemas/article.schema';
import { Model } from 'mongoose';
import { articlesMock } from '../../../test/mocks/articles-mock';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ArticleService', () => {
  let service: ArticleService;
  let model: Model<ArticleDocument>;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(mongo),
        MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
      ],
      providers: [ArticleService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    model = module.get<Model<ArticleDocument>>('ArticleModel');
    await model.insertMany(articlesMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all non deleted articles with findAll method', async () => {
    const articles = await service.findAll();
    expect(articles.length).toEqual(2);
  });

  it('should update the deleted field of an article with given id with the remove method', async () => {
    let article = await model.findOne({ deleted: false });
    const id = article._id;
    await service.remove(id);
    article = await model.findById(id);
    expect(article.deleted).toEqual(true);
  });

  afterAll(async () => {
    await closeInMongoConnection(mongo);
  });
});
