import React, { useState } from "react";

import { useSnackbar } from "notistack";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./register.css";

const RegisterPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        enqueueSnackbar("Successfully created account!", {
          variant: "success",
        });
        navigate("/login");
      } else {
        enqueueSnackbar("Email already registered.", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Failed to register. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: "20px" }}>
        <Typography variant="h3" component={"h4"} sx={{marginBottom:"20px"}}>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            type="text"
            placeholder="Username"
            value={username}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            type="email"
            placeholder="Email"
            value={email}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            value={password}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
        <Typography sx={{ marginTop: "20px" }}>
          Already have an account? <a href="/login">Login here</a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
