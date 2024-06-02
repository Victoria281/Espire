import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
//styles
import "./App.css"
//screens
import HomeScreen from "./screens/HomeScreen";
import PostScreen from "./screens/PostScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Template from "./screens/Template";
import LibraryScreen from "./screens/LibraryScreen";
import Navbar from './components/common/Navbar'

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="" element={<HomeScreen />} />
          <Route path="/databank" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/post" element={<PostScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/articles/:??" element={<Template />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
