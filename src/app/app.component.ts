import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterConfig } from 'angular2-toaster';
import { Observable } from 'rxjs';
import { CreditCardPaymentFacade } from './store/facade';
import { CreditCardState } from './models/credit-card.interface';
import {PaymentState} from './store/reducer';
import {select, Store} from '@ngrx/store';
import { merge } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Nonye-App';
  toasterConfig: ToasterConfig;
  creditCard$: Observable<CreditCardState>;

  constructor(private router: Router, private creditCardPaymentFacade: CreditCardPaymentFacade) {

    this.toasterConfig = new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      positionClass: 'toast-top-full-width',
      timeout: 3000
    });
    this.creditCard$ = this.creditCardPaymentFacade.data$;
  }

  ngOnInit() {
    this.creditCard$.subscribe(data => {
    })
  }


  navigate(){
    this.router.navigate(['/payment']);
  }
}
