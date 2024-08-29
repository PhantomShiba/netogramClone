import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AsyncPipe, NgClass } from '@angular/common';
import {debounceTime, filter, map} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../ngrx/profile/profile.state';
import * as AuthActions from '../../ngrx/auth/auth.actions';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import {async, Observable, Subscription} from 'rxjs';
import { ProfileModel } from '../../models/profile.model';
import { AuthState } from '../../ngrx/auth/auth.state';
import { AuthService } from '../../services/auth/auth.service';
import { ShareModule } from '../../shared/share.module';
import { FormControl } from '@angular/forms';
import { SearchState } from '../../ngrx/search/search.state';
import * as SearchActions from '../../ngrx/search/search.actions';
import {MatDialog} from "@angular/material/dialog";
import {IdToAvatarPipe} from "../../shared/pipes/id-to-avatar.pipe";
import {IdToNamePipe} from "../../shared/pipes/id-to-name.pipe";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, NgClass, AsyncPipe, ShareModule, IdToAvatarPipe, IdToNamePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  subscription: Subscription[] = [];

  logout$ = this.store.select('auth', 'logOutSuccess');

  profileMine$ = this.store.select('profile', 'mine');

  searchResult$ = this.store.select('search', 'searchResult');

  user = {
    uid: '12',
    userName: 'John Doe',
    avatarUrl: 'https://www.w3schools.com/howto/img_avatar.png',
    coverUrl: 'https://www.w3schools.com/howto/img_snow.jpg',
    bio: 'I am a web developer',
    email: '',
  };

  link = {
    label: 'Notifications',
    route: 'notifications',
    icon: 'home_app_logo',
  };

  activeLink = false;

  searchControl = new FormControl('');

  searchResults: any;

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
      search: SearchState;
    }>,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveLinkBasedOnUrl();
      });

    this.setActiveLinkBasedOnUrl();

    this.subscription.push(
      this.logout$.subscribe((logout) => {
        if (logout == true) {
          this.route.navigate(['/login']).then();
        }
      }),

      this.searchControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((query) => {
          if (query) {
            this.store.dispatch(SearchActions.search({ query }));
          }
        }),

      this.searchResult$.subscribe((searchResult) => {
        this.searchResults = searchResult;
      }),

    );
  }

  filterProfiles(value: string | null): Observable<ProfileModel[]> {
    if (value === null) {
      value = '';
    }
    return this.searchResult$.pipe(
      map((searchResult) => {
        if (searchResult && searchResult.profiles) {
          return searchResult.profiles.filter((profile) =>
            profile.userName.toLowerCase().includes(value!.toLowerCase())
          );
        } else {
          return [];
        }
      }),
    );
  }

  navigateToProfile(profile: ProfileModel) {
    if (profile.userName) {
      this.route.navigateByUrl(`/profile/${profile.userName}`).then(() => {
        this.store.dispatch(ProfileActions.getById({ uid: profile.uid }));
        this.searchControl.setValue('');
        this.dialog.closeAll();
      });
    }
  }

  setActive(link: any) {
    this.route.navigateByUrl(link.route).then();
  }

  setActiveLinkBasedOnUrl() {
    this.activeLink = this.route.url.includes('/notifications');
  }

  logout() {
    this.authService.logout();
    this.store.dispatch(AuthActions.clearState());
    this.store.dispatch(ProfileActions.clearGetState());
  }
  onSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const query = this.searchControl.value;
      console.log('Close dialog');
      this.dialog.closeAll();
      if (query && query.trim() !== '') {
        this.route.navigate(['/search-result'], {queryParams: {search: query}});
      }
    }
  }
  protected readonly async = async;
}
