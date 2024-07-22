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
import PrePostScreen from "./screens/PrePostScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ArticleScreen from "./screens/ArticleScreen";
import CollectionScreen from "./screens/CollectionScreen";
import SharedCollectionScreen from "./screens/SharedCollectionScreen";
import DashboardScreen from "./screens/DashboardScreen";
import LibraryScreen from "./screens/LibraryScreen";
import DatabankScreen from "./screens/DatabankScreen";
import Navbar from './components/common/Navbar'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
        <Route
          path="/collection/:collectionid"
          element={
            <DndProvider backend={HTML5Backend}>
              <CollectionScreen />
            </DndProvider>
          }
        />
        <Route
          path="/shared/collection/:collectionid"
          element={
            <DndProvider backend={HTML5Backend}>
              <SharedCollectionScreen />
            </DndProvider>
          }
        />
        <Route path="/post" element={<PrePostScreen />} />
        <Route path="/post/:url" element={<PrePostScreen />} />
        <Route path="/manpost" element={<PostScreen />} />
        <Route path="/manpost/:articleid" element={<PostScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
