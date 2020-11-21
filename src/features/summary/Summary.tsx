import React from 'react';
import { Result } from 'antd';
import {useSelector} from 'react-redux';
import { selectCustomer } from '../customer/customerSlice';
export function Summary() {
    const customer = useSelector(selectCustomer);
    return (
        <Result
            title="Thông Tin Giao Hàng"
            subTitle={`Order number: ${customer.order} Dự Kiến Giao Hàng: ${new Date(customer.time).toLocaleString()}`}

        />
    );
}