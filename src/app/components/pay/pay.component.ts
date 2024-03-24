import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  amountText!: string;
  isAmountReadonly!: boolean;
  selectedValue: number = 10;
  utente!: User;
  isActive: boolean = true;
  constructor(
    private service: ServiceService,
    private authSrv: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.amountText = '2.0';
    this.getme();
  }

  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente = it;
      console.log(this.utente);
    });
  }

  updateAmountTextAndReadonly(event: any) {
    const value = event.target.value;
    if (value === '10') {
      this.amountText = '2.0';
    } else if (value === '50') {
      this.amountText = '10.0';
    } else if (value === '100') {
      this.amountText = '20.0';
    }
  }

  postPaypal(form: NgForm) {
    const data = {
      amount: this.selectedValue,
      emailPaypal: form.value.emailPaypal,
      passwordPaypal: form.value.passwordPaypal,
    };
    if (this.utente) {
      this.service.postPaypal(data, this.utente.id).subscribe(
        (response) => {
          this.onPatchProfile(this.selectedValue);
          console.log('Transazione PayPal avvenuta con successo:', response);
        },
        (error) => {
          console.error('Errore durante la transazione PayPal:', error);
        }
      );
    }
  }

  posCard(form: NgForm) {
    const data = {
      amount: this.selectedValue,
      numeroCarta: form.value.numeroCarta,
      scadenza: form.value.scadenza,
      cvv: form.value.cvv,
    };
    if (this.utente) {
      this.service.postCard(data, this.utente.id).subscribe(
        (response) => {
          this.onPatchProfile(this.selectedValue);
          console.log('Transazione carta avvenuta con successo:', response);
        },
        (error) => {
          console.error('Errore durante la transazione carta:', error);
        }
      );
    }
  }

  card() {
    this.isActive = true;
  }
  paypal() {
    this.isActive = false;
  }

  onPatchProfile(point: number) {
    this.service
      .patchProfile(this.utente.id, {
        points: this.utente.points + point,
      })
      .subscribe(() => {
        this.getme();
        console.log(this.utente.points + point);
      });
  }
}
