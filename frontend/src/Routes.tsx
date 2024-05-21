import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";

const Routess: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<SignUp />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/favoritos" element={<Favorites />} />
      </Routes>
    </Router>
  );
};

export default Routess;
