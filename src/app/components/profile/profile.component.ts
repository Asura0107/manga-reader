import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { User } from '../models/user';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  utente!: User;
  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.getme();
  }
  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente = it;
      console.log(this.utente);
    });
  }
}
