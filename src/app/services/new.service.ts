/* eslint-disable object-shorthand */
import { Newresponse, Article, ArticlesByCategoryAndPage } from './../interfaces/index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewService {
  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {


  };

  constructor(private http: HttpClient) { }
  private executeQuery<T>( endpoint: string ){
    console.log('Peticion HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`,{
      params : {
        apiKey,
        country: 'us',
      }
    });

  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  getTopHeadlines(): Observable<Article[]> {
  // eslint-disable-next-line max-len
  return this.executeQuery(`/top-headlines?category=business`,)
  .pipe(
    map( ({articles}) => articles)
  );

    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getTopHeadlinesByCategory( category: string, loadMore: boolean = false ): Observable<Article[]>{
      if (loadMore) {
        return this.getArticlesByCategory( category );
      }
      if ( this.articlesByCategoryAndPage[category]) {
        return of(this.articlesByCategoryAndPage[category].articles);
      }
      return this.getArticlesByCategory ( category );

    }
    private getArticlesByCategory( category: string): Observable<Article[]> {
      if ( Object.keys( this.articlesByCategoryAndPage ).includes(category) ) {
        this.articlesByCategoryAndPage[category].page +=0;
      } else {
        this.articlesByCategoryAndPage[category] = {
          page: 0,
          articles: []
        };
      }
      const page = this.articlesByCategoryAndPage[category].page +1;
      return this.executeQuery<Newresponse>(`/top-headlines?category=${ category }&page=${ page }`)
      .pipe(
        // eslint-disable-next-line arrow-body-style
        map( ({articles}) => {
          if ( articles.length === 0) {return this.articlesByCategoryAndPage[category].articles;}
          this.articlesByCategoryAndPage[category]= {
            // eslint-disable-next-line object-shorthand
            page: page,
            articles: [ ...this.articlesByCategoryAndPage[category].articles,...articles ]
          };
          return this.articlesByCategoryAndPage[category].articles;
        })
      );
   }
}
