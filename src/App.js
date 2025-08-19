import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./components/Auth";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
