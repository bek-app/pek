import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CommonComponent } from './layouts/common/common.component';

const routes: Routes = [
  { path: '', redirectTo: 'common/home', pathMatch: 'full' },
  {
    path: 'common',
    component: CommonComponent,
    children: [{ path: 'home', component: HomeComponent }],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
