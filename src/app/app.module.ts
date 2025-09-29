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
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudCreateComponent } from './admin-page/crud-create/crud-create.component';
import { CrudDetailComponent } from './admin-page/crud-detail/crud-detail.component';
import { NavAppheaderComponent } from './nav-appheader/nav-appheader.component';
import { Pd1Component } from './page/pd-1/pd-1.component';
import { Pd2Component } from './page/pd-2/pd-2.component';
import { Pd3Component } from './page/pd-3/pd-3.component';
import { Pd4Component } from './page/pd-4/pd-4.component';
import { Pd5Component } from './page/pd-5/pd-5.component';
import { Pd6Component } from './page/pd-6/pd-6.component';
import { Pd7Component } from './page/pd-7/pd-7.component';
import { Pd8Component } from './page/pd-8/pd-8.component';
import { CartComponent } from './page/cart/cart.component';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { PaymentComponent } from './page/payment/payment.component';
import { ProfileComponent } from './page/profile/profile.component';

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
    RegisterComponent,
    CrudCreateComponent,
    CrudDetailComponent,
    NavAppheaderComponent,
    Pd1Component,
    Pd2Component,
    Pd3Component,
    Pd4Component,
    Pd5Component,
    Pd6Component,
    Pd7Component,
    Pd8Component,
    CartComponent,
    ProductDetailComponent,
    PaymentComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
