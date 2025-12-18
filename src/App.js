import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Admin from './pages/Admin';
import Customer from './pages/Customer';
import Addproduct from './pages/Addproduct';
import Updateproduct from './pages/Updateproduct';
import ViewCart from './pages/ViewCart';
import OrderHistory from './pages/OrderHistory';
import AdminOrders from './pages/AdminOrders';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/sign_up_page' element={<Signup />} />
        <Route path='/sign_in_page' element={<Signin />} />
        <Route path='/admin_page' element={<Admin />} />
        <Route path='/customer_page' element={<Customer />} />
        <Route path='/add_prod_page' element={<Addproduct />} />
        <Route path='/update_prod_page' element={<Updateproduct />} />
        <Route path='/view_cart_page' element={<ViewCart />} />
        <Route path='/order_history_page' element={<OrderHistory />} />
        <Route path='/admin_orders_page' element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
