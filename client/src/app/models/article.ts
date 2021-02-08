export interface Article {
  _id: string;

  title: string;

  author: string;

  url: string;

  createdAt: string;

  deleted: boolean;

  sourceId: string;

  showDeleteButton?: boolean;
}
