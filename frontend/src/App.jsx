import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/chats' element={<Chats />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
