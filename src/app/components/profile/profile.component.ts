import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { User } from '../models/user';
import { ServiceService } from '../service/service.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  utente!: User;
  constructor(private authSrv: AuthService, private service: ServiceService) {}

  ngOnInit(): void {
    this.getme();
  }
  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente = it;
      console.log(this.utente);
    });
  }

  onPatchProfile(form: NgForm) {
    this.service
      .patchAvatar(this.utente.id, {
        avatar: form.value.avatar,
        points: this.utente.points,
      })
      .subscribe(() => {
        this.getme();
        console.log(this.utente.avatar);
      });
  }
}
