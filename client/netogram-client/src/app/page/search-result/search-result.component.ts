import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatButton, MatFabButton } from "@angular/material/button";
import { AsyncPipe, Location, NgForOf, NgIf } from "@angular/common";
import { PostComponent } from "../../components/post/post.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SearchState } from "../../ngrx/search/search.state";
import * as SearchActions from "../../ngrx/search/search.actions";
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/post.model';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    NgForOf,
    NgIf,
    PostComponent,
    NavbarComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton,
    AsyncPipe
  ],
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  profiles$: Observable<ProfileModel[]>;
  posts$: Observable<PostModel[]>;
  isLoading$: Observable<boolean>;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<{ search: SearchState }>
  ) {
    this.profiles$ = this.store.select(state => state.search.searchResult?.profiles || []);
    this.posts$ = this.store.select(state => state.search.searchResult?.posts || [])
      .pipe(
        map(posts => posts.filter(post => post.uid != null))
      );
    this.isLoading$ = this.store.select(state => state.search.searchResultLoading);
  }

  ngOnInit() {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['search'];
        if (this.searchTerm) {
          this.store.dispatch(SearchActions.search({ query: this.searchTerm }));
          console.log(this.searchTerm);
        }
      })
    );
    this.posts$.subscribe((posts) => {
      console.log('Posts in SearchResultComponent:', posts);
    });
    this.profiles$.subscribe((profiles) => {
      console.log('Profiles in SearchResultComponent:', profiles);
    });
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}
