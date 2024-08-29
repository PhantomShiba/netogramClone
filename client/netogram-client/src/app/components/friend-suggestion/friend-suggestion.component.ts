import { Component, OnInit } from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatButton, MatFabAnchor} from "@angular/material/button";
import {MaterialModule} from "../../shared/material.module";
import {Store} from "@ngrx/store";
import {FriendshipState} from "../../ngrx/friend-ship/friendship.state";
import * as FriendshipActions from "../../ngrx/friend-ship/friendship.actions";
import {ProfileState} from "../../ngrx/profile/profile.state";
import {IdToNamePipe} from "../../shared/pipes/id-to-name.pipe";
import {IdToAvatarPipe} from "../../shared/pipes/id-to-avatar.pipe";
import {FriendshipModel} from "../../models/friendship.model";
import {FriendShipModel} from "../../models/friend-ship.model";
import {getFriendshipStatus} from "../../ngrx/friend-ship/friendship.actions";

@Component({
  selector: 'app-friend-suggestion',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatFabAnchor,
    MaterialModule,
    AsyncPipe,
    IdToNamePipe,
    IdToAvatarPipe
  ],
  templateUrl: './friend-suggestion.component.html',
  styleUrl: './friend-suggestion.component.scss'
})
export class FriendSuggestionComponent {

  isRemoved$ = this.store.select('friendship', 'isDeleteSuccess');
  friendSatus$ = this.store.select('friendship', 'friendshipStatus');
  isSuggestedFriendsLoading$ = this.store.select('friendship', 'isCreating');
  isSuggestedFriendsLoaded$ = this.store.select('friendship', 'isCreateSuccess');

  suggetedFriends$ = this.store.select('friendship', 'suggestedFriends');
  mineProfile$ = this.store.select('profile', 'mine');

  friendRequestSentData: FriendshipModel = {
    id: 0,
    uid: "",
    friendUid: "",
    status: ""
  };

  constructor(private store: Store<{
  friendship: FriendshipState,
  profile: ProfileState}>) {
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.store.dispatch(FriendshipActions.getSuggestedFriends({uid: mineProfile.uid,page:1,limit:5} ));
      }
    })

  }

  addFriend(friendUid: string){
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {...this.friendRequestSentData, friendUid: friendUid, uid: mineProfile.uid};
      }
    })
    this.friendRequestSentData = {...this.friendRequestSentData, friendUid};
    console.log(this.friendRequestSentData);
    this.store.dispatch(FriendshipActions.addFriend({friendShipModel: this.friendRequestSentData}));

    this.isSuggestedFriendsLoaded$.subscribe((isSuggestedFriendsLoaded) => {
      if (isSuggestedFriendsLoaded){
        this.store.dispatch(getFriendshipStatus({friendUid}));
      }
    })


    // this.isSuggestedFriendsLoaded$.subscribe((isSuggestedFriendsLoaded) => {
    //   if (isSuggestedFriendsLoaded) {
    //     this.mineProfile$.subscribe((mineProfile) => {
    //       if (mineProfile) {
    //         this.store.dispatch(FriendshipActions.getSuggestedFriends({uid: mineProfile.uid,page:1,limit:5} ));
    //     }
    //   })
    // }})
  }

  removeRequest(friendUid: string){
    this.mineProfile$.subscribe((mineProfile) => {
      if (mineProfile) {
        this.friendRequestSentData = {...this.friendRequestSentData, friendUid: friendUid, uid: mineProfile.uid};
      }
    })

    this.store.dispatch(FriendshipActions.unfriend({uid: this.friendRequestSentData.uid, friendUid: this.friendRequestSentData.friendUid}));
    this.isRemoved$.subscribe((isRemoved) => {
      this.store.dispatch(FriendshipActions.getFriendshipStatus({friendUid}));
    })
  }

  ngOnInit(): void {}
}
