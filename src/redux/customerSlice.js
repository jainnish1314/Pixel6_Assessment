import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customers: []
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addCustomer: (state, action) => {
            state.customers.push(action.payload);
        },
        editCustomer: (state, action) => {
            const index = state.customers.findIndex(customer => customer.PAN === action.payload.PAN);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        },
        deleteCustomer: (state, action) => {
            state.customers = state.customers.filter(customer => customer.PAN !== action.payload);
        }
    }
});

export const { addCustomer, editCustomer, deleteCustomer } = customerSlice.actions;

export default customerSlice.reducer;
