import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import GamePage from './game/Game';
import Voucher from './pages/Voucher';
import GenerateVoucherPage from './pages/GenerateVoucherPage';
import Qrcode from './pages/Qrcode';
import NewsAndEvent from './pages/NewsAndEvent';
import Contact from './pages/Contact'
import Menu from './pages/Menu';
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminDashboard from './pages/AdminDashboard';
import Printer from './pages/Printer';
import MenuOrder from './pages/MenuOrder';
import PosPage from './pages/PosPage';
import PosMenu from './pages/PosMenu';
import test from './pages/test';
import RuleOfService from './pages/RuleOfService';
// Layout Component ทำหน้าที่เป็นโครงเว็บหลัก
const Layout = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

// การตั้งค่า Router
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/game", element: <GamePage /> },
      { path: "/Voucher", element: <Voucher /> },
      { path: "/GenerateVoucherPage", element: <GenerateVoucherPage /> },
      { path: "/Qrcode", element: <Qrcode /> },
      { path: "/NewsAndEvent", element: <NewsAndEvent /> },
      { path: "/Contact", element: <Contact /> },
      { path: "Menu" , element: <Menu />},
      { path: "TermsOfService" , element: <TermsOfService />},
      { path: "PrivacyPolicy" , element: <PrivacyPolicy />},
      //{ path: "test" , element: <test />},
      { path: "AdminDashboard" , element: <AdminDashboard />},
      //{ path: "Printer", element: <Printer /> },
      //{ path: "MenuOrder", element: <MenuOrder /> },
      //{ path: "PosPage", element: <PosPage /> },
      //{ path: "PosMenu", element: <PosMenu /> },
      { path: "TermOfService", element: <RuleOfService /> },
    ]
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

