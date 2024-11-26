import React, { useState } from "react";
import "./register.css";
import { useSnackbar } from "notistack";
import { Button, TextField } from "@mui/material";

import axios from "axios";

import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register",{ username, email, password });

      if (response.status === 201) {
        enqueueSnackbar("Successfully created account!", {
          variant: "success",
        });
        navigate("/login");
      } else {
        enqueueSnackbar("Email already registered.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to register. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "20px" }}>
          <TextField
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </form>
      <Button
        id="register-button"
        type="submit"
        variant="contained"
        color="primary"
        style={{ padding: "10px 20px", fontSize: "16px" }}
        onClick={handleRegister}
      >
        Register
      </Button>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
