import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResidenceDetailComponent } from './components/residence-detail/residence-detail.component';
import { ChatComponent } from './components/chat/chat.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResidenceSearchComponent } from './components/residence-search/residence-search.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ResidenceCreateComponent } from './components/residence-create/residence-create.component';
import { ResidenceModifyComponent } from './components/residence-modify/residence-modify.component';
import { ResidenceListsComponent } from './components/residence-lists/residence-lists.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { MakeReservationComponent } from './components/make-reservation/make-reservation.component';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-login', component: LoginComponent },
    { path: 'app-register', component: RegisterComponent },
    { path: 'app-make-reservation', component: MakeReservationComponent },
    { path: 'app-contact', component: ContactComponent, canActivate: [authGuard] },
    { path: 'app-chat', component: ChatComponent, canActivate: [authGuard] },
    { path: 'app-residence-detail/:id', component: ResidenceDetailComponent },
    { path: 'app-profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'app-residence-search', component: ResidenceSearchComponent },
    { path: 'app-residence-create', component: ResidenceCreateComponent, canActivate: [authGuard]  },
    { path: 'app-reservations', component: ReservationsComponent, canActivate: [authGuard]  },
    { path: 'app-residence-modify', component: ResidenceModifyComponent, canActivate: [roleGuard], data: {requiredRole: 'ROLE_OWNER'} },
    { path: 'app-residence-lists', component: ResidenceListsComponent, canActivate: [roleGuard], data: {requiredRole: 'ROLE_OWNER' } },
    { path: 'app-unauthorized', component: UnauthorizedComponent },
    { path: '', redirectTo: 'app-home', pathMatch: 'full'}
];
