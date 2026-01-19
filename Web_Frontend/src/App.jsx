import Signup from './pages/signup.jsx';
import Settings from "./pages/settings.jsx";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App(){
  return(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;