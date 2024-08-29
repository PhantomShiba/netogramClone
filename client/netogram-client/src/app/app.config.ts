import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './ngrx/auth/auth.effects';
import { ProfileEffects } from './ngrx/profile/profile.effects';
import { profileReducer } from './ngrx/profile/profile.reducer';
import { authReducer } from './ngrx/auth/auth.reducer';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientAuth } from './util/http-client-auth';
import { PostReducer } from './ngrx/post/post.reducer';
import { PostEffects } from './ngrx/post/post.effects';
import { StorageEffects } from './ngrx/storage/storage.effects';
import { StorageReducer } from './ngrx/storage/storage.reducer';
import { SearchReducer } from './ngrx/search/search.reducer';
import { searchEffects } from './ngrx/search/search.effects';
import {CommentEffects} from "./ngrx/comment/comment.effects";
import {commentReducer} from "./ngrx/comment/comment.reducer";
import {likepostReducer} from "./ngrx/likepost/likepost.reducer";
import {LikepostEffects} from "./ngrx/likepost/likepost.effects";
import {FriendshipEffects} from "./ngrx/friend-ship/friend-ship.effects";
import {friendshipReducer} from "./ngrx/friend-ship/friend-ship.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideStore(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideEffects(
      AuthEffects,
      ProfileEffects,
      PostEffects,
      StorageEffects,
      searchEffects,
      CommentEffects,
      LikepostEffects,
      FriendshipEffects
    ),
    provideState({ name: 'auth', reducer: authReducer }),
    provideState({ name: 'profile', reducer: profileReducer }),
    provideState({ name: 'post', reducer: PostReducer }),
    provideState({ name: 'storage', reducer: StorageReducer }),
    provideState({ name: 'search', reducer: SearchReducer }),
    provideState({ name: 'comment', reducer: commentReducer }),
    provideState({ name: 'likePost', reducer: likepostReducer }),
    provideState({ name: 'friendship', reducer: friendshipReducer }),
    HttpClientAuth,
    provideHttpClient(),
    provideAnimationsAsync(),
  ],
};
