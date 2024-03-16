import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { Router } from '@angular/router';
import { User } from '../models/user';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  utente!: AuthData | null;
  utente1!: User;
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.utente = _user;
      console.log(this.utente);
    });
    this.getme();

    this.authSrv.restore();
  }
  logout() {
    this.authSrv.logout();
    this.router.navigate(['/login']);
  }
  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente1 = it;
      console.log(this.utente);
    });
  }
}
