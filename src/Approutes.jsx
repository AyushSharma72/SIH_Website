import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from "./App.jsx"; // Import your main App component or other components
import Tollnaka from './Tollnaka.jsx';
import Reports from './Reports.jsx';
function Approutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tollnaka" element={<Tollnaka />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default Approutes;