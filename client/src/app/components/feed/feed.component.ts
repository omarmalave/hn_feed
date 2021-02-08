import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/article';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  articles: Article[] = [];
  error: any;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.articlesService.getAll().subscribe({
      next: (articles) => (this.articles = articles),
      error: (err) => (this.error = err),
    });
  }

  openArticle(article: Article): void {
    window.open(article.url, '_blank');
  }

  toggleDeleteButton(article: Article, val: boolean): void {
    article.showDeleteButton = val;
  }

  trackByFn(index: number, item: Article): string {
    return item._id;
  }

  deleteArticle(event: any, article: Article, index: number): void {
    event.stopPropagation();
    this.articlesService.delete(article._id).subscribe({
      next: () => {
        this.articles.splice(index, 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
