import {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from '@/pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import { UserContext } from "./context/userContext";
import Redirect from "./components/RoleRedirect";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";


function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  
  return (
    <UserContext.Provider value={{
            isOnboardingComplete, setIsOnboardingComplete, 
            isUserLoggedIn, setIsUserLoggedIn
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Redirect></Redirect>} ></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
          <Route path="/onboarding" element={<OnboardingPage></OnboardingPage>}></Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
          <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
          <Route path="/dashboard" element={ <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute> }></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
