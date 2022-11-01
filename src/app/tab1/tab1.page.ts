import { IonInfiniteScroll } from '@ionic/angular';
import { NewService } from './../services/new.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Article, Newresponse } from '../interfaces';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild ( IonInfiniteScroll, {static: true}) infiteScroll: IonInfiniteScroll;
  public articles: Article[] = [];

  constructor( private newService: NewService) {}

  ngOnInit() {
    this.newService.getTopHeadlines()
    .subscribe( articles => this.articles.push( ...articles ) );
    }
    loadData() {
      this.newService.getTopHeadlinesByCategory( 'business', true )
      .subscribe( articles => {
        if ( articles.length === this.articles.length){
          this.infiteScroll.disabled = true;

          return;
        }

        this.articles = articles;
        this.infiteScroll.complete();






      });

    }

}
