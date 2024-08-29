import {FriendshipModel} from "../../models/friendship.model";

export interface FriendshipState{
  friendships: FriendshipModel[] | null;
  friendshipsIsLoading: boolean;
  friendshipsIstError: string;
  friendshipSuccess: boolean;

  isCreating: boolean;
  isCreateSuccess: boolean;
  createErrorMessage: string;

  friendshipStatus: FriendshipModel | null;
  friendshipStatusIsLoading: boolean;
  friendshipStatusError: string;
  friendshipStatusSuccess: boolean;

  isDeleting: boolean;
  isDeleteSuccess: boolean;
  deleteErrorMessage: string;

  friendRequestList: FriendshipModel[] | null;
  friendRequestListIsLoading: boolean;
  friendRequestListError: string;
  friendRequestListSuccess: boolean;

  isAccepting: boolean;
  isAcceptSuccess: boolean;
  acceptErrorMessage: string;

  mutualFriends: number;
  isGettingMutualFriends: boolean;
  isGetMutualFriendsSuccess: boolean;
  isGetMutualFriendsError: string;

  suggestedFriends: any[] | null;
  suggestedFriendsIsLoading: boolean;
  suggestedFriendsError: string;
  suggestedFriendsSuccess: boolean;

  clearFriendshipStateLoading: boolean;
  clearFriendshipStateSuccess: boolean;
  clearFriendshipStateError: string;
}
