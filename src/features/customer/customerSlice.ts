import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

interface Info {
  fullname: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address?: string | undefined;
  service: string
}

interface Customer {
  info: Info,
  total: number,
  ship: number
  concurent: string,
  order: string,
  time: string
}

interface EstimateFee {
  total: number,
  service_fee: number,
  insurance_fee: number,
  pick_station_fee: number,
  coupon_value: number,
  r2s_fee: number
}

const initialState: Customer = {
  info: {
    fullname: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    service: ""
  },
  concurent: "VND",
  ship: 0,
  total: 0,
  order: "",
  time: ""
};

export const sliceCustomer = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    updateInfo(state, info: PayloadAction<Info>) {
      state.info = info.payload;
    },
    updateShipFee(state, fee: PayloadAction<number>){
      state.ship = fee.payload;
    },
    updateTotal(state, total: PayloadAction<number>) {
      state.total = total.payload;
    },
    updateConcurrent(state, sign: PayloadAction<string>) {
      state.concurent = sign.payload;
    },
    updateOrder(state, order: PayloadAction<any>){
      state.order = order.payload.order;
      state.time = order.payload.time;
    },
    reset(state) {
      state = initialState;
    }
  }
});

export const {
  updateConcurrent,
  updateTotal,
  updateInfo,
  updateShipFee,
  updateOrder,
  reset
} = sliceCustomer.actions;

export const selectCustomer = (state: RootState) => state.customer;

export const estimatFee = (base: any, price: number): AppThunk => async dispatch => {

  let url = 'https://backend-tmdt.herokuapp.com/order/estimate-cost?';
  
  for(let key in base){
    url += `${key}=${base[key]}&`;
  }
  const res = await fetch(url);
  const cost: EstimateFee = await res.json();

  dispatch(updateShipFee(cost.total));
  dispatch(updateTotal(cost.total + price));
};

export default sliceCustomer.reducer;