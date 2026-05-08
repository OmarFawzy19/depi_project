import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

export default AppProviders;
