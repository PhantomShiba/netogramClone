import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CommentService} from "../../services/comment/comment.service";
import * as FriendshipActions from "./friendship.actions";
import {exhaustMap, mergeMap, of, switchMap} from "rxjs";
import {FriendShipService} from "../../services/friend-ship/friend-ship.service";
import {catchError, map} from "rxjs/operators";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable()
export class FriendshipEffects {

  constructor(
    private actions$: Actions,
    private friendshipService: FriendShipService
  ) {
  }

  getAllFriendship$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.getAllFriendships),
    mergeMap((action) => this.friendshipService.getFriendList(action.uid, action.page, action.limit).pipe(
      map((friendships) => {
        return FriendshipActions.getAllFriendshipsSuccess({ friendships })
      }),
      catchError(() => of(FriendshipActions.getAllFriendshipsFailure()))
    ))
  ));

  createFriendship$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.addFriend),
    mergeMap((action) => this.friendshipService.addFriend(action.friendShipModel).pipe(
      map(() => {
        return FriendshipActions.addFriendSuccess()
      }),
      catchError(() => of(FriendshipActions.addFriendFailure
  ))
    ))
  ));

  getFriendshipStatus$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.getFriendshipStatus),
    exhaustMap((action) => this.friendshipService.getFriendshipStatus(action.friendUid).pipe(
      map((friendshipStatus) => {
        return FriendshipActions.getFriendshipStatusSuccess({ friendshipStatus })
      }),
      catchError(() => of(FriendshipActions.getFriendshipStatusFailure()))
    ))
  ));

  unfriend$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.unfriend),
    exhaustMap((action) => this.friendshipService.unfriend(action.friendUid,action.uid).pipe(
      map(() => {
        return FriendshipActions.unfriendSuccess()
      }),
      catchError(() => of(FriendshipActions.unfriendFailure()))
    ))
  ));

  getFriendRequestList$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.getFriendRequestList),
    mergeMap((action) => this.friendshipService.getFriendRequestList(action.uid, action.page, action.limit).pipe(
      map((friendRequestList) => {
        return FriendshipActions.getFriendRequestListSuccess({ friendRequestList })
      }),
      catchError(() => of(FriendshipActions.getFriendRequestListFailure()))
    ))
  ));

  acceptFriendRequest$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.acceptFriendRequest),
    exhaustMap((action) => this.friendshipService.replyFriendRequest(action.reply).pipe(
      map(() => {
        return FriendshipActions.acceptFriendRequestSuccess()
      }),
      catchError(() => of(FriendshipActions.acceptFriendRequestFailure()))
    ))
  ));

  getMutualFriends$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.getMutualFriends),
    mergeMap((action) => this.friendshipService.getMutualFriends(action.uid, action.friendUid).pipe(
      map((mutualFriends) => {
        return FriendshipActions.getMutualFriendsSuccess({ mutualFriends })
      }),
      catchError(() => of(FriendshipActions.getMutualFriendsFailure()))
    ))
  ));

  getSuggestedFriends$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.getSuggestedFriends),
    mergeMap((action) => this.friendshipService.getSuggestedFriends(action.uid, action.page, action.limit).pipe(
      map((suggestedFriends) => {
        return FriendshipActions.getSuggestedFriendsSuccess({ suggestedFriends })
      }),
      catchError(() => of(FriendshipActions.getSuggestedFriendsFailure()))
    ))
  ));

  clearFriendshipState$ = createEffect(() => this.actions$.pipe(
    ofType(FriendshipActions.clearFriendshipState),
    map(() => {
      return FriendshipActions.clearFriendshipStateSuccess()
    }),
    catchError(() => of(FriendshipActions.clearFriendshipStateFailure()))
  ));
}
