import { useState } from "react";
import Upload from "./components/Upload";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { LangProvider } from "./LangContext";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(localStorage.getItem("username"));

  const handleLogin = (username) => {
    setUser(username);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setPage("login");
  };

  return (
    <LangProvider>
      {user ? (
        <Upload username={user} onLogout={handleLogout} />
      ) : page === "signup" ? (
        <Signup onSwitch={() => setPage("login")} onSuccess={() => setPage("login")} />
      ) : (
        <Login onSwitch={() => setPage("signup")} onLogin={handleLogin} />
      )}
    </LangProvider>
  );
}

export default App;
