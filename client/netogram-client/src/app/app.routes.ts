import { CanActivateFn, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DetailComponent } from './page/detail/detail.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./page/register/register.routes').then((m) => m.REGISTER_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./page/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./page/detail/detail.routes').then((m) => m.DETAIL_ROUTES),
  },
  {
    path: 'search-result',
    loadChildren: () =>
      import('./page/search-result/search-result.route').then(
        (m) => m.SEARCH_RESULT_ROUTES,
      ),
  },
];
