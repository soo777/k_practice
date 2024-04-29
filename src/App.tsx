import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/coin/home";
import Detail from "./pages/coin/detail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/coin" element={<Detail />} />
    </Routes>
  );
}

export default App;
