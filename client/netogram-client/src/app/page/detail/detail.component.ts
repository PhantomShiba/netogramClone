import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import {
  AsyncPipe,
  Location,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostState } from '../../ngrx/post/post.state';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { Store } from '@ngrx/store';
import { delay, Observable, Subscription, take } from 'rxjs';
import { PostModel } from '../../models/post.model';
import { ProfileModel } from '../../models/profile.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
import { DateTranformPipe } from '../../shared/pipes/date-tranform.pipe';
import { CommentState } from '../../ngrx/comment/comment.state';
import * as CommentActions from '../../ngrx/comment/comment.actions';
import { CommentModel } from '../../models/comment.model';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as PostActions from '../../ngrx/post/post.actions';
import { LikepostState } from '../../ngrx/likepost/likepost.state';
import * as LikeActions from '../../ngrx/likepost/likepost.actions';
import { LikepostModel } from '../../models/likepost.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    NgStyle,
    NgForOf,
    AsyncPipe,
    IdToAvatarPipe,
    IdToNamePipe,
    DateTranformPipe,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  commentForm = new FormGroup({
    text: new FormControl(''),
  });

  commentData: CommentModel = {
    commentId: 1,
    uid: 'asdfasdfsadf',
    postId: 8909711579549696,
    text: '',
    createdAt: 'asdfasd',
  };

  likePostData: LikepostModel = {
    likeId: 1,
    uid: 'asdfasdfsadf',
    postId: 8909711579549696,
    createdAt: 'asdfasd',
  };

  constructor(
    private dialogRef: MatDialogRef<DetailComponent>,
    private location: Location,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<{
      profile: ProfileState;
      post: PostState;
      comment: CommentState;
      likePost: LikepostState;
    }>,
  ) {
    const { postId } = this.activeRoute.snapshot.params;
    console.log('postId', postId);
  }

  isDeleteLikeSuccess$ = this.store.select('likePost', 'isUnLikedSuccess');

  isLiked$ = this.store.select('likePost', 'isLiked');

  likeCount$ = this.store.select('likePost', 'likeCount');

  createLikedSuccess$ = this.store.select('likePost', 'success');

  createCommentSuccess$ = this.store.select(
    'comment',
    'isCreateCommentSuccess',
  );

  subscriptions: Subscription[] = [];

  commentList$ = this.store.select('comment', 'comments');

  profileMine$ = this.store.select('profile', 'mine');

  postDetail$ = this.store.select('post', 'postDetail');

  isGettingPostDetail$ = this.store.select('post', 'isGettingPostDetail');

  profile$ = this.store.select('profile', 'profile');

  ngOnInit(): void {
    this.subscriptions.push(
      this.profileMine$.subscribe((profile) => {
        if (profile) {
          this.profileMine = profile;
        }
      }),
      this.postDetail$.subscribe((post) => {
        this.postDetail = post;
      }),
      this.likeCount$.subscribe((likeCount) => {
        this.likes = likeCount;
      }),

      this.postDetail$.subscribe((post) => {
        if (post && post.id) {
          this.store.dispatch(
            CommentActions.getComments({ postId: Number(post.id) }),
          );
        }
      }),

      this.postDetail$.subscribe((post) => {
        if (post && post.id) {
          console.log('oni1');
          this.store.dispatch(
            LikeActions.getIsLiked({ postId: Number(post.id) }),
          );
        }
      }),

      this.postDetail$.subscribe((post) => {
        if (post && post.id) {
          console.log('oni2');
          this.store.dispatch(
            LikeActions.getLikepostCount({ postId: Number(post.id) }),
          );
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PostActions.ClearPostDetail());
    this.store.dispatch(PostActions.ClearAllPosts());
    this.store.dispatch(LikeActions.clearLikePostState());
  }

  postDetail: PostModel = <PostModel>{};
  profileMine: ProfileModel = <ProfileModel>{};

  title = 'detail';

  displayedComments = 10;

  imageUrl = [
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
    'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6',
  ];

  favoriteIcon = 'favorite_outlined';
  shareIcon = 'ios_share_outlined';
  bookmarkIcon = 'bookmark_outlined';
  likes = 0;
  currentIndex = 0;

  createComment() {
    console.log(this.commentForm.value.text);
    this.postDetail$.subscribe((post) => {
      if (post && post.id) {
        this.commentData = { ...this.commentData, postId: Number(post.id) };
      }
    });
    this.commentData = {
      ...this.commentData,
      text: this.commentForm.value.text as string,
    };
    this.store.dispatch(
      CommentActions.createComment({ comment: this.commentData }),
    );

    this.createCommentSuccess$.subscribe((success) => {
      if (success) {
        this.store.dispatch(
          CommentActions.getComments({ postId: this.commentData.postId }),
        );
      }
    });
    this.commentForm.reset();
    // this.commentList$.subscribe((comments) => {
    //   console.log(comments);
    // })
  }

  createLikePost() {
    this.postDetail$.pipe(take(1)).subscribe((post) => {
      if (post && post.id) {
        console.log('cre');
        this.likePostData = { ...this.likePostData, postId: Number(post.id) };
        this.store.dispatch(
          LikeActions.createLikepost({ likePost: this.likePostData }),
        );
      }
    });

    this.createLikedSuccess$.subscribe((success) => {
      if (success) {
        console.log('get');
        this.store.dispatch(
          LikeActions.getLikepostCount({ postId: this.likePostData.postId }),
        );
        this.store.dispatch(
          LikeActions.getIsLiked({ postId: this.likePostData.postId }),
        );
      }
    });
  }

  unlikePost() {
    this.postDetail$.pipe(take(1)).subscribe((post) => {
      if (post && post.id) {
        console.log('de');
        this.likePostData = { ...this.likePostData, postId: Number(post.id) };

        this.store.dispatch(
          LikeActions.deleteLike({ postId: Number(post.id) }),
        );
      }
    });
    this.isDeleteLikeSuccess$.subscribe((success) => {
      if (success) {
        console.log('deget');
        this.store.dispatch(
          LikeActions.getLikepostCount({ postId: this.likePostData.postId }),
        );
        this.store.dispatch(
          LikeActions.getIsLiked({ postId: this.likePostData.postId }),
        );
      }
    });
  }

  loadMoreComments() {
    this.displayedComments += 10;
  }

  toggleShare() {
    this.shareIcon =
      this.shareIcon === 'ios_share_outlined'
        ? 'ios_share'
        : 'ios_share_outlined';
  }

  toggleBookmark() {
    this.bookmarkIcon =
      this.bookmarkIcon === 'bookmark_outlined'
        ? 'bookmark'
        : 'bookmark_outlined';
  }

  prevImage() {
    console.log(this.currentIndex);
    this.currentIndex =
      this.currentIndex > 0
        ? this.currentIndex - 1
        : this.postDetail.imageUrls.length - 1;
  }

  nextImage() {
    console.log(this.currentIndex);
    this.currentIndex =
      this.currentIndex < this.postDetail.imageUrls.length - 1
        ? this.currentIndex + 1
        : 0;
  }

  goBack(): void {
    this.location.back();
    this.dialogRef.close();
    this.store.dispatch(PostActions.ClearPostDetail());
  }

  isFirstImage(): boolean {
    return this.currentIndex === 0;
  }

  // Method to check if the current image is the last one
  isLastImage(): boolean {
    return this.currentIndex === this.postDetail.imageUrls.length - 1;
  }

  // Method to check if there is only one image
  isSingleImage(): boolean {
    return this.postDetail.imageUrls.length === 1;
  }

  navigateToProfile() {
    this.router.navigateByUrl(`/profile/${this.postDetail.uid}`).then();
    this.store.dispatch(ProfileActions.getById({ uid: this.postDetail.uid }));
  }

  navigateToCommentUser(uid: string) {
    this.router.navigateByUrl(`/profile/${uid}`).then();
    this.store.dispatch(ProfileActions.getById({ uid }));
  }
}
