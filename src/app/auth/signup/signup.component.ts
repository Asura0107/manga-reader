import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}
  registra(form: NgForm) {
    const data = {
      name: form.value.name,
      surname: form.value.surname,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      avatar:
        form.value.avatar === ''
          ? 'https://static.vecteezy.com/ti/vetor-gratis/p1/18765757-icone-de-perfil-de-usuario-em-estilo-simples-ilustracao-em-avatar-membro-no-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana-vetor.jpg'
          : form.value.avatar,
    };
    console.log(form.value);
    try {
      this.authSrv
        .register(form.value)
        .subscribe(() => this.router.navigate(['/login']));
    } catch (err: any) {
      console.log(err);
      alert(err);
    }
  }
}
