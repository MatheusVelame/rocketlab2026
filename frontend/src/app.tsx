import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Inventory } from './pages/inventory';
import { Analytics } from './pages/analytics';
import { Customers } from './pages/customers';
import { Sellers } from './pages/sellers';
import OrderItems from './pages/orderitems';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Analytics />} />
        <Route path="/estoque" element={<Inventory />} />
        <Route path="/consumidores" element={<Customers />} />
        <Route path="/vendedores" element={<Sellers />} />
        <Route path="/itens" element={<OrderItems />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
