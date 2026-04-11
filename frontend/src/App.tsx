import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Inventory } from './Pages/Inventory';
import { Analytics } from './Pages/Analytics';
import { Customers } from './Pages/Customers';
import { Sellers } from './Pages/Sellers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Analytics />} />
        <Route path="/estoque" element={<Inventory />} />
        <Route path="/consumidores" element={<Customers />} />
        <Route path="/vendedores" element={<Sellers />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
