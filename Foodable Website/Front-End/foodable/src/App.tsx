import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/MPComponents/Navbar";
import Footer from "./Components/MPComponents/Footer";
import Home from "./Components/pages/Home";
import About from "./Components/pages/About";
import Contact from "./Components/pages/Contact";
import Donator from "./Components/pages/Donator";
import Reward from "./Components/pages/Reward";
import Profile from "./Components/pages/Profile";
import Receiver from "./Components/pages/Receiver";
import Login from "./Components/pages/Login";
import Registration from "./Components/pages/Registration";
import Foodbank from "./Components/pages/Foodbank";

export default function App(): JSX.Element {
  const [loggedInUser, setLoggedinUser] = useState<string>("");
  
  return (
    <BrowserRouter>
      <Navbar loggedInUser={loggedInUser} />
      <Routes>
        <Route path="/" element={<Home loggedInUser={loggedInUser} />} />
        <Route path="/About" element={<About />} />
        <Route
          path="/Donator"
          element={<Donator setLoggedinUser={setLoggedinUser} />}
        />
        <Route
          path="/Reward"
          element={<Reward setLoggedinUser={setLoggedinUser} />}
        />
        <Route
          path="/Profile"
          element={<Profile setLoggedinUser={setLoggedinUser} />}
        />
        <Route path="/Receiver" element={<Receiver />} />
        <Route path="/Contact" element={<Contact />} />
        <Route
          path="/Login"
          element={<Login setLoggedinUser={setLoggedinUser} />}
        />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Foodbank" element={<Foodbank />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
