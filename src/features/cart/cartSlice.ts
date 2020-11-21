import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Item } from './Item';

interface Cart {
    [code: number]: Item;
}

interface CartState {
    items: Cart
}

const initialState: CartState = {
    items: {}
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toogle: (state, item: PayloadAction<Item>) => {
            if (state.items[item.payload.code]) {
                delete state.items[item.payload.code];
            } else {
                state.items[item.payload.code] = item.payload;
            }
        },
        reset(state) {
            state = initialState;
        }
    }
});

export const { toogle, reset } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.items;

export default cartSlice.reducer;