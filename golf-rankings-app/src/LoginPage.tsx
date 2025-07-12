import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: (username: string, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isSignUp
        ? "http://localhost:5001/api/signup"
        : "http://localhost:5001/api/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          ...(isSignUp && { email }),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      onLogin(username, data.token); // Pass username and token to parent
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  return (
    <div className="login-page">
      <h1>{isSignUp ? "Create Account" : "Login"}</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        )}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        style={{
          marginTop: "1rem",
          background: "none",
          border: "none",
          color: "blue",
          cursor: "pointer",
        }}
      >
        {isSignUp ? "Already have an account? Login" : "Create an account"}
      </button>
    </div>
  );
};

export default LoginPage;
