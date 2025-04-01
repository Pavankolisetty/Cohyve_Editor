import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CanvasEditor from "./pages/canvasEditor"; // ✅ Corrected Import
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<CanvasEditor />} /> {/* ✅ Updated Route */}
      </Routes>
    </Router>
  </React.StrictMode>
);
