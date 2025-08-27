import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './page/homepage/homepage.component';
import { DashboardComponent } from './admin-page/dashboard/dashboard.component';
import { NavAdminComponent } from './nav-admin/nav.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { OnOffStatusComponent } from './admin-page/on-off-status/on-off-status.component';
import { CheckStockComponent } from './admin-page/check-stock/check-stock.component';
import { OrderManageComponent } from './admin-page/order-manage/order-manage.component';
import { PaymentManageComponent } from './admin-page/payment-manage/payment-manage.component';
import { PromotionComponent } from './admin-page/promotion/promotion.component';
import { UserInfoComponent } from './admin-page/user-info/user-info.component';
import { CrudfurnitureComponent } from './admin-page/crudfurniture/crudfurniture.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DashboardComponent,
    NavAdminComponent,
    NavHeaderComponent,
    OnOffStatusComponent,
    CheckStockComponent,
    OrderManageComponent,
    PaymentManageComponent,
    PromotionComponent,
    UserInfoComponent,
    CrudfurnitureComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
