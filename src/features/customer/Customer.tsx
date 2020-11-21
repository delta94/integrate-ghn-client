import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomer, updateInfo, estimatFee } from './customerSlice';

import {fetchProvinces, selectorAddress, fetchDitricts, fetchWards, fetchServices} from './AddressSlice';

import {
  Button,
  Form,
  Input,
  Select,
  Statistic,
  Row,
  Col
} from 'antd';
import { selectCart } from '../cart/cartSlice';
import { Item } from '../cart/Item';

const { Option } = Select;

export function Customer(props: any) {
  const customer = useSelector(selectCustomer);
  const address = useSelector(selectorAddress);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const onFinish = (values: any) => {
    let items: Item[] = [];
    for(let key in cart){
      items.push(cart[key]);
    }


    dispatch(updateInfo(values));
    const baseinfo = {
      height: items.reduce((total, h) => total + h.height, 0),
      width: items.reduce((total, h) => Math.max(total, h.width), 0),
      length: items.reduce((total, h) => Math.max(total, h.length), 0),
      weight: items.reduce((total, h) => total + h.weight, 0),
      service_id: JSON.parse(values['service'])['service_id'],
      district_id: values['district'],
      ward_code: values['ward']
    };
    
    dispatch(estimatFee(baseinfo, items.reduce((total, p) => total + p.price, 0)));
  };

  useEffect(() => {
    dispatch(fetchProvinces());
  }, []);

  return (
    <>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
        onFinish={onFinish}
      >
        <Form.Item
          label="Họ Và Tên"
          name="fullname"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ và tên!',
            },
          ]}
        >
          <Input placeholder="Nguyễn Văn A" disabled={props.disable}/>
        </Form.Item>

        <Form.Item
          label="Số Điện Thoại"
          name="phone"
          rules={[
            {
              required: true,
              pattern: /^\d{9}$/,
              message: 'Vui lòng nhập số điện thoại!',
            },
          ]}
        >
          <Input addonBefore={'+84'} placeholder="9 số" disabled={props.disable}/>
        </Form.Item>

        <Form.Item
          label="Tỉnh"
          name="province"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn tỉnh!',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn Tỉnh"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={
              (value) => {
                dispatch(fetchDitricts(Number(value)));
              }
            }
            disabled={props.disable}
          >
            {
              address.provinces?.map(province => <Option value={province.id}>{province.name}</Option>)
            }

          </Select>
        </Form.Item>


        <Form.Item
          label="Quận/Huyện"
          name="district"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn quận/huyện!',
            },
          ]}
          
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn Quận/Huyện"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => {
              dispatch(fetchWards(Number(value)));
              dispatch(fetchServices(Number(value)));
            }}
            disabled={props.disable}
          >
            {address.districts.map(district => <Option value={district.id}>{district.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phường/Xã"
          name="ward"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn quận/huyện!',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn Phường/Xã"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={props.disable}
          >
            {address.wards.map(ward => <Option value={ward.id}>{ward.name}</Option>)}
          </Select>
        </Form.Item>

        

        <Form.Item
          label="Số Nhà/Đường/Khu Phố"
          name="address"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền dịa chỉ chi tiết!',
            },
          ]}
        >
          <Input placeholder="3/3, Đường 12, Khu Phố 2" disabled={props.disable}/>
        </Form.Item>

        <Form.Item
          label="Dịch Vụ Chuyển"
          name="service"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn dịch vụ!',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn Dịch Vụ"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={props.disable}
          >
            {address.services.map(ward => <Option value={JSON.stringify(ward)}>{ward.short_name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={props.disable}>Tính Tiền</Button>
        </Form.Item>
      </Form>
      <Row>
        <Col offset={0}>
          <Statistic
            title={`Phí Giao Hàng: `}
            value={customer.ship + " " + customer.concurent}
          />
        </Col>
        <Col offset={6}>
          <Statistic
            title={`Tổng Tiền: `}
            value={customer.total + " " + customer.concurent}
          />
        </Col>
      </Row>

    </>
  );
}