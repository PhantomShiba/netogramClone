import {createAction, props} from "@ngrx/store";
import {FriendshipModel} from "../../models/friendship.model";

export const getAllFriendships = createAction('[Friendship] Get All Friendships',props<{uid: string, page: number, limit: number}>());
export const getAllFriendshipsSuccess = createAction('[Friendship] Get All Friendships Success',props<{friendships: FriendshipModel[]}>());
export const getAllFriendshipsFailure = createAction('[Friendship] Get All Friendships Error');

export const addFriend = createAction('[Friendship] Add Friend',props<{friendShipModel: FriendshipModel}>());
export const addFriendSuccess = createAction('[Friendship] Add Friend Success');
export const addFriendFailure = createAction('[Friendship] Add Friend Error');

export const getFriendshipStatus = createAction('[Friendship] Get Friendship Status',props<{friendUid: string}>());
export const getFriendshipStatusSuccess = createAction('[Friendship] Get Friendship Status Success',props<{friendshipStatus: FriendshipModel}>());
export const getFriendshipStatusFailure = createAction('[Friendship] Get Friendship Status Error');

export const unfriend = createAction('[Friendship] Unfriend',props<{friendUid: string,uid:string}>());
export const unfriendSuccess = createAction('[Friendship] Unfriend Success');
export const unfriendFailure = createAction('[Friendship] Unfriend Error');

export const getFriendRequestList = createAction('[Friendship] Get Friend Request List',props<{uid: string, page: number, limit: number}>());
export const getFriendRequestListSuccess = createAction('[Friendship] Get Friend Request List Success',props<{friendRequestList: FriendshipModel[]}>());
export const getFriendRequestListFailure = createAction('[Friendship] Get Friend Request List Error');

export const acceptFriendRequest = createAction('[Friendship] Accept Friend Request',props<{reply: FriendshipModel}>());
export const acceptFriendRequestSuccess = createAction('[Friendship] Accept Friend Request Success');
export const acceptFriendRequestFailure = createAction('[Friendship] Accept Friend Request Error');

export const getMutualFriends = createAction('[Friendship] Get Mutual Friends',props<{uid: string, friendUid: string}>());
export const getMutualFriendsSuccess = createAction('[Friendship] Get Mutual Friends Success',props<{mutualFriends: number}>());
export const getMutualFriendsFailure = createAction('[Friendship] Get Mutual Friends Error');

export const getSuggestedFriends = createAction('[Friendship] Get Suggested Friends',props<{uid: string, page: number, limit: number}>());
export const getSuggestedFriendsSuccess = createAction('[Friendship] Get Suggested Friends Success',props<{suggestedFriends: any[]}>());
export const getSuggestedFriendsFailure = createAction('[Friendship] Get Suggested Friends Error');

export const clearFriendshipState = createAction('[Friendship] Clear Friendship State');
export const clearFriendshipStateSuccess = createAction('[Friendship] Clear Friendship State Success');
export const clearFriendshipStateFailure = createAction('[Friendship] Clear Friendship State Error');
