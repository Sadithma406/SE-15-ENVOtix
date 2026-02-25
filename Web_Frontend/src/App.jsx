import Signup from './pages/signup.jsx';
import Settings from "./pages/settings.jsx";
import Dashboard from "./pages/dashboard.jsx";
import MapView from "./pages/mapview.jsx";
import Login from './pages/loginpage.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App(){
  return(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapview" element={<MapView />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;