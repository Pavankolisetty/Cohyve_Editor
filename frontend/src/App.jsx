import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CanvasEditor from "./pages/canvasEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<CanvasEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
