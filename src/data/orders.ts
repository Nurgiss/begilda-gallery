export interface Order {
  id: number;
  paintingId: number;
  paintingTitle: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}

export const orders: Order[] = [
  {
    id: 1,
    paintingId: 1,
    paintingTitle: 'Абстрактная гармония',
    customerName: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
    message: 'Хочу забрать самовывозом',
    status: 'new',
    price: 45000,
    createdAt: '2026-01-05T10:30:00'
  },
  {
    id: 2,
    paintingId: 2,
    paintingTitle: 'Современный взгляд',
    customerName: 'Мария Иванова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    address: 'г. Санкт-Петербург, Невский проспект, д. 25, кв. 12',
    message: '',
    status: 'processing',
    price: 52000,
    createdAt: '2026-01-04T14:20:00'
  },
  {
    id: 3,
    paintingId: 3,
    paintingTitle: 'Горный пейзаж',
    customerName: 'Алексей Сидоров',
    email: 'alex@example.com',
    phone: '+7 (999) 345-67-89',
    address: 'г. Екатеринбург, ул. Малышева, д. 50, кв. 8',
    message: 'Доставка курьером',
    status: 'completed',
    price: 38000,
    createdAt: '2026-01-02T09:15:00'
  }
];
