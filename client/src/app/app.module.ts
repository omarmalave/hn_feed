import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FeedComponent } from './components/feed/feed.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomDatePipe } from './pipes/custom-date.pipe';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FeedComponent, CustomDatePipe],
  imports: [BrowserModule, HttpClientModule, FlexLayoutModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
