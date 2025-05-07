import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoadingWrapper from "./components/LoadingWrapper";
import AppRoutes from "./components/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LoadingWrapper>
          <AppRoutes />
        </LoadingWrapper>
      </Router>
    </AuthProvider>
  );
}
