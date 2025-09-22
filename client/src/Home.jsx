import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./pages/dashboard/Dashboard"

function Home({userId}) {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/*" element={<Dashboard userId={userId} />} />
      </Routes>
    </div>
  );
}

export default Home;