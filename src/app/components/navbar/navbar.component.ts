import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private router = inject(Router);

  isLoggedIn$: typeof this.userService.isLoggedIn$;

  constructor(private userService: UserService) {
    this.isLoggedIn$ = this.userService.isLoggedIn$;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app-home']);
  }
}
