import "./login.css";
import { useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material"; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });

      if (response.status === 200) {
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/dashboard");
      } else {
        enqueueSnackbar("Login failed!", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error during login. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container"
    >
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-container">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Login
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            style={{ padding: "10px 20px", fontSize: "16px" }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
