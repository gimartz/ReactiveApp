import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';import { CreditCardState } from "../models/credit-card.interface";
import { Subject,Observable } from 'rxjs';
import { CreditCardPaymentFacade } from '../store/facade';
import { currentDate } from '../store/reducer';
import { PaymentService } from '../services/payment.service';
import {PaymentState} from '../store/reducer';
import {select, Store} from '@ngrx/store';
import {CreditCardQuery} from '../store/selectors';
@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss']
})

export class CardPaymentComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  
  paymentForm: FormGroup;
  errorMessage: string;
  currentDate = new Date();
  currentMonth = currentDate.getMonth() + 1;
  currentYear = currentDate.getFullYear();
  customers$: Observable<CreditCardState>;
  constructor(private formBuilder: FormBuilder, private facade: CreditCardPaymentFacade,private store: Store<PaymentState>) { 
    this.customers$ = this.store.pipe(select(CreditCardQuery.getCreditCardState));
  }
  PaymentService
  toasterService
  ngOnInit() {
    this.errorMessage = "Please Fill all fields";
    this.paymentForm = this.formBuilder.group({
      PhoneNumber:['', [Validators.required,Validators.minLength(11), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      nameOnCard: ['', [Validators.required,Validators.minLength(1),Validators.pattern('^[A-Za-z][A-Za-z -]*$')]],
      cardNumber: ['', [Validators.required,Validators.minLength(16),Validators.min(1111111111111111),Validators.max(9999999999999999)]],
      expirationMonth: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(2),Validators.min(this.currentMonth),Validators.max(12)]],
      expirationYear: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.min(this.currentYear),Validators.max(9999)]],
      cardCVVNumber: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.min(111),Validators.max(999)]]
     });
  }



 // convenience getter for easy access to form fields
 get formControls() { return this.paymentForm.controls; }

 onSubmit() {
   this.submitForm();
  }

  submitForm() {
  if (this.paymentForm.status === 'VALID') {
    const expiryDate = new Date(this.paymentForm.get('expirationYear').value, this.paymentForm.get('expirationMonth').value, 1)
    const paymentFormData = {
      creditCardNumber: this.paymentForm.get('cardNumber').value.toString(),
      cardHolder: this.paymentForm.get('nameOnCard').value,
      expirationDate: expiryDate, PhoneNumber:this.paymentForm.get('PhoneNumber').value,
      securityCode: this.paymentForm.get('cardCVVNumber').value,
      MonthlyAdvertisingBudget: +this.paymentForm.get('amount').value,Email: this.paymentForm.get('email').value,
    };

    this.facade.makePayment(paymentFormData);
    this.PaymentService.makePayment(paymentFormData).subscribe(
      response => {
       if(response.body.status === 'success') {
         this.toasterService.pop('success', 'SUCCESSFUL', 'Your payment was successful')
       } else {
         this.toasterService.pop('error', 'FAILURE', 'Your payment Failed please try again later')
       }
     }
   )
  } else {
    this.errorMessage = "the Form is Invalid!";
  }
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
