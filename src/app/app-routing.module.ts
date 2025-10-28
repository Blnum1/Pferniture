import { CrudDetailComponent } from './admin-page/crud-detail/crud-detail.component';
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
import { AuthGuard } from './services/auth.guard';
import { CrudCreateComponent } from './admin-page/crud-create/crud-create.component';
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
import { PfDetailComponent } from './profile-page/pf-detail/pf-detail.component';
import { Pf1Component } from './profile-page/pf-1/pf-1.component';
import { Pf2Component } from './profile-page/pf-2/pf-2.component';
import { Pf3Component } from './profile-page/pf-3/pf-3.component';
import { Pf4Component } from './profile-page/pf-4/pf-4.component';
import { Pf5Component } from './profile-page/pf-5/pf-5.component';
import { Pd9Component } from './page/sort-page/pd-9/pd-9.component';
import { Pd10Component } from './page/sort-page/pd-10/pd-10.component';
import { LocationComponent } from './profile-page/location/location.component';
import { DeliveryNoteComponent } from './admin-page/delivery-note/delivery-note.component';
import { OrderManageDetailComponent } from './admin-page/order-manage-detail/order-manage-detail.component';
import { SearchComponent } from './page/search/search.component';
import { PaymentConfirmComponent } from './page/payment-confirm/payment-confirm.component';
import { Pf6Component } from './profile-page/pf-6/pf-6.component';

const routes: Routes = [
  { path: '', 
    component: HomepageComponent
  },
  { path: 'search', 
    component: SearchComponent
  },
  { path: 'dashboard', 
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },
  { path: 'checkstock', 
    component: CheckStockComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'crud', 
    component: CrudfurnitureComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'crud/:id', 
    component: CrudDetailComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'crud-create', 
    component: CrudCreateComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'onoff', 
    component: OnOffStatusComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'order-manage', 
    component: OrderManageComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'order-manage-detail/:orderID', 
    component: OrderManageDetailComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'delivery-note/:orderID', 
    component: DeliveryNoteComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'payment-manage', 
    component: PaymentManageComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'promation', 
    component: PromotionComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'userinfo', 
    component: UserInfoComponent,
    canActivate:[AuthGuard] 
  },
  { path: 'login', 
    component: LoginComponent 
  },
  { path: 'register', 
    component: RegisterComponent 
  },
  { path: 'pd-1', 
    component: Pd1Component 
  },
  { path: 'pd-2', 
    component: Pd2Component 
  },
  { path: 'pd-3', 
    component: Pd3Component 
  },
  { path: 'pd-4', 
    component: Pd4Component 
  },
  { path: 'pd-5', 
    component: Pd5Component 
  },
  { path: 'pd-6', 
    component: Pd6Component 
  },
  { path: 'pd-7', 
    component: Pd7Component 
  },
  { path: 'pd-8', 
    component: Pd8Component 
  },
  { path: 'pd-9', 
    component: Pd9Component 
  },
  { path: 'pd-10', 
    component: Pd10Component 
  },
  { path: 'cart', 
    component: CartComponent 
  },
  { path: 'product-detail/:id', 
    component: ProductDetailComponent
  },
  { path: 'payment',
    component: PaymentComponent
  },
  { path: 'payment-confirm/:orderID',
    component: PaymentConfirmComponent
  },
  { path: 'profile',
    component: ProfileComponent
  },
  { path: 'location',
    component: LocationComponent
  },
  { path: 'pf-detail/:orderID',
    component: PfDetailComponent
  },
  { path: 'pf-1',
    component: Pf1Component
  },
  { path: 'pf-2',
    component: Pf2Component
  },
  { path: 'pf-3',
    component: Pf3Component
  },
  { path: 'pf-4',
    component: Pf4Component
  },
  { path: 'pf-5',
    component: Pf5Component
  },
  { path: 'pf-6',
    component: Pf6Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }