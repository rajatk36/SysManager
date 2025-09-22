
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute"; 
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import {auth} from "../src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";


function App() {
    const [userId, setUserId]=useState("");
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
  });
  
  return () => unsubscribe(); // 👈 cleanup when component unmounts
}, [userId]);

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home userId={userId} />
            </ProtectedRoute>
          }
        />
        </Routes>
    </Router>
  );
}

export default App;
