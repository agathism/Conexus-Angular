import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/users/user-service';
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
  isMenuOpen = false;
  isLoggedIn: typeof this.userService.isLoggedIn;

  constructor(private userService: UserService) {
    this.isLoggedIn = this.userService.isLoggedIn;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app-home']);
    this.closeMenu();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
