import React from 'react';
import { Steps, Button, message, Row, Col } from 'antd';

import { connect } from 'react-redux';
import { updateOrder } from './features/customer/customerSlice';
import 'antd/dist/antd.css'
import './App.css';
import { Cart } from './features/cart/Cart';
import { Customer } from './features/customer/Customer';
import { Summary } from './features/summary/Summary';

const { Step } = Steps;

const steps = [
  {
    title: 'Chọn Sản Phẩm',
    content: <Cart step={0} />,
  },
  {
    title: 'Thông Tin Giao Hàng',
    content:
      <Row gutter={[24, 16]}>
        <Col span={12}>
          <Cart step={1} />
        </Col>
        <Col span={12}>
          <h1>Thông Tin Giao Hàng</h1>
          <Customer disable={false} />
        </Col>
      </Row>,
  },
  {
    title: 'Xác Nhận',
    content:
      <Row gutter={[24, 16]}>
        <Col span={12}>
          <Cart step={1} />
        </Col>
        <Col span={12}>
          <h1>Thông Tin Giao Hàng</h1>
          <Customer disable={true} />
        </Col>
      </Row>,
  },
  {
    title: 'Đơn Hàng',
    content: <Summary />,
  },
];

type AppState = {
  current: number
};

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  reset() {
    this.setState({ current: 0 });
  }

  createOrder() {
    let data: any = {};
    data.to_name = this.props.customer.info.fullname;
    data.to_phone = "+84" + this.props.customer.info.phone;
    data.to_address = this.props.customer.info.address ?? "";
    data.to_ward_code = this.props.customer.info.ward;
    data.to_district_id = this.props.customer.info.district;
    data.content = "Create Order From E-Comomerce Web";

    let items: any = [];
    console.log(this.props.cart.items);
    for (let key in this.props.cart.items) {
      items.push(this.props.cart.items[key]);
    }

    data.weight = items.reduce((total: number, h: any) => total + h.weight, 0);
    data.height = items.reduce((total: number, h: any) => total + h.height, 0);
    data.length = items.reduce((total: number, h: any) => Math.max(total, h.length), 0);
    data.width = items.reduce((total: number, h: any) => Math.max(total, h.width), 0);

    const service = JSON.parse(this.props.customer.info.service);
    data.service_id = service.service_id;
    data.service_type_id = service.service_type_id;
    data.required_note = 'CHOXEMHANGKHONGTHU';
    data.items =  items.map((item: any) => ({name: item.title, code: item.code.toString(), quantity: item.quantity}));
    data.payment_type_id = 1;
    
    return fetch('https://backend-tmdt.herokuapp.com/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    }).then(data => data.json()).then(data => {
      this.props.updateOrder({ order: data.order_code, time: data.expected_delivery_time });
      return data;
    });
  }

  render() {
    const { current } = this.state;
    return (
      <>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 2 && (
            <Button type="primary" onClick={() => this.next()}>
              Tiếp
            </Button>
          )}
          {current === steps.length - 2 && (
            <Button type="primary" onClick={() => {
              //Send to Server
              message.success('Đặt Hàng Thành Công!');
              this.next();
              this.createOrder().then((data) => {
                // Payment

                const payment = {
                  orderId: data.order_code,
                  orderInfo: this.props.customer.info.fullname,
                  amount: this.props.customer.total.toString(),
                  extraData: `phone=${this.props.customer.info.phone}`
                };


                return fetch('https://backend-tmdt.herokuapp.com/init-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                  },
                  body: JSON.stringify(payment)
                }).then(data => data.json()).then(data => {

                  setTimeout(() => {
                    window.location.href = data.data.payUrl;
                  }, 2000);
                });
              });
            }
            }>
              Hoàn Thành
            </Button>
          )}
        </div>
      </>
    );
  }
}

const mapper = (state: any) => ({ customer: state.customer, cart: state.cart });

export default connect(mapper, { updateOrder })(App);
