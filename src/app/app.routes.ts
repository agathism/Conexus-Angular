import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResidenceDetailComponent } from './components/residence-detail/residence-detail.component';
import { ChatComponent } from './components/chat/chat.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResidenceSearchComponent } from './components/residence-search/residence-search.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ResidenceCreateComponent } from './components/residence-create/residence-create.component';

export const routes: Routes = [
    { path: 'app-home', component: HomeComponent },
    { path: 'app-navbar', component: NavbarComponent },
    { path: 'app-footer', component: FooterComponent },
    { path: 'app-login', component: LoginComponent },
    { path: 'app-register', component: RegisterComponent },
    { path: 'app-contact', component: ContactComponent },
    { path: 'app-chat', component: ChatComponent },
    { path: 'app-residence-detail', component: ResidenceDetailComponent },
    { path: 'app-profile', component: ProfileComponent },
    { path: 'app-residence-search', component: ResidenceSearchComponent },
    { path: 'app-residence-create', component: ResidenceCreateComponent },
    { path: 'app-reservations', component: ReservationsComponent },
    { path: '', redirectTo: 'app-home', pathMatch: 'full'}
];
