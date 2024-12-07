import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { Button, TextField, Container, Typography, Paper, Box } from "@mui/material";

import { useAuth } from "../../services/authcontext";

import { ResponseInterface } from "../../types/Response";

import "./login.css";

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", { username, password });

      if (response.status === 200 && response.data != null) {
        login(response.data);
      } else {
        enqueueSnackbar("Login failed!", { variant: "error" });
      }
    } catch(error) {
      const axiosError = error as AxiosError<ResponseInterface>;

      enqueueSnackbar(axiosError?.response?.data?.message || "Error during login. Please try again.", { variant: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: "20px" }}>
        <Typography variant="h3" component={"h4"} sx={{ marginBottom: "20px" }}>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
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
            label="Password"
            type="password"
            placeholder="Password"
            variant="outlined"
            value={password}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Box
            sx={{
              alignContent: "center",
              justifyContent: "space-around",
              display: "grid",
              gap: 1,
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
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
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
