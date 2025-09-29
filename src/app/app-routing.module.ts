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

const routes: Routes = [
  { path: '', 
    component: HomepageComponent
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
  { path: 'oder-manage', 
    component: OrderManageComponent,
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
  { path: 'cart', 
    component: CartComponent 
  },
  { path: 'product-detail/:id', 
    component: ProductDetailComponent
  },
  { path: 'payment',
    component: PaymentComponent
  },
  { path: 'profile',
    component: ProfileComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }