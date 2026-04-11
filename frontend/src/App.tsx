import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Inventory } from './Pages/Inventory/Inventory';
import { Customers } from './Pages/Customers/Customers';
import { Analytics } from './Pages/Analytics/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/estoque" element={<Inventory />} />
        <Route path="/clientes" element={<Customers />} />
        <Route path="/dashboard" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/estoque" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
