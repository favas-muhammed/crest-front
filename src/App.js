import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./components/Auth";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import AuthLayout from "./components/navigation/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/profile"
          element={
            <AuthLayout>
              <Profile />
            </AuthLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AuthLayout>
              <Notifications />
            </AuthLayout>
          }
        />
        <Route
          path="/search"
          element={
            <AuthLayout>
              <Search />
            </AuthLayout>
          }
        />
        <Route
          path="/user-form"
          element={
            <AuthLayout>
              <UserForm />
            </AuthLayout>
          }
        />
        <Route
          path="/user-list"
          element={
            <AuthLayout>
              <UserList />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
