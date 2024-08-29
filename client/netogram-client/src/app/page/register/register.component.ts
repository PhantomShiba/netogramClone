import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { AuthState } from '../../ngrx/auth/auth.state';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import { ProfileModel } from '../../models/profile.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  regisForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    avatarUrl: new FormControl(''),
    uid: new FormControl(''),
  });

  regisData: ProfileModel = {
    email: '',
    userName: '',
    uid: '',
    bio: '',
    avatarUrl: '',
    coverUrl: '',
  };

  uid = '';
  createMineSuccess$ = this.store.select('profile', 'isCreateSuccess');
  readonly userName = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20),
  ]);

  getMineSuccess$ = this.store.select('profile', 'isGetMineSuccess');

  errorMessage = signal('');

  constructor(
    private router: Router,
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
    }>
  ) {
    this.subscription.push(
      this.store.select('auth').subscribe((auth: AuthState) => {
        if (auth.authCredential) {
          this.uid = auth.authCredential.uid;
          this.regisForm.patchValue({
            email: auth.authCredential.email,
            avatarUrl: auth.authCredential.photoUrl,
            uid: auth.authCredential.uid,
          });
        }
      })
    );

    merge(
      this.regisForm.get('userName')!.statusChanges,
      this.regisForm.get('userName')!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    this.createMineSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.store.dispatch(ProfileActions.getMine({ uid: this.uid }));
      }
    });

    this.getMineSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.router.navigate(['/home']).then();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  updateErrorMessage() {
    const userName = this.regisForm.get('userName');
    if (this.userName.hasError('required')) {
      this.errorMessage.set('Name is required');
    } else if (this.userName.hasError('minLength')) {
      this.errorMessage.set('Name must be at least 5 characters long');
    } else if (this.userName.hasError('maxLength')) {
      this.errorMessage.set('Name must not exceed 20 characters');
    } else {
      this.errorMessage.set('');
    }
  }

  canProceed(): boolean {
    return this.regisForm.get('userName')?.valid ?? false;
  }

  register() {
    const userName = this.regisForm.get('userName')?.value ?? '';

    if (userName.length < 5) {
      this.errorMessage.set('Name must be at least 5 characters long');
      return;
    } else if (userName.length > 20) {
      this.errorMessage.set('Name must not exceed 20 characters');
      return;
    } else {
      console.log('run');
      this.regisData = {
        email: this.regisForm.value.email ?? '',
        userName: this.regisForm.value.userName ?? '',
        uid: this.regisForm.value.uid ?? '',
        bio: '',
        avatarUrl: this.regisForm.value.avatarUrl ?? '',
        coverUrl: '',
      };
    }

    console.log(this.regisData);

    this.store.dispatch(ProfileActions.createMine({ mine: this.regisData }));
  }
}
