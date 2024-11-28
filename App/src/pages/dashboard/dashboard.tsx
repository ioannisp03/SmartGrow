import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/authcontext";
import "./dashboard.css";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isWaterOn, setIsWaterOn] = useState(false);
  const [leds, setLeds] = useState({
    lights: { status: false },
  });

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Not sure how this will be handled yet
  const handleWaterSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsWaterOn(event.target.checked);
  };

  // Not sure how this will be handled yet, I just made it buildable for now
  const handleLightSwitchChange =
    (lightKey : any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setLeds((prevLeds) => ({
        ...prevLeds,
        [lightKey]: { status: event.target.checked },
      }));
    };

  // Dummy data for graph
  const placeholderData = [
    { time: "10:00 AM", temperature: 22 },
    { time: "11:00 AM", temperature: 24 },
    { time: "12:00 PM", temperature: 23 },
    { time: "01:00 PM", temperature: 25 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    fetchData();
  }, [user !== null]);

  if (loading || !isAuthenticated) return <CircularProgress color="success" />;

  return (
    <Container maxWidth="xl" sx={{ marginTop: 4 }}>
      {/* Title Section */}
      <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          SmartGrow Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "gray" }}>
          Welcome to the SmartGrow system! <br />
          Track and Manage Your Device From Here.
        </Typography>
      </Paper>

      {/* Main Dashboard Grid */}
      <Grid container spacing={4}>
        {/* Left Panels */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Toggles
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Light 1 Switch */}
              <Paper
                elevation={2}
                sx={{
                  padding: 2,
                  backgroundColor: leds.lights?.status
                    ? "lightgreen"
                    : "lightcoral",
                }}
              >
                <Typography>
                  Lights: {leds.lights?.status ? "ON" : "OFF"}
                </Typography>
                <Switch
                  checked={leds.lights?.status}
                  onChange={handleLightSwitchChange("lights")}
                  inputProps={{ "aria-label": "Lights switch" }}
                />
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  marginTop: 2,
                  padding: 2,
                  backgroundColor: isWaterOn ? "lightblue" : "lightcoral",
                }}
              >
                <Typography>
                  Water is currently: {isWaterOn ? "ON" : "OFF"}
                </Typography>
                <Switch
                  checked={isWaterOn}
                  onChange={handleWaterSwitchChange}
                  inputProps={{ "aria-label": "Water switch" }}
                />
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panels */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Environment Metrics
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                <Typography>Time</Typography>
                {currentTime}
              </Paper>
              <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                {/* Add actual humidity of the sensor */}
                <Typography>Humidity: 45%</Typography>
              </Paper>
            </Box>
            <Paper
              elevation={2}
              sx={{
                marginTop: 2,
                padding: 2,
              }}
            >
              {/* Add actual temperature of the sensor */}
              <Typography>Temperature: 25°C</Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>

      {/* Placeholder Line Chart */}
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Temperature Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                width={900}
                height={400}
                data={placeholderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
