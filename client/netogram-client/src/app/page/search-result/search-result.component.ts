import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {MatCard, MatCardAvatar, MatCardContent} from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton, MatFabButton } from '@angular/material/button';
import { AsyncPipe, Location, NgForOf } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import {Observable, startWith, Subscription} from 'rxjs';
import { SearchState } from '../../ngrx/search/search.state';
import * as SearchActions from '../../ngrx/search/search.actions';
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/post.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
import { Router } from '@angular/router';
import * as PostActions from "../../ngrx/post/post.actions";
import * as ProfileActions from "../../ngrx/profile/profile.actions";


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatButton,
    NgForOf,
    PostComponent,
    NavbarComponent,
    RouterOutlet,
    MatIcon,
    MatFabButton,
    AsyncPipe,
    IdToAvatarPipe,
    IdToNamePipe,
    MatCardAvatar,
  ],
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  searchTerm: string = '';

  searchResult$ = this.store.select('search', 'searchResult');
  subscription: Subscription[] = [];

  posts: PostModel[] = [];
  profiles: ProfileModel[] = [];


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private store: Store<{ search: SearchState }>,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'];
      if (this.searchTerm) {
        this.store.dispatch(SearchActions.search({ query: this.searchTerm }));
      }
    });

    this.subscription.push(
      this.searchResult$.subscribe((result) => {
        if (result) {
          this.posts = result.posts;
          this.profiles = result.profiles;
          console.log('posts', this.posts);
          console.log('profile', this.profiles);
        }
      }),
    );
  }

  goBack(): void {
    this.location.back();
  }

  @Input() postUser: PostModel = <PostModel>{};

  navigateToProfile(profile: ProfileModel) {
    this.router.navigateByUrl(`/profile/${profile.uid}`).then();
    this.store.dispatch(ProfileActions.getById({ uid: profile.uid }));
  }
}
