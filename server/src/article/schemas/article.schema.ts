import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false, default: false })
  deleted: boolean;

  @Prop({ required: true })
  sourceId: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
