import { useState, useEffect } from "react";
import { ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainNavigation from "./components/Navigation/MainNavigation";
import NotFound from "./components/NotFound/NotFound";
import AuthPage from "./pages/Auth";
import TodoPage from "./pages/Todo";
import "./App.css";
import AuthContext from "./context/auth-context";

function App() {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const signup = (userId) => {
    setUserId(userId);
  }

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [token])

  return (
    <Router>
      <AuthContext.Provider
        value={{ token: token, userId: userId, signup: signup, login: login, logout: logout }}
      >
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {!token && <Route path="/" element={<Navigate replace to="/signin" />} />}
            {!token && <Route path="/todos" element={<Navigate replace to="/signin" />} />}
            {userId && <Route path="/signup" element={<Navigate replace to="/signin" />} />}
            {token && (
              <Route
                path="/signin"
                element={<Navigate replace to="/todos" />}
              />
            )}
            {token && <Route path="/" element={<Navigate replace to="/todos" />} />}
            <Route path="/signin" element={<AuthPage path="signin" />} />
            <Route path="/signup" element={<AuthPage path="signup" />} />
            <Route path="/todos" element={<TodoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer  theme="dark"/>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
