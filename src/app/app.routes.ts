import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './core/auth.guard';
import { ClothPairComponent } from './user/cloth-pair/cloth-pair.component';
import { UploadOutfitsComponent } from './user/upload-outfits/upload-outfits.component';
import { BookmarkComponent } from './user/bookmark/bookmark.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent,  resolve: { data: UserResolver},
    children: [
      { path: 'upload', component: UploadOutfitsComponent, resolve: { data: UserResolver}},
      { path: 'home', component: ClothPairComponent, resolve: { data: UserResolver} },
      { path: 'bookmark', component: BookmarkComponent, resolve: { data: UserResolver} }
    ]}
];
