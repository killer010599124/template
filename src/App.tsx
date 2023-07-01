import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import LoginPage from "./pages/login/login";
import SignUpPage from "./pages/login/signup";
import "./configs/firebaseConfig";
import ProtectRoute from "./routes/protectRoute";
import SatelitteMap from "./pages/dashboard/SatelitteMap";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<ProtectRoute />}>
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>
        </Route>
        {/* <ProtectRoute path="/" element={<MainLayout />}>
          {routes}
        </ProtectRoute> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
