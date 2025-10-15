import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Customize from "./pages/Customize.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import { useContext } from "react";
import { UserContex } from "./context/UserContext.jsx";
import Customize2 from "./pages/Customize2.jsx";
const App = () => {
  const { user, setUser } = useContext(UserContex);
  return (
    <Routes>
      <Route
        path="/"
        element={
          user?.assistantImage && user?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!user ? <Signin /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={user ? <Customize /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customize2"
        element={user ? <Customize2 /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
};

export default App;
