import { RouteObject } from 'react-router-dom';
import { PublicLayout } from './app/layouts/PublicLayout';
import { Home } from './app/pages/Home';
import { Exhibitions } from './app/pages/Exhibitions';
import { ExhibitionDetail } from './app/pages/ExhibitionDetail';
import { Artists } from './app/pages/Artists';
import { Shop } from './app/pages/Shop';
import { ShopDetail } from './app/pages/ShopDetail';
import { Catalog } from './app/pages/Catalog';
import { PaintingDetail } from './app/pages/PaintingDetail';
import { CartPage } from './app/pages/CartPage';
import { Checkout } from './app/pages/Checkout';
import { NewsPage } from './app/pages/NewsPage';
import { NewsDetailPage } from './app/pages/NewsDetailPage';
import AdminApp from './app/AdminApp';

const adminPrefix = import.meta.env.VITE_ADMIN_PATH_PREFIX || 'admin';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'exhibitions',
        element: <Exhibitions />,
      },
      {
        path: 'exhibitions/:id',
        element: <ExhibitionDetail />,
      },
      {
        path: 'artists',
        element: <Artists />,
      },
      {
        path: 'artists/:id',
        element: <Artists />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'shop/:id',
        element: <ShopDetail />,
      },
      {
        path: 'catalog',
        element: <Catalog />,
      },
      {
        path: 'catalog/:id',
        element: <PaintingDetail />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'news/:id',
        element: <NewsDetailPage />,
      },
    ],
  },
  {
    path: adminPrefix,
    element: <AdminApp />,
  },
];
