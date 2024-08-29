import {FriendshipState} from "./friendship.state";
import {createReducer, on} from "@ngrx/store";
import * as FriendshipActions from "./friendship.actions";

const initalState: FriendshipState = {
  friendships: [],
  friendshipsIsLoading: false,
  friendshipsIstError: '',
  friendshipSuccess: false,

  isCreating: false,
  isCreateSuccess: false,
  createErrorMessage: '',

  friendshipStatus: null,
  friendshipStatusIsLoading: false,
  friendshipStatusError: '',
  friendshipStatusSuccess: false,

  deleteErrorMessage: '',
  isDeleteSuccess: false,
  isDeleting: false,

  friendRequestList: [],
  friendRequestListIsLoading: false,
  friendRequestListError: '',
  friendRequestListSuccess: false,

  isAccepting: false,
  isAcceptSuccess: false,
  acceptErrorMessage: '',

  mutualFriends: 0,
  isGettingMutualFriends: false,
  isGetMutualFriendsSuccess: false,
  isGetMutualFriendsError: '',

  suggestedFriends: [],
  suggestedFriendsIsLoading: false,
  suggestedFriendsError: '',
  suggestedFriendsSuccess: false,

    clearFriendshipStateLoading: false,
    clearFriendshipStateSuccess: false,
    clearFriendshipStateError: '',
};

export const friendshipReducer = createReducer(
  initalState,
  on(FriendshipActions.getAllFriendships, (state, action) => {
    console.log(action.type);
    return <FriendshipState>{
      ...state,
      friendshipsIsLoading: true,
      friendshipSuccess: false,
    };
  }),
  on(FriendshipActions.getAllFriendshipsSuccess, (state, action) => {
    console.log(action.type);
    return <FriendshipState>{
      ...state,
      friendshipsIsLoading: false,
      friendshipSuccess: true,
      friendships: action.friendships,
    };
  }),
  on(FriendshipActions.getAllFriendshipsFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendshipsIsLoading: false,
      friendshipSuccess: false,
      friendshipsIstError: 'Error loading friendships',
    }
  }),
  on(FriendshipActions.addFriend, (state, action) => {
    return <FriendshipState>{
      ...state,
      isCreating: true,
      isCreateSuccess: false,
    }
  }),
  on(FriendshipActions.addFriendSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      isCreating: false,
      isCreateSuccess: true,
    }
  }),
  on(FriendshipActions.addFriendFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createErrorMessage: 'Error creating friendship',
    }
  }),
  on(FriendshipActions.getFriendshipStatus, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendshipStatusIsLoading: true,
      friendshipStatusSuccess: false,
    }
  }),

  on(FriendshipActions.getFriendshipStatusSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendshipStatusIsLoading: false,
      friendshipStatusSuccess: true,
      friendshipStatus: action.friendshipStatus,
    }
  }),

  on(FriendshipActions.getFriendshipStatusFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendshipStatusIsLoading: false,
      friendshipStatusSuccess: false,
      friendshipStatusError: 'Error loading friendship status',
    }
  }),
  on(FriendshipActions.unfriend, (state, action) => {
    console.log(action.type);
    return <FriendshipState>{
      ...state,
      isDeleting: true,
      isDeleteSuccess: false,
    }
  }),
  on(FriendshipActions.unfriendSuccess, (state, action) => {
    console.log(action.type);
    return <FriendshipState>{
      ...state,
      isDeleting: false,
      isDeleteSuccess: true,
    }
  }),
  on(FriendshipActions.unfriendFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      isDeleting: false,
      isDeleteSuccess: false,
      deleteErrorMessage: 'Error deleting friendship',
    }
  }),
  on(FriendshipActions.getFriendRequestList, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendRequestListIsLoading: true,
      friendRequestListSuccess: false,
    }
  }),
  on(FriendshipActions.getFriendRequestListSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendRequestListIsLoading: false,
      friendRequestListSuccess: true,
      friendRequestList: action.friendRequestList,
    }
  }),
  on(FriendshipActions.getFriendRequestListFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      friendRequestListIsLoading: false,
      friendRequestListSuccess: false,
      friendRequestListError: 'Error loading friend request list',
    }
  }),
  on(FriendshipActions.acceptFriendRequest, (state, action) => {
    return <FriendshipState>{
      ...state,
      isAccepting: true,
      isAcceptSuccess: false,
    }
  }),
  on(FriendshipActions.acceptFriendRequestSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      isAccepting: false,
      isAcceptSuccess: true,
    }
  }),
  on(FriendshipActions.acceptFriendRequestFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      isAccepting: false,
      isAcceptSuccess: false,
      acceptErrorMessage: 'Error accepting friend request',
    }
  }),
  on(FriendshipActions.getMutualFriends, (state, action) => {
    return <FriendshipState>{
      ...state,
      isGettingMutualFriends: true,
      isGetMutualFriendsSuccess: false,
    }
  }),
  on(FriendshipActions.getMutualFriendsSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      isGettingMutualFriends: false,
      isGetMutualFriendsSuccess: true,
      mutualFriends: action.mutualFriends,
    }
  }),
  on(FriendshipActions.getMutualFriendsFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      isGettingMutualFriends: false,
      isGetMutualFriendsSuccess: false,
      isGetMutualFriendsError: 'Error loading mutual friends',
    }
  }),
  on(FriendshipActions.getSuggestedFriends, (state, action) => {
    return <FriendshipState>{
      ...state,
      suggestedFriendsIsLoading: true,
      suggestedFriendsSuccess: false,
    }
  }),
  on(FriendshipActions.getSuggestedFriendsSuccess, (state, action) => {
    return <FriendshipState>{
      ...state,
      suggestedFriendsIsLoading: false,
      suggestedFriendsSuccess: true,
      suggestedFriends: action.suggestedFriends,
    }
  }),
  on(FriendshipActions.getSuggestedFriendsFailure, (state, action) => {
    return <FriendshipState>{
      ...state,
      suggestedFriendsIsLoading: false,
      suggestedFriendsSuccess: false,
      suggestedFriendsError: 'Error loading suggested friends',
    }
  }),
    on(FriendshipActions.clearFriendshipState, (state, action) => {
        return <FriendshipState>{
        ...state,
        clearFriendshipStateLoading: true,
        clearFriendshipStateSuccess: false,
        }
    }),
    on(FriendshipActions.clearFriendshipStateSuccess, (state, action) => {
        return initalState;
    }),
    on(FriendshipActions.clearFriendshipStateFailure, (state, action) => {
        return <FriendshipState>{
        ...state,
        clearFriendshipStateLoading: false,
        clearFriendshipStateSuccess: false,
        clearFriendshipStateError: 'Error clearing friendship state',
        }
    }),
)
