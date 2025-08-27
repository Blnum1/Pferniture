import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component'; 
import { DashboardComponent } from './admin-page/dashboard/dashboard.component';
import { CheckStockComponent } from './admin-page/check-stock/check-stock.component';
import { CrudfurnitureComponent  } from './admin-page/crudfurniture/crudfurniture.component';
import { OnOffStatusComponent } from './admin-page/on-off-status/on-off-status.component';
import { OrderManageComponent } from './admin-page/order-manage/order-manage.component';
import { PaymentManageComponent } from './admin-page/payment-manage/payment-manage.component';
import { PromotionComponent } from './admin-page/promotion/promotion.component';
import { UserInfoComponent } from './admin-page/user-info/user-info.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'checkstock', component: CheckStockComponent },
  { path: 'crud', component: CrudfurnitureComponent },
  { path: 'onoff', component: OnOffStatusComponent },
  { path: 'oder-manage', component: OrderManageComponent },
  { path: 'payment-manage', component: PaymentManageComponent },
  { path: 'promation', component: PromotionComponent },
  { path: 'userinfo', component: UserInfoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }