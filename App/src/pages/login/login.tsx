import "./login.css";
import { useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Paper, Box } from "@mui/material";

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
    <Container maxWidth="sm">
      <Paper sx={{ padding: "20px" }}>
        <Typography variant="h3" component="h4">Login</Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            sx={{ marginBottom: "20px" }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box sx={{ alignContent: 'center', justifyContent: 'space-around', display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
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
          </Box>
        </form>
      </Paper>

    </Container>
  );
};

export default LoginPage;
