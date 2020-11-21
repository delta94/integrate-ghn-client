import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
interface Province {
  id: number,
  name: string
}

interface District {
  id: number,
  name: string
}

interface Ward {
  id: number,
  name: string
}

interface Service {
  service_id: number,
  short_name: string,
  service_type_id: number
}

interface Address {
  provinces: Province[],
  districts: District[],
  wards: Ward[],
  services: Service[]
}

const intialState: Address = {
  provinces: [],
  districts: [],
  wards: [],
  services: []
};

export const sliceAddress = createSlice({
  name: 'address',
  initialState: intialState,
  reducers: {
    addProvinces(state, provinces: PayloadAction<Province[]>) {
      state.provinces = provinces.payload;
    },
    addDistricts(state, districts: PayloadAction<District[]>) {
      state.districts = districts.payload;
    },
    addWards(state, wards: PayloadAction<Ward[]>){
      state.wards = wards.payload;
    },
    addServices(state, services: PayloadAction<Service[]>){
      state.services = services.payload;
    }
  }
});


export const { addProvinces, addDistricts, addWards, addServices } = sliceAddress.actions;

export const selectorAddress = (state: RootState) => state.address;

export const fetchProvinces = (
): AppThunk => async dispatch => {
  const data = await fetch('http://localhost:8080/address/provinces');
  const provinces: Province[] = await data.json();
  dispatch(addProvinces(provinces));
  dispatch(addDistricts([]));
  dispatch(addWards([]));
  dispatch(addServices([]));
};

export const fetchDitricts = (
  province: number
): AppThunk => async dispatch => {
  const data = await fetch(`http://localhost:8080/address/districts?province=${province}`);
  const districts: District[] = await data.json();
  dispatch(addDistricts(districts));
  dispatch(addWards([]));
  dispatch(addServices([]));
};


export const fetchWards = (
  district: number
): AppThunk => async dispatch => {
  const data = await fetch(`http://localhost:8080/address/wards?district=${district}`);
  const wards: Ward[] = await data.json();
  dispatch(addWards(wards));
};

export const fetchServices = (
  district: number
): AppThunk => async dispatch => {
  const data = await fetch(`http://localhost:8080/address/services?district=${district}`);
  const services: Service[] = await data.json();
  dispatch(addServices(services));
};

export default sliceAddress.reducer;