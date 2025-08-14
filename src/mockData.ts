import type { MenuItem, Order, StoreInfo, TableInfo } from './types';

export const categories = ['찌개류','구이류','면류','밥류'];

export const menuItems: MenuItem[] = [
  { id:1, name:'김치찌개', category:'찌개류', price:8000, status:'판매중' },
  { id:2, name:'불고기', category:'구이류', price:15000, status:'판매중' },
  { id:3, name:'된장찌개', category:'찌개류', price:7000, status:'판매중' },
  { id:4, name:'냉면', category:'면류', price:9000, status:'품절' },
  { id:5, name:'고구마', category:'밥류', price:1000, status:'판매중' },
];

export const tables: TableInfo[] = [
  { id:1, name:'1번 테이블' },
  { id:2, name:'2번 테이블' },
  { id:3, name:'3번 테이블' },
  { id:4, name:'창가자리' },
];

export const initialOrders: Order[] = [
  { id:'o1', tableId:3, tableName:'3번 테이블', status:'신규', minutesAgo:3,
    items:[{name:'김치찌개', qty:2, price:16000},{name:'공기밥', qty:2, price:2000}], total:18000 },
  { id:'o2', tableId:1, tableName:'1번 테이블', status:'준비중', minutesAgo:10,
    items:[{name:'불고기', qty:1, price:15000},{name:'된장찌개', qty:1, price:7000}], total:22000 },
  { id:'o3', tableId:5, tableName:'5번 테이블', status:'완료', minutesAgo:25,
    items:[{name:'냉면', qty:1, price:9000}], total:9000 },
];

export const storeInfo: StoreInfo = {
  name:'맛있는 한식당',
  address:'서울시 강남구 테헤란로 123',
  phone:'02-1234-5678',
  desc:'정성스럽게 만든 한식을 제공하는 가족 경영 식당입니다.',
};
