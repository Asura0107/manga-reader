import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}
  accedi(form: NgForm) {
    console.log(form.value);
    try {
      this.authSrv.login(form.value).subscribe(() => {
        this.router.navigate(['/']);
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
}
