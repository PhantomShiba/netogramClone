import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { select, Store } from '@ngrx/store';
import { ProfileState } from './ngrx/profile/profile.state';
import { AuthState } from './ngrx/auth/auth.state';
import { combineLatest, Observable } from 'rxjs';
import { AuthCredentialModel } from './models/auth.model';
import * as AuthActions from './ngrx/auth/auth.actions';
import * as ProfileActions from './ngrx/profile/profile.actions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import * as PostActions from './ngrx/post/post.actions';
import { DetailComponent } from './page/detail/detail.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  uid = ' ';

  storeIdToken$!: Observable<string>;
  storeAuthCredential$!: Observable<AuthCredentialModel>;

  authCredential$ = this.store.select((state) => state.auth.authCredential);
  mine$ = this.store.select((state) => state.profile.mine);
  getMineError$ = this.store.select((state) => state.profile.getErrorMessage);
  isGetMineSuccess$ = this.store.select(
    (state) => state.profile.isGetMineSuccess,
  );
  isGetMineFailure$ = this.store.select(
    (state) => state.profile.isGetMineFailure,
  );

  title = 'netogram-client';

  isShowSpinner = true;

  constructor(
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private router: Router,
    private auth: Auth,
    private store: Store<{
      auth: AuthState;
      profile: ProfileState;
    }>,
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        let idToken = await user.getIdToken(true);
        this.uid = user.uid;

        let auth: AuthCredentialModel = {
          uid: user.uid,
          userName: user.displayName || '',
          email: user.email || '',
          photoUrl: user.photoURL || '',
        };

        this.store.dispatch(AuthActions.storeIdToken({ idToken: idToken }));
        this.store.dispatch(AuthActions.storeAuthCredential({ auth: auth }));
        this.store.dispatch(ProfileActions.getMine({ uid: user.uid }));
      } else {
        this.router.navigate(['/login']).then(() => {
          console.log('User is not logged in');
          this.isShowSpinner = false;
        });
      }
    });
  }

  ngOnInit(): void {
    this.storeIdToken$ = this.store.pipe(select((state) => state.auth.idToken));

    this.storeAuthCredential$ = this.store.pipe(
      select((state) => state.auth.authCredential),
    );

    this.storeIdToken$.subscribe((idToken) => {
      console.log('idToken', idToken);
    });

    this.route.url.subscribe((url) => {
      console.log('url', url);
      const urlSegment = url.join('/');
      if (urlSegment.startsWith('detail/')) {
        const id = BigInt(urlSegment.split('/')[1]);
        console.log('iddetail at home' + ':', id);
        //convert string to bigint
        this.store.dispatch(PostActions.GetPostById({ id: id }));

        this.dialogRef.open(DetailComponent, {
          maxWidth: '100%',
          maxHeight: '100%',
          closeOnNavigation: true,
        });
      }
    });

    combineLatest([
      this.authCredential$,
      this.isGetMineSuccess$,
      this.isGetMineFailure$,
      this.getMineError$,
      this.mine$,
    ]).subscribe(
      ([
        authCredential,
        isGetMineSuccess,
        isGetMineFailure,
        getMineError,
        mine,
      ]) => {
        if (authCredential.uid) {
          if (isGetMineSuccess && mine?.uid) {
            console.log('calll');
            this.store.dispatch(
              PostActions.GetAllPost({
                pageNumber: 1,
                limitNumber: 4,
              }),
            );
            const currentUrl = this.router.url;
            if (
              currentUrl === '/friends/friend%20list' ||
              currentUrl.startsWith('/profile/') ||
              currentUrl.startsWith('/detail/') ||
              currentUrl.startsWith('/friends/friend%20request')
            ) {
              this.isShowSpinner = false;
              this.router.navigate([currentUrl]);
            } else {
              this.router.navigate(['/home']).then(() => {
                this.isShowSpinner = false;
              });
            }
          } else if (isGetMineFailure && getMineError.status) {
            console.log(getMineError);
            this.router.navigate(['/register']).then(() => {
              this.isShowSpinner = false;
              this.store.dispatch(ProfileActions.clearMessages());
            });
          }
        }
      },
    );
  }
}
