import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import BookingComponent from "./components/Booking";
import ReportComponent from "./components/Report";
import { useUser } from "./UserContext";
import LoginComponent from "./components/Login";
import Body from "./components/Body";
import SignupComponent from "./components/Signup";
import MyBookingsComponent from "./components/My-bookings";
import AdminEquipmentComponent from "./components/Admin/equipment/equipment";
import AdminUsersComponent from "./components/Admin/users/users";
import AccountInfoComponent from "./components/Account";

function App() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Body />}>
        {user ? (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/booking" element={<BookingComponent />} />
            <Route path="/report" element={<ReportComponent />} />
            <Route path="/mybookings" element={<MyBookingsComponent />} />
            <Route path="/accountinfo" element={<AccountInfoComponent />} />
            {user.role === "admin" && (
              <>
                <Route
                  path="/admin/equipment"
                  element={<AdminEquipmentComponent />}
                />
                <Route path="/admin/users" element={<AdminUsersComponent />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
