import { Test, TestingModule } from '@nestjs/testing';
import { ArticleSeederService } from './article-seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongoConnection,
  rootMongooseTestModule,
} from '../../../test/util/mongo-in-memory';
import { ArticleDocument, ArticleSchema } from '../schemas/article.schema';
import { Model } from 'mongoose';
import { hitsMock } from '../../../test/mocks/hits-mock';
import { HttpModule } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ArticleSeederService', () => {
  let service: ArticleSeederService;
  let model: Model<ArticleDocument>;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(mongo),
        MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
        HttpModule,
      ],
      providers: [ArticleSeederService],
    }).compile();

    service = module.get<ArticleSeederService>(ArticleSeederService);
    model = module.get<Model<ArticleDocument>>('ArticleModel');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a list of articles with saveHNHits method', async () => {
    await service.saveHNHits(hitsMock);
    const articlesFromDb = await model.find().exec();
    expect(articlesFromDb.length).toEqual(hitsMock.length);
  });

  afterAll(async () => {
    await closeInMongoConnection(mongo);
  });
});
