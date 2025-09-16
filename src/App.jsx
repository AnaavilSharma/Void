import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Void App 🚀</h1>
      <p className="mb-4">This is your home page.</p>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Count is {count}
      </button>
    </div>
  );
}

function About() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">About Page</h1>
      <p>This app is built with React + Django.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-red-500 text-xl">404 - Page not found</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-900 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;