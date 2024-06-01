import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useSelector } from "react-redux";
import useLocalStorage from 'use-local-storage'
//styles
import "./App.css"
//screens
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
