import React from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Register from "./view/Register";
import Login from "./view/Login";
import Home from "./view/Home";
import Replies from "./view/Replies";

const App = () => {
  return (
    <div>
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<Home />} />
      <Route path='/:threadId/replies' element={<Replies />} />

     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
