import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard/*"         element={<DashboardLayout />} />
        <Route path="/lgu/dashboard/*"           element={<DashboardLayout />} />
        <Route path="/establishment/dashboard/*" element={<DashboardLayout />} />
        <Route path="/tourist/dashboard/*"       element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}