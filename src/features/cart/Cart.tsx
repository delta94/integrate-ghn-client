import React from 'react';
import 'antd/dist/antd.css';
import Jelly from '../../images/Jelly.jpg';
import Candy from '../../images/Candy.jpg';
import { Item } from './Item';
import { List, Space, Checkbox } from 'antd';

import { DollarCircleTwoTone, ShoppingCartOutlined, GatewayOutlined, BoxPlotOutlined} from '@ant-design/icons';

import { toogle, selectCart } from './cartSlice';
import { useSelector, useDispatch } from 'react-redux';

const listData: Item[] = [
  {
    code: 0,
    title: 'Mứt',
    image: Jelly,
    price: 100000,
    unit: "VND",
    quantity: 2,
    height: 30,
    width: 10,
    length: 10,
    description: "Dâu Tây",
    content: "Vị ngon nhà làm, ngon như mẹ làm.",
    weight: 1000
  },
  {
    code: 1,
    title: 'Kẹo',
    image: Candy,
    price: 20000,
    unit: "VNĐ",
    height: 5,
    width: 3,
    length: 3,
    quantity: 4,
    description: "Kẹo bốn mùa",
    content: "Đưa bạn đi bốn mùa",
    weight: 150
  }
];


type PropsIconText = {
  label: string,
  icon: any,
  text: string
}

const IconText = (props: PropsIconText) => (
  <Space>
    {React.createElement(props.icon)}
    {props.label}
    {props.text}
  </Space>
);

type CartPops = {
  step: number
}

export function Cart(pops: CartPops) {
  let cart = useSelector(selectCart);
  let dispatch = useDispatch();
  let data = listData;
  if (pops.step === 1) {
    data = data.filter(i => !!cart[i.code]);
  }
  return (
    <>
      <List<Item>
        itemLayout="vertical"
        size="default"
        dataSource={data}
        header={
          <h1>Giỏ Hàng</h1>
        }
        renderItem={item => (
          <List.Item
            key={item.code}
            actions={[
              <IconText label='Số Lượng' icon={ShoppingCartOutlined} text={item.quantity.toString()} key={`list-cart-${item.code}`} />,
              <IconText label='Giá' icon={DollarCircleTwoTone} text={`${item.price} ${item.unit}`} key={`list-price-${item.code}`} />,
              <IconText label='Size' icon={GatewayOutlined} text={`${item.width} x ${item.height} x ${item.length} cm`} key={`list-size-${item.code}`} />,
              <IconText label='Weight' icon={BoxPlotOutlined} text={`${item.weight} gram`} key={`list-weight-${item.code}`} />
            ]}
            extra={
              <img
                height={200}
                alt="logo"
                src={item.image}
              />
            }
          >
            <List.Item.Meta
              avatar={<Checkbox disabled={pops.step === 1} checked={!!cart[item.code]} onChange={() => dispatch(toogle(item))} />}
              title={item.title}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </>
  );
}