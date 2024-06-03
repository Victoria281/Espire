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
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ArticleScreen from "./screens/ArticleScreen";
import PostScreen from "./screens/PostScreen";
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
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/articles/:articleid" element={<ArticleScreen />} />
          <Route path="/post" element={<PostScreen />} />
          <Route path="/post/:articleid" element={<PostScreen />} />
          <Route path="/databank" element={<Template />} />
          <Route path="/dashboard" element={<Template />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
