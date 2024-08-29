import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../services/post/post.service';
import * as PostActions from './post.actions';
import { delay, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';

@Injectable()
export class PostEffects {
  createPost$ = createEffect(() => {
    // delay(2000)
    return this.actions$.pipe(
      ofType(PostActions.CreatePost),
      switchMap((action) => {
        return this.postService.createPost(action.post).pipe(
          map(() => {
            return PostActions.CreatePostSuccess();
          }),
          catchError((error: HttpErrorResponseModel) => {
            return of(
              PostActions.CreatePostFailure({ createPostErrorMessage: error }),
            );
          }),
        );
      }),
    );
  });

  getAllPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.GetAllPost),
      switchMap((action) => {
        return this.postService
          .getAllPost(action.pageNumber, action.limitNumber)
          .pipe(
            map((posts) => {
              return PostActions.GetAllPostSuccess({ posts });
            }),
            catchError((error: HttpErrorResponseModel) => {
              return of(
                PostActions.GetAllPostFailure({
                  getAllPostErrorMessage: error,
                }),
              );
            }),
          );
      }),
    );
  });

  getMinePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.GetMinePost),
      switchMap((action) => {
        return this.postService
          .getMinePost(action.uid, action.pageNumber, action.limitNumber)
          .pipe(
            map((posts) => {
              return PostActions.GetMinePostSuccess({ minePosts: posts });
            }),
            catchError((error: HttpErrorResponseModel) => {
              return of(
                PostActions.GetMinePostFailure({
                  getMinePostErrorMessage: error,
                }),
              );
            }),
          );
      }),
    );
  });

  getPostById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.GetPostById),
      switchMap((action) => {
        return this.postService.getById(action.id).pipe(
          map((postDetail) => {
            return PostActions.GetPostByIdSuccess({ postDetail });
          }),
          catchError((error: HttpErrorResponseModel) => {
            return of(
              PostActions.GetPostByIdFailure({
                getPostByIdErrorMessage: error,
              }),
            );
          }),
        );
      }),
    );
  });

  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.DeletePost),
      switchMap((action) => {
        return this.postService.deletePost(action.id, action.uid).pipe(
          map(() => {
            return PostActions.DeletePostSuccess();
          }),
          catchError((error: HttpErrorResponseModel) => {
            return of(
              PostActions.DeletePostFailure({
                deletePostErrorMessage: error,
              }),
            );
          }),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private postService: PostService,
  ) {}
}
