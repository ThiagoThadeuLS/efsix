export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes: Size[];
  stock: Record<string, number>; // size -> quantity
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Size {
  label: string;
  value: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ShippingOption {
  name: string;
  price: number;
  deadline: string;
  service: string;
}

export type OrderStatus =
  | 'Pendente'
  | 'Aprovado'
  | 'Preparando Envio'
  | 'Enviado'
  | 'Entregue'
  | 'Cancelado';

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PaymentInfo {
  method: 'pix' | 'credit_card';
  status: 'pending' | 'approved' | 'rejected';
  installments?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shipping: ShippingOption;
  address: Address;
  payment: PaymentInfo;
  status: OrderStatus;
  subtotal: number;
  total: number;
  nfeKey?: string;
  nfeIssued: boolean;
  createdAt: string;
}
