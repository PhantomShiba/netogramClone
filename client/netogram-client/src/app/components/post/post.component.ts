import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { PostModel } from '../../models/post.model';
import { IdToAvatarPipe } from '../../shared/pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../shared/pipes/id-to-name.pipe';
import { MaterialModule } from '../../shared/material.module';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { Store } from '@ngrx/store';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import * as PostActions from '../../ngrx/post/post.actions';
import { DateTranformPipe } from '../../shared/pipes/date-tranform.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PostState } from '../../ngrx/post/post.state';
import { combineLatest } from 'rxjs';

class PostResult {}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    NgxSkeletonLoaderModule,
    NgForOf,
    IdToAvatarPipe,
    AsyncPipe,
    IdToNamePipe,
    DateTranformPipe,
    NgIf,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      post: PostState;
    }>,
  ) {}

  isGettingMinePost$ = this.store.select('post', 'isGettingMinePost');
  isGettingAllPosts$ = this.store.select('post', 'isGettingAllPosts');

  animation = 'pulse';
  contentLoaded = false;
  count = 2;
  widthHeightSizeInPixels = 50;

  intervalId: number | null = null;

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
      this.count = this.count === 2 ? 5 : 2;
      this.widthHeightSizeInPixels =
        this.widthHeightSizeInPixels === 50 ? 100 : 50;
    }, 1500);
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1500);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @Input() postUser: PostModel = <PostModel>{};

  favoriteIcon = 'favorite_outlined';
  commentIcon = 'comment_outlined';
  shareIcon = 'ios_share_outlined';
  bookmarkIcon = 'bookmark_outlined';
  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  currentIndex = 0;

  // temporary fix to resolve length check error
  // hasMultipleImages(): boolean {
  //   return this.postUser.imageUrls.length > 1;
  // }

  hasMultipleImages(): boolean {
    return this.postUser?.imageUrls?.length > 1;
  }

  toggleFavorite() {
    this.favoriteIcon =
      this.favoriteIcon === 'favorite_outlined'
        ? 'favorite'
        : 'favorite_outlined';
  }

  toggleShare() {
    this.shareIcon =
      this.shareIcon === 'ios_share_outlined'
        ? 'ios_share'
        : 'ios_share_outlined';
  }

  // Method to check if the current image is the first one
  isFirstImage(): boolean {
    return this.currentIndex === 0;
  }

  // Method to check if the current image is the last one
  @Input() post!: PostModel;

  // temporary fix to resolve length check error
  // isLastImage(): boolean {
  //   return this.currentIndex === this.postUser.imageUrls.length - 1;
  // }

  isLastImage(): boolean {
    return this.currentIndex === (this.postUser?.imageUrls?.length || 0) - 1;
  }

  prevImage(carousel: HTMLDivElement) {
    const imageWidth = carousel.querySelector('.post-image')?.clientWidth || 0;
    carousel.scrollBy({
      left: -(imageWidth + 10), // Adjust gap between images
      behavior: 'smooth',
    });
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage(carousel: HTMLDivElement) {
    const imageWidth = carousel.querySelector('.post-image')?.clientWidth || 0;
    carousel.scrollBy({
      left: imageWidth + 10, // Adjust gap between images
      behavior: 'smooth',
    });
    if (this.currentIndex < this.postUser.imageUrls.length - 1) {
      this.currentIndex++;
    }
  }

  onMouseDown(event: MouseEvent, carousel: HTMLDivElement) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent, carousel: HTMLDivElement) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - carousel.offsetLeft;
    const walk = (x - this.startX) * 2;
    carousel.scrollLeft = this.scrollLeft - walk;
  }

  navigateToDetail() {
    this.router.navigateByUrl(`/detail/${this.postUser.id}`).then();
    this.store.dispatch(PostActions.GetPostById({ id: this.postUser.id }));
  }

  navigateToProfile() {
    if (this.postUser?.uid) {
      this.router.navigateByUrl(`/profile/${this.postUser.uid}`).then();
      this.store.dispatch(PostActions.ClearMinePost());
      this.store.dispatch(ProfileActions.getById({ uid: this.postUser.uid }));
    } else {
      console.error('User ID is undefined');
      // Handle the error appropriately, maybe show a message to the user
    }
  }

  deletePost() {
    this.store.dispatch(PostActions.DeletePost({ id: this.postUser.id }));
  }
}
