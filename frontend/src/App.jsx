import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import RegisterCustomer from "./pages/RegisterCustomer"
import RegisterVendor from "./pages/RegisterVendor"
import CustomerDashboard from "./pages/customer/CustomerDashboard"
import VendorDashboard from "./pages/vendor/VendorDashboard"
import VendorDetail from "./pages/VendorDetail"
import AdminHome from "./pages/admin/AdminHome"
import AdminVendors from "./pages/admin/AdminVendors"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminReviews from "./pages/admin/AdminReviews"

function Guard({ children, allow }) {
  const { isAuthenticated, role, ready } = useAuth()
  if (!ready) return null
  if (!isAuthenticated) return <Navigate to="/login" replace/>
  if (allow && !allow.includes(role)) {
    if (role === "ADMIN") return <Navigate to="/admin" replace/>
    if (role === "VENDOR") return <Navigate to="/vendor/dashboard" replace/>
    return <Navigate to="/dashboard" replace/>
  }
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, role, ready } = useAuth()
  if (!ready) return null
  if (isAuthenticated) {
    if (role === "ADMIN") return <Navigate to="/admin" replace/>
    if (role === "VENDOR") return <Navigate to="/vendor/dashboard" replace/>
    return <Navigate to="/dashboard" replace/>
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path="/register/customer" element={<PublicRoute><RegisterCustomer/></PublicRoute>}/>
          <Route path="/register/vendor" element={<PublicRoute><RegisterVendor/></PublicRoute>}/>
          <Route path="/vendor/:id" element={<VendorDetail/>}/>
          <Route path="/dashboard" element={<Guard allow={["CUSTOMER"]}><CustomerDashboard/></Guard>}/>
          <Route path="/vendor/dashboard" element={<Guard allow={["VENDOR"]}><VendorDashboard/></Guard>}/>
          <Route path="/admin" element={<Guard allow={["ADMIN"]}><AdminHome/></Guard>}/>
          <Route path="/admin/vendors" element={<Guard allow={["ADMIN"]}><AdminVendors/></Guard>}/>
          <Route path="/admin/users" element={<Guard allow={["ADMIN"]}><AdminUsers/></Guard>}/>
          <Route path="/admin/reviews" element={<Guard allow={["ADMIN"]}><AdminReviews/></Guard>}/>
          <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
