import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Scroll } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { MaterialModule } from '../../../shared/material.module';
import { AsyncPipe, Location } from '@angular/common';
import { PostComponent } from '../../../components/post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { Store } from '@ngrx/store';
import { PostState } from '../../../ngrx/post/post.state';
import { ProfileState } from '../../../ngrx/profile/profile.state';
import * as ProfileActions from '../../../ngrx/profile/profile.actions';
import * as PostActions from '../../../ngrx/post/post.actions';
import { Subscription } from 'rxjs';
import { PostModel, PostResponse } from '../../../models/post.model';
import { ProfileModel } from '../../../models/profile.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {FriendshipState} from "../../../ngrx/friend-ship/friendship.state";
import * as FriendshipActions from "../../../ngrx/friend-ship/friendship.actions";
import {FriendShipModel} from "../../../models/friend-ship.model";
import {getMutualFriends} from "../../../ngrx/friend-ship/friendship.actions";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MaterialModule,
    PostComponent,
    AsyncPipe,
    InfiniteScrollDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {

  friendRequestSentData: FriendShipModel = {
    friendUid: '',
    status: '',
    createdAt: '',
    id: 0,
    uid: ''
  };

  constructor(
    private location: Location,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<{
      post: PostState;
      profile: ProfileState;
      friendship: FriendshipState
    }>,
  ) {
    const { uid } = this.activeRoute.snapshot.params;
    this.yourUid = uid;
    this.store.dispatch(ProfileActions.getById({ uid }));
    this.store.dispatch(
      PostActions.GetMinePost({
        uid,
        pageNumber: this.currentPage,
        limitNumber: this.size,
      }),
    );
    this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid: this.yourUid}));
    // window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'auto'});
  }

  mineUid = '';
  yourUid = '';

  subscriptions: Subscription[] = [];

  mutualFriends$ = this.store.select('friendship', 'mutualFriends');
  isUnfriendSuccess$ = this.store.select('friendship', 'isDeleteSuccess');
  isSentFriendRequestSuccess$ = this.store.select('friendship', 'isCreateSuccess');
  isGetFriendshipStatus$ = this.store.select('friendship', 'friendshipStatusSuccess');
  friendshipStatus$ = this.store.select('friendship', 'friendshipStatus');
  profileByUid$ = this.store.select('profile', 'profile');
  minePosts$ = this.store.select('post', 'minePosts');
  isGettingMinePost$ = this.store.select('post', 'isGettingMinePost');
  isGettingMine$ = this.store.select('profile', 'isGettingById');
  mineProfile$ = this.store.select('profile', 'mine');
  mineProfile: ProfileModel = <ProfileModel>{};

  currentPage = 1;
  size = 5;
  itemsCount = 0;
  tempArray: PostModel[] = [];

  minePosts: PostModel[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PostActions.ClearMinePost());
    this.store.dispatch(FriendshipActions.clearFriendshipState());
  }

  goBack(): void {
    this.location.back();
    this.store.dispatch(PostActions.ClearMinePost());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.profileByUid$.subscribe((profile) => {
        if (profile) {
          this.mineProfile = profile;
        }
      }),

      this.minePosts$.subscribe((posts) => {
        if (posts.limitNumber > 0) {
          console.log(posts);

          this.tempArray = [...this.minePosts];
          this.minePosts = [...this.tempArray, ...posts.data];
          console.log(posts);
          this.itemsCount = posts.limitNumber;
        }
      }),

      this.isGettingMine$.subscribe((isGettingMine) => {
        console.log(isGettingMine);
      }),

      this.mineProfile$.subscribe((mineProfile) => {
        if (mineProfile) {
          this.mineUid = mineProfile.uid;
        }
      }),
    );
    this.isGetFriendshipStatus$.subscribe((success) => {
      if(success) {
        this.friendshipStatus$.subscribe((status) => {
          console.log(status);
        });
      }
    })
    this.getMutualFriends();
  }

  profileEdit(): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '100px',
    });
  }

  sentFriendRequest() {
    this.friendRequestSentData = {...this.friendRequestSentData,friendUid: this.yourUid};
    this.store.dispatch(FriendshipActions.addFriend({friendShipModel: this.friendRequestSentData}));

    this.isSentFriendRequestSuccess$.subscribe((success) => {
      if(success) {
        this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid: this.yourUid}));
      }
    })
  }

  getMutualFriends() {
    if (this.mineUid != this.yourUid) {
      this.store.dispatch(FriendshipActions.getMutualFriends({uid: this.mineUid, friendUid: this.yourUid}));
    }
  }

  sendUnfriend() {
    this.store.dispatch(FriendshipActions.unfriend({friendUid: this.yourUid, uid: this.mineUid}));

    this.isUnfriendSuccess$.subscribe((success) => {
      if (success) {
        this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid: this.yourUid}));
      }
    })
  }

  onScrollDown(ev: any) {
    console.log('scrolled down mine !!', ev);
    this.currentPage += 1;
    console.log(this.currentPage);

    if (this.currentPage <= this.itemsCount) {
      console.log('get more mine post');
      this.store.dispatch(
        PostActions.GetMinePost({
          pageNumber: this.currentPage,
          limitNumber: this.size,
          uid: this.yourUid,
        }),
      );
    }
  }
}
