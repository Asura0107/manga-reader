import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ServiceService } from 'src/app/components/service/service.service';
import { User } from 'src/app/components/models/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  utente!: User;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private service: ServiceService
  ) {}

  ngOnInit(): void {}
  accedi(form: NgForm) {
    console.log(form.value);
    try {
      this.authSrv.login(form.value).subscribe(() => {
        this.authSrv.getMe().subscribe((user) => {
          this.utente = user;
          this.onPatchProfile(10);
          this.router.navigate(['/']);
        });
      });
    } catch (err) {
      alert('Login errato!');
      console.log(err);
      this.router.navigate(['/login']);
    }
  }
  creaaccount() {
    this.router.navigate(['/register']);
  }

  onPatchProfile(point: number) {
    this.service
      .patchProfile(this.utente.id, {
        points: this.utente.points + point,
      })
      .subscribe(() => {
        console.log(this.utente.points + point);
      });
  }
}
