import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cartReducer from '../features/cart/cartSlice';
import customerReducer from '../features/customer/customerSlice';
import addressReducer from '../features/customer/AddressSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart:  cartReducer,
    customer: customerReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
