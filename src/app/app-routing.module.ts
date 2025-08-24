import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './page/homepage/homepage.component'; 
import { DashboardComponent } from './admin-page/dashboard/dashboard.component';
import { CheckStockComponent } from './admin-page/check-stock/check-stock.component';
import { CRUDfernitureComponent } from './admin-page/crudferniture/crudferniture.component';
import { OnOffStatusComponent } from './admin-page/on-off-status/on-off-status.component';
import { OrderManageComponent } from './admin-page/order-manage/order-manage.component';
import { PaymentManageComponent } from './admin-page/payment-manage/payment-manage.component';
import { PromotionComponent } from './admin-page/promotion/promotion.component';
import { UserInfoComponent } from './admin-page/user-info/user-info.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'checkstock', component: CheckStockComponent },
  { path: 'crud', component: CRUDfernitureComponent },
  { path: 'onoff', component: OnOffStatusComponent },
  { path: 'oder-manage', component: OrderManageComponent },
  { path: 'payment-manage', component: PaymentManageComponent },
  { path: 'promation', component: PromotionComponent },
  { path: 'userinfo', component: UserInfoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }