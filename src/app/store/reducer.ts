
import { Action, createReducer, on } from '@ngrx/store';
import { CreditCardState } from '../models/credit-card.interface';
import * as creditCardPaymentActions from './actions';
// import { creditCardPaymentAdapter, initialState, State } from './state';

export const featureKey = 'creditCard';
export const currentDate = new Date();

export const initialCreditCardState: CreditCardState = {
  creditCardNumber: '',
  cardHolder: '',
  expirationDate: currentDate,
  securityCode: '',
  MonthlyAdvertisingBudget: 0,PhoneNumber:0, Email:'',
}

export interface PaymentState {
  isLoading?: boolean;
  error?: any;
  creditCardData?: CreditCardState;
}

export const initialState: PaymentState = {
  isLoading: false,
  error: null,
  creditCardData: initialCreditCardState
};


const featureReducer = createReducer(
  initialState,
  on(creditCardPaymentActions.load, state => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(
    creditCardPaymentActions.changeValidationStatus,
    (
      state: PaymentState,
      { isLoading }: ReturnType<typeof creditCardPaymentActions.changeValidationStatus>
    ) => ({
      ...state,
      isLoading
    })
  ),

  on(creditCardPaymentActions.loadSuccess, (state, { creditCardData }) => {
    return  {
      ...state,
      creditCardData,
      isLoading: false,
      error: null
    };
  }),
  on(creditCardPaymentActions.payWithCardSuccess, (state, { creditCardData }) => ({
    ...state,
    creditCardData,
    isLoading: false,
    error: null
  }))
);

export function reducer(state: PaymentState, action: Action) {
  return featureReducer(state, action);
}
export const selectPersonalGroupData = (state: PaymentState) => state.creditCardData;
export const selectPersonalGroupIsValid = (state: PaymentState) => state.isLoading;