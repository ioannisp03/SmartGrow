import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid, Switch, Button, Skeleton } from "@mui/material";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

import { useAuth } from "../../services/authcontext";
import { ResponseInterface } from "../../types/Response";
import { DeviceInterface } from "../../types/Device";

export default function Dashboard() {
    const { id } = useParams();

    const { checkAuthStatus } = useAuth();

    const [deviceSavedData, setDeviceSavedData] = useState<DeviceInterface | null>(null);
    const [deviceCurrentData, setDeviceCurrentData] = useState<DeviceInterface | null>(null);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await checkAuthStatus();
                if (!id) return;

                const response = await fetch(`/api/devices/${id}`);

                if (response.ok) {
                    const result: ResponseInterface = await response.json();
                    setDeviceSavedData(result.data);
                } else {
                    console.error("Error fetching device data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id, checkAuthStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleLiveDataFetch();
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const handleLiveDataFetch = async () => {
        try {
            if (!id) return;

            const response = await fetch(`/api/devices/${id}/live`);

            if (response.ok) {
                const result: ResponseInterface = await response.json();

                setDeviceCurrentData(result.data);
            } else {
                console.error("Error fetching live data");
            }
        } catch (error) {
            console.error("Error fetching live data:", error);
        }
    };

    const handleValveSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValveState = event.target.checked;

        try {
            const response = await fetch(`/api/devices/${id}/valve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ valve_toggle: newValveState }),
            });

            if (response.ok) {
                setDeviceCurrentData((prevState) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            valve_toggle: newValveState,
                        };
                    }
                    return prevState;
                });
            } else {
                console.error("Error updating valve state");
            }
        } catch (error) {
            console.error("Error updating valve state:", error);
        }
    };

    const handleLightSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLightState = event.target.checked;

        try {
            const response = await fetch(`/api/devices/${id}/light`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ light_toggle: newLightState }),
            });

            if (response.ok) {
                setDeviceCurrentData((prevState) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            light_toggle: newLightState,
                        };
                    }
                    return prevState;
                });
            } else {
                console.error("Error updating light state");
            }
        } catch (error) {
            console.error("Error updating light state:", error);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ marginTop: 4 }}>
            {/* Title Section */}
            <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    {deviceSavedData ? `${deviceSavedData.name}'s Dashboard` : <Skeleton width="60%" />}
                </Typography>
                <Typography variant="body1" sx={{ color: "gray" }}>
                    {deviceSavedData ? (
                        <>Welcome to the SmartGrow system! <br />Track and Manage Your Device From Here.</>
                    ) : <Skeleton width="80%" />}
                </Typography>
            </Paper>

            {/* Main Dashboard Grid */}
            <Grid container spacing={4}>
                {/* Left Panels */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {deviceCurrentData ? "Toggles" : <Skeleton width="40%" />}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Light Toggle */}
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: 2,
                                    backgroundColor: deviceCurrentData?.light_toggle
                                        ? "lightgreen"
                                        : "lightcoral",
                                }}>
                                {deviceCurrentData ? (
                                    <Typography>Lights: ${deviceCurrentData?.light_toggle ? "ON" : "OFF"}</Typography>
                                ) : <Skeleton width="50%" />}

                                {deviceCurrentData ? (
                                    <Switch
                                        checked={deviceCurrentData?.light_toggle || false}
                                        onChange={handleLightSwitchChange}
                                        inputProps={{ "aria-label": "Lights switch" }}
                                    />
                                ) : <Skeleton width="20%" />}
                            </Paper>
                            {/* Valve Toggle */}
                            <Paper
                                elevation={3}
                                sx={{
                                    marginTop: 2,
                                    padding: 2,
                                    backgroundColor: deviceCurrentData?.valve_toggle
                                        ? "lightblue"
                                        : "lightcoral",
                                }}
                            >
                                <Typography>
                                    {deviceCurrentData ? (
                                        `Water Valve is currently: ${deviceCurrentData?.valve_toggle ? "ON" : "OFF"}`
                                    ) : <Skeleton width="60%" />}
                                </Typography>
                                {deviceCurrentData ? (
                                    <Switch
                                        checked={deviceCurrentData?.valve_toggle || false}
                                        onChange={handleValveSwitchChange}
                                        inputProps={{ "aria-label": "Water valve switch" }}
                                    />
                                ) : <Skeleton width="20%" />}
                            </Paper>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Panels */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {deviceCurrentData ? "Environment Metrics" : <Skeleton width="60%" />}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceCurrentData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Time:</Typography>
                                        <Typography>{currentTime}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "100%" }} />}
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceCurrentData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Humidity:</Typography>
                                        <Typography>{deviceCurrentData?.humidity?.[deviceCurrentData?.humidity.length - 1]?.value}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "100%" }} />}
                            </Paper>
                        </Box>
                        <Paper elevation={2} sx={{ marginTop: 2, padding: 2 }}>
                            {deviceCurrentData ? (
                                <Container maxWidth={false}>
                                    <Typography>Temperature:</Typography>
                                    <Typography>{deviceCurrentData?.temperature?.[deviceCurrentData?.temperature.length - 1]?.value}°C</Typography>
                                </Container>
                            ) : <Skeleton sx={{ marginTop: 2, padding: 2 }} />}
                        </Paper>

                        <Box sx={{ marginTop: 2 }}>
                            {deviceCurrentData ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleLiveDataFetch}
                                    sx={{ width: "100%" }}
                                >
                                    Fetch Data
                                </Button>
                            ) : <Skeleton width="100%" height={36} />}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Placeholder Line Chart */}
            <Grid container spacing={4} sx={{ marginTop: 4 }}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        {deviceSavedData ? <Typography variant="h5" gutterBottom>Temperature Over Time</Typography> : <Skeleton width="60%" />}
                        
                        {deviceSavedData ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart width={900} height={400} data={deviceSavedData?.humidity} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" name="Time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <Skeleton variant="rectangular" width="100%" height={400} />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
