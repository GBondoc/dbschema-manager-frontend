import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch {
      alert("Login failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <div>
        <label>Email</label>
        <br />

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <br />

      <div>
        <label>Password</label>
        <br />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </div>

      <br />

      <button type="submit">
        Login
      </button>
    </form>
  );
}