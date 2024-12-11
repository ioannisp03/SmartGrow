import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import { Container, Typography, Box, Paper, Grid, Switch, Button, Skeleton } from "@mui/material";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

import { DeviceInterface } from "../types/Device";

import { useAuth } from "../services/authcontext";

export default function Dashboard() {
    const { user, checkAuthStatus } = useAuth();
    const { id } = useParams();


    const [deviceData, setDeviceData] = useState<DeviceInterface | null>(null);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        if (!id) return;
    
        const device = user?.devices?.[parseInt(id)];
    
        if (!device) return;

        const formattedData = device.history.map((reading: any) => ({
            ...reading,
            time: new Date(reading.time * 1000).toLocaleTimeString(),
        }));

        setDeviceData({ ...device, history: formattedData });
    }, [user, id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleChange = async (type: string, newState: boolean) => {
        try {
            const { status } = await axios.post(`/api/devices/${id}/${type}`, {
                [`${type}_toggle`]: newState,
            });
    
            if (status === 200) {
                handleLiveDataFetch()
            } else {
                console.error(`Error updating ${type} state`);
            }
        } catch (error) {
            console.error(`Error updating ${type} state:`, error);
        }
    };
    
    const handleLiveDataFetch = async () => {
        if (!id) return;
    
        try {
            await checkAuthStatus();

            const device = user?.devices?.[parseInt(id)];

            if (!device) return;

            setDeviceData(device);
        } catch (error) {
            console.error("Error fetching live data:", error);
        }
    };
    
    const handleValveSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleToggleChange('valve', event.target.checked);
    };
    
    const handleLightSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleToggleChange('light', event.target.checked);
    };    

    return (
        <Container maxWidth="xl" sx={{ marginTop: 4 }}>
            {/* Title Section */}
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    {deviceData ? `${deviceData.name}'s Dashboard` : <Skeleton width="60%" />}
                </Typography>
                <Typography variant="body1" sx={{ color: "gray" }}>
                    {deviceData ? (
                        <>Welcome to the SmartGrow system! <br />Track and Manage Your Device From Here.</>
                    ) : <Skeleton width="80%" />}
                </Typography>
            </Paper>

            {/* Main Dashboard Grid */}
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {/* Left Panels */}
                <Grid item xs={12} md={6} sm={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {deviceData ? "Toggles" : <Skeleton width="40%" />}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Light Toggle */}
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: 2,
                                    backgroundColor: deviceData?.live?.light_toggle
                                        ? "lightgreen"
                                        : "lightcoral",
                                }}>
                                {deviceData ? (
                                    <Typography>Lights: {deviceData?.live?.light_toggle ? "ON" : "OFF"}</Typography>
                                ) : <Skeleton width="50%" />}

                                {deviceData ? (
                                    <Switch
                                        checked={deviceData?.live?.light_toggle || false}
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
                                    backgroundColor: deviceData?.live?.valve_toggle
                                        ? "lightblue"
                                        : "lightcoral",
                                }}>
                                {deviceData ? (
                                    <Typography>Valve: {deviceData?.live?.valve_toggle ? "OPEN" : "CLOSED"}</Typography>
                                ) : <Skeleton width="60%" />}

                                {deviceData ? (
                                    <Switch
                                        checked={deviceData?.live?.valve_toggle || false}
                                        onChange={handleValveSwitchChange}
                                        inputProps={{ "aria-label": "Water valve switch" }}
                                    />
                                ) : <Skeleton width="20%" />}
                            </Paper>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Panels */}
                <Grid item xs={12} md={6} sm={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {deviceData ? "Environment Metrics" : <Skeleton width="60%" />}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: { xs: "wrap", sm: "nowrap" }, gap: 1 }}>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Time:</Typography>
                                        <Typography>{currentTime}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "60%" }} />}
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Light:</Typography>
                                        <Typography>{deviceData?.live?.light}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "60%" }} />}
                            </Paper>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: { xs: "wrap", sm: "nowrap" }, gap: 1, marginTop: 1 }}>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Temperature:</Typography>
                                        <Typography>{deviceData?.live?.temperature}°C</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "60%" }} />}
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Humidity:</Typography>
                                        <Typography>{deviceData?.live?.humidity}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "60%" }} />}
                            </Paper>
                            <Paper elevation={2} sx={{ padding: 2, width: "100%" }}>
                                {deviceData ? (
                                    <Container maxWidth={false}>
                                        <Typography>Moisture:</Typography>
                                        <Typography>{deviceData?.live?.moisture}</Typography>
                                    </Container>
                                ) : <Skeleton sx={{ padding: 2, width: "60%" }} />}
                            </Paper>
                        </Box>

                        <Box sx={{ marginTop: 2 }}>
                            {deviceData ? (
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

            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        {deviceData ? <Typography variant="h5" gutterBottom>Temperature Over Time</Typography> : <Skeleton width="60%" />}

                        {deviceData ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart width={900} height={400} data={deviceData?.history} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" name="Time" />
                                    <YAxis />
                                    <Tooltip/>
                                    <Legend />
                                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <Skeleton variant="rectangular" width="100%" height={400} />}
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        {deviceData ? <Typography variant="h5" gutterBottom>Humidity, Moisture, And Light Over Time</Typography> : <Skeleton width="60%" />}

                        {deviceData ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart width={900} height={400} data={deviceData?.history} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" name="Time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="moisture" stroke="#83ffdb" name="Moisture" />
                                    <Line type="monotone" dataKey="humidity" stroke="#ffe45f" name="Humidity" />
                                    <Line type="monotone" dataKey="light" stroke="#e58eff" name="Light" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <Skeleton variant="rectangular" width="100%" height={400} />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
