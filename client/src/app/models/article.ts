export interface Article {
  _id: string;

  title: string;

  author: string;

  url: string;

  createdAt: Date;

  deleted: boolean;

  sourceId: string;
}
