import { createReducer, on } from '@ngrx/store';
import * as CommentActions from './comment.actions';
import { CommentState } from './comment.state';

const initalState: CommentState = {
  comments: [],
  isGetCommentsLoading: false,
  isGetCommentsSuccess: false,
  errorGetComments: '',

  loading: false,
  error: '',
  isCreateCommentSuccess: false,

  commentsCount: 0,
  isLoadCommentsCount: false,
  errorCommentsCount: '',
  isSuccessCommentCount: false,
};

export const commentReducer = createReducer(
  initalState,
  on(CommentActions.getComments, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      isGetCommentsSuccess: false,
      isGetCommentsLoading: true,
    };
  }),
  on(CommentActions.getCommentsSuccess, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      isGetCommentsLoading: false,
      isGetCommentsSuccess: true,
      comments: action.comments,
      commentsCount: action.comments.length,
    };
  }),
  on(CommentActions.getCommentsFailure, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      isGetCommentsSuccess: false,
      isGetCommentsLoading: false,
      error: 'Error loading comments',
    };
  }),

  on(CommentActions.createComment, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      isCreateCommentSuccess: false,
      loading: true,
    };
  }),
  on(CommentActions.createCommentSuccess, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      isCreateCommentSuccess: true,
      loading: false,
    };
  }),
  on(CommentActions.createCommentFailure, (state, action) => {
    console.log(action.type);
    return <CommentState>{
      ...state,
      loading: false,
      isCreateCommentSuccess: false,
      error: 'Error creating comment',
    };
  }),

  on(CommentActions.clearState, (state, action) => {
    return <CommentState>{
      comments: [],
      isGetCommentsLoading: false,
      isGetCommentsSuccess: false,
      errorGetComments: '',

      loading: false,
      error: '',
      isCreateCommentSuccess: false,

      commentsCount: 0,
      isLoadCommentsCount: false,
      errorCommentsCount: '',
      isSuccessCommentCount: false,
    };
  }),
);
