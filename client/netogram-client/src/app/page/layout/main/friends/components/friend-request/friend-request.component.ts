import { Component } from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {MaterialModule} from "../../../../../../shared/material.module";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {Store} from "@ngrx/store";
import {ProfileState} from "../../../../../../ngrx/profile/profile.state";
import {FriendshipState} from "../../../../../../ngrx/friend-ship/friendship.state";
import * as FriendshipActions from "../../../../../../ngrx/friend-ship/friendship.actions";
import {IdToAvatarPipe} from "../../../../../../shared/pipes/id-to-avatar.pipe";
import {IdToNamePipe} from "../../../../../../shared/pipes/id-to-name.pipe";
import {FriendshipModel} from "../../../../../../models/friendship.model";


@Component({
  selector: 'app-friend-request',
  standalone: true,
  imports: [MaterialModule, SlicePipe, NgForOf, AsyncPipe, IdToAvatarPipe, IdToNamePipe],
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.scss'
})
export class FriendRequestComponent {

  start = 0;
  end = 5;

  friendData:FriendshipModel = {
    uid: '',
    friendUid: '',
    id: 0,
    status: '',
  }

  constructor(private store: Store<{ profile: ProfileState;
  friendship: FriendshipState
  }>) {
    this.mineProfile$.subscribe((profile) => {
      this.store.dispatch(FriendshipActions.getFriendRequestList({ uid: profile!.uid, limit:5,page:1 }));
    })
  }

  isAcceptFriendRequestSuccess$ = this.store.select('friendship','isAcceptSuccess');
  isdeleteFriendRequestSuccess$ = this.store.select('friendship','isDeleteSuccess');
  mineProfile$ = this.store.select('profile','mine');
  friendRequestList$ = this.store.select('friendship','friendRequestList');

  ngOnInit() {
    this.mineProfile$.subscribe((profile) => {
      if (profile) {
        console.log(profile);
      }
    })
  }

  deleteFriendRequest(friendUid: string) {
    this.mineProfile$.subscribe((profile) => {
      if (profile) {
        this.store.dispatch(FriendshipActions.unfriend({ uid: friendUid, friendUid: profile.uid }));
      }
    })

    this.isdeleteFriendRequestSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.mineProfile$.subscribe((profile) => {
          if (profile) {
            this.store.dispatch(FriendshipActions.getFriendRequestList({ uid: profile!.uid, limit:5,page:1 }));
          }
        })
      }
    })
  }

  acceptFriendRequest(friendUid: string) {
    this.friendData = {...this.friendData, friendUid: friendUid}
    this.mineProfile$.subscribe((profile) => {
      if (profile) {
        this.friendData = {...this.friendData, uid: profile.uid}
        this.store.dispatch(FriendshipActions.acceptFriendRequest({reply: this.friendData}));
      }
    })

    this.isAcceptFriendRequestSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.mineProfile$.subscribe((profile) => {
          if (profile) {
            this.store.dispatch(FriendshipActions.getFriendRequestList({ uid: profile!.uid, limit:5,page:1 }));
          }
        })
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.start = event.pageIndex * event.pageSize;
    this.end = this.start + event.pageSize;
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
