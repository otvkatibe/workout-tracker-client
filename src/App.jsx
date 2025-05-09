import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoadingWrapper from "./components/LoadingWrapper";
import AppRoutes from "./components/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LoadingWrapper>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </LoadingWrapper>
      </Router>
    </AuthProvider>
  );
}
