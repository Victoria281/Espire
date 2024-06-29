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
import ArticleScreen from "./screens/ArticleScreen";
import Template from "./screens/Template";
import LibraryScreen from "./screens/LibraryScreen";
import DatabankScreen from "./screens/DatabankScreen";
import Navbar from './components/common/Navbar'

const App = () => {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/databank" element={<DatabankScreen />} />
          <Route path="/articles/:articleid" element={<ArticleScreen />} />
          <Route path="/post" element={<PostScreen />} />
          <Route path="/post/:articleid" element={<PostScreen />} />
          <Route path="/dashboard" element={<Template />} />
        </Routes>
      </Router>
  );
}

export default App;
