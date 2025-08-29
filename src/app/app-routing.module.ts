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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }