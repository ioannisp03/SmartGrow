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

import axios, { AxiosError } from "axios";
import { ResponseInterface } from "../types/Response";

export default function RegisterPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/register", { username, email, password });

      if (response.status === 201) {
        enqueueSnackbar("Successfully created account!", { variant: "success" });
        navigate("/login");
      } else {
        enqueueSnackbar("Email already registered.", { variant: "error" });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ResponseInterface>;

      enqueueSnackbar(axiosError?.response?.data?.message || "Error during registration. Please try again.", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: "20px" }}>
        <Typography variant="h3" component={"h4"} sx={{ marginBottom: "20px" }}>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            type="text"
            placeholder="Username"
            variant="outlined"
            value={username}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="Example@email.com"
            variant="outlined"
            value={email}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            placeholder="Password"
            variant="outlined"
            value={password}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            id="register-button"
            type="submit"
            variant="contained"
            color="primary"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Register
          </Button>
        </form>

        <Typography sx={{ marginTop: "20px" }}>
          Already have an account? <a href="/login">Login here</a>
        </Typography>
      </Paper>
    </Container>
  );
};