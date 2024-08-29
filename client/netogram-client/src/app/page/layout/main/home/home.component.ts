import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { PostComponent } from '../../../../components/post/post.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import * as PostActions from '../../../../ngrx/post/post.actions';
import { Store } from '@ngrx/store';
import { PostState } from '../../../../ngrx/post/post.state';
import { ProfileState } from '../../../../ngrx/profile/profile.state';
import { Subscription } from 'rxjs';
import { PostModel, PostResponse } from '../../../../models/post.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AsyncPipe, NgIf } from '@angular/common';
import { ProfileModel } from '../../../../models/profile.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MaterialModule,
    PostComponent,
    InfiniteScrollDirective,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<{
      post: PostState;
      profile: ProfileState;
    }>,
  ) {}

  isCreateLoading$ = this.store.select('post', 'isCreating');
  isCreateSuccess$ = this.store.select('post', 'isCreateSuccess');
  allPosts$ = this.store.select('post', 'posts');
  mine$ = this.store.select('profile', 'mine');
  profilePic = 'https://www.w3schools.com/howto/img_avatar.png';
  readonly port = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  subscription: Subscription[] = [];
  mine: ProfileModel = <ProfileModel>{};

  currentPage = 1;
  size = 4;
  itemsCount = 0;
  tempArray: PostModel[] = [];

  allPosts: PostModel[] = [];

  ngOnInit(): void {
    this.subscription.push(
      // this.isCreateSuccess$.subscribe((success) => {
      //   if (success) {
      //     console.log('success');
      //     this.store.dispatch(
      //       PostActions.GetAllPost({
      //         pageNumber: this.currentPage,
      //         limitNumber: this.size,
      //       }),
      //     );
      //   }
      // }),
      this.allPosts$.subscribe((posts) => {
        if (posts.limitNumber > 0) {
          this.tempArray = [...this.allPosts];
          this.allPosts = [...this.tempArray, ...posts.data];
          console.log(posts);
          this.itemsCount = posts.limitNumber;
        }
      }),

      this.mine$.subscribe((mine) => {
        if (mine) {
          this.mine = mine;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    // this.store.dispatch(PostActions.ClearAllPosts());
  }

  openDialog(): void {
    // this.dialog.open(DialogOverviewExampleDialog);

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      height: '78vh',
      panelClass: 'custom-dialog-container',
      // data: {name: this.name(), port: this.port()},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //     this.port.set(result);
    //   }
    // });
  }

  onScrollDown(ev: any) {
    console.log('scrolled down!!', ev);
    this.currentPage += 1;
    console.log(this.currentPage);

    if (this.currentPage <= this.itemsCount) {
      console.log('get more post');
      this.store.dispatch(
        PostActions.GetAllPost({
          pageNumber: this.currentPage,
          limitNumber: this.size,
        }),
      );
    }
  }
}
