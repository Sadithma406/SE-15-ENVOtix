import Signup from './pages/signup.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App(){
  return(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;