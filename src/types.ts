export type OrderStatus = '신규' | '준비중' | '완료';

export interface OrderItem { name: string; qty: number; price: number }
export interface Order {
  id: string;
  tableId: number;
  tableName: string;
  status: OrderStatus;
  minutesAgo: number;
  items: OrderItem[];
  total: number;
  createdAt?: string;
}

export interface MenuItem {
  id: number; name: string; category: string; price: number; status: '판매중'|'품절'; img?: string;
}
export interface TableInfo { id: number; name: string }
export interface StoreInfo { name: string; address: string; phone: string; desc?: string }
