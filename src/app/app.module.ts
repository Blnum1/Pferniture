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
import { Pd1Component } from './page/sort-page/pd-1/pd-1.component';
import { Pd2Component } from './page/sort-page/pd-2/pd-2.component';
import { Pd3Component } from './page/sort-page/pd-3/pd-3.component';
import { Pd4Component } from './page/sort-page/pd-4/pd-4.component';
import { Pd5Component } from './page/sort-page/pd-5/pd-5.component';
import { Pd6Component } from './page/sort-page/pd-6/pd-6.component';
import { Pd7Component } from './page/sort-page/pd-7/pd-7.component';
import { Pd8Component } from './page/sort-page/pd-8/pd-8.component';
import { CartComponent } from './page/cart/cart.component';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { PaymentComponent } from './page/payment/payment.component';
import { ProfileComponent } from './profile-page/profile/profile.component';
import { NavProfileComponent } from './nav-profile/nav-profile.component';
import { Pf1Component } from './profile-page/pf-1/pf-1.component';
import { Pf2Component } from './profile-page/pf-2/pf-2.component';
import { Pf3Component } from './profile-page/pf-3/pf-3.component';
import { Pf4Component } from './profile-page/pf-4/pf-4.component';
import { Pf5Component } from './profile-page/pf-5/pf-5.component';
import { Pd9Component } from './page/sort-page/pd-9/pd-9.component';
import { Pd10Component } from './page/sort-page/pd-10/pd-10.component';
import { NavProfileHeaderComponent } from './profile-page/nav-profile-header/nav-profile-header.component';
import { LocationComponent } from './profile-page/location/location.component';
import { DeliveryNoteComponent } from './admin-page/delivery-note/delivery-note.component';
import { OrderManageDetailComponent } from './admin-page/order-manage-detail/order-manage-detail.component';
import { SearchComponent } from './page/search/search.component';
import { PfDetailComponent } from './profile-page/pf-detail/pf-detail.component';
import { PaymentConfirmComponent } from './page/payment-confirm/payment-confirm.component';
import { Pf6Component } from './profile-page/pf-6/pf-6.component';
import { CategoryManageComponent } from './admin-page/category-manage/category-manage.component';
import { Pd11Component } from './page/sort-page/pd-11/pd-11.component';
import { Pd12Component } from './page/sort-page/pd-12/pd-12.component';
import { Pd13Component } from './page/sort-page/pd-13/pd-13.component';
import { Pd14Component } from './page/sort-page/pd-14/pd-14.component';
import { Pd15Component } from './page/sort-page/pd-15/pd-15.component';
import { Pd16Component } from './page/sort-page/pd-16/pd-16.component';
import { Pd17Component } from './page/sort-page/pd-17/pd-17.component';
import { Pd18Component } from './page/sort-page/pd-18/pd-18.component';
import { Pd19Component } from './page/sort-page/pd-19/pd-19.component';

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
    ProfileComponent,
    NavProfileComponent,
    Pf1Component,
    Pf2Component,
    Pf3Component,
    Pf4Component,
    Pf5Component,
    Pd9Component,
    Pd10Component,
    NavProfileHeaderComponent,
    LocationComponent,
    DeliveryNoteComponent,
    OrderManageDetailComponent,
    SearchComponent,
    PfDetailComponent,
    PaymentConfirmComponent,
    Pf6Component,
    CategoryManageComponent,
    Pd11Component,
    Pd12Component,
    Pd13Component,
    Pd14Component,
    Pd15Component,
    Pd16Component,
    Pd17Component,
    Pd18Component,
    Pd19Component
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
