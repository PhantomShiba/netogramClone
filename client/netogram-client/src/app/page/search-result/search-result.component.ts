import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import {MatCard, MatCardAvatar, MatCardContent} from '@angular/material/card';
=======
import { MatCard, MatCardContent } from '@angular/material/card';
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton, MatFabButton } from '@angular/material/button';
import { AsyncPipe, Location, NgForOf } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
<<<<<<< HEAD
import {Observable, startWith, Subscription} from 'rxjs';
=======
import { Observable, Subscription } from 'rxjs';
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c
import { SearchState } from '../../ngrx/search/search.state';
import * as SearchActions from '../../ngrx/search/search.actions';
import { ProfileModel } from '../../models/profile.model';
import { PostModel } from '../../models/post.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
<<<<<<< HEAD
import { Router } from '@angular/router';
import * as PostActions from "../../ngrx/post/post.actions";
import * as ProfileActions from "../../ngrx/profile/profile.actions";

=======
import {ProfileState} from "../../ngrx/profile/profile.state";
import * as FriendshipActions from "../../ngrx/friend-ship/friendship.actions";
import {FriendshipModel} from "../../models/friendship.model";
import {getFriendshipStatus} from "../../ngrx/friend-ship/friendship.actions";
import {FriendshipState} from "../../ngrx/friend-ship/friendship.state";
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c

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
<<<<<<< HEAD
    MatCardAvatar,
=======
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c
  ],
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  searchTerm: string = '';

<<<<<<< HEAD
=======
  friendRequestSentData: FriendshipModel = {
    id: 0,
    uid: "",
    friendUid: "",
    status: ""
  };

  isCreateSuccess$ = this.store.select('friendship', 'isCreateSuccess');
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c
  searchResult$ = this.store.select('search', 'searchResult');
  subscription: Subscription[] = [];

  posts: PostModel[] = [];
  profiles: ProfileModel[] = [];
<<<<<<< HEAD

=======
  status: any[] = [];
  mineUid!: string;
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c

  constructor(
    private route: ActivatedRoute,
    private location: Location,
<<<<<<< HEAD
    private router: Router,
    private store: Store<{ search: SearchState }>,
  ) {}
=======
    private store: Store<{ search: SearchState,
    profile: ProfileState,
    friendship: FriendshipState}>,
  ) {
    this.mineProfile$.subscribe((mineProfile) => {
      if(mineProfile) {
        this.mineUid = mineProfile.uid;
      }
    })
  }
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c

  getStatusSuccess$ = this.store.select('friendship', 'friendshipStatusSuccess');
  friendshipStatus$ = this.store.select('friendship', 'friendshipStatus');
  mineProfile$ = this.store.select('profile', 'mine');

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
<<<<<<< HEAD
=======

    for (let profile of this.profiles){
      this.store.dispatch(getFriendshipStatus({friendUid: profile.uid}));

      this.getStatusSuccess$.subscribe((success) => {
        if (success) {
          this.friendshipStatus$.subscribe((status) => {
            this.status.push(status);
          })}
      })
    }
    console.log('status', this.status);
  }

  addFriendSearch(friendUid: string) {
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {...this.friendRequestSentData, friendUid: friendUid, uid: mineProfile.uid};
      }
    })
    this.friendRequestSentData = {...this.friendRequestSentData, friendUid};
    console.log(this.friendRequestSentData);
    this.store.dispatch(FriendshipActions.addFriend({friendShipModel: this.friendRequestSentData}));

    this.isCreateSuccess$.subscribe((isSuggestedFriendsLoaded) => {
      if (isSuggestedFriendsLoaded){
        this.store.dispatch(getFriendshipStatus({friendUid}));
      }
    })
>>>>>>> ea7e7c16fb5821eaaafc9506658fda68b3dcc24c
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
