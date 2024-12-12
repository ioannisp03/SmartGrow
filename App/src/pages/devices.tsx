import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Container, Grid, Card, CardContent, Typography, CardMedia, ButtonBase } from "@mui/material";

import { DeviceInterface } from "../types/Device";

import { useAuth } from "../services/authcontext";

export default function Devices() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<DeviceInterface[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async() => {
      if (user && user.devices) {
        setDevices(user.devices);
      }

      setLoading(false);
    };

    fetchDevices();
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Devices
      </Typography>
      {devices.length === 0 ? (
        <Typography variant="body1">No devices found.</Typography>
      ) : (
        <Grid container spacing={4}>
          {devices.map((device, id) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
              <Card>
                <ButtonBase onClick={() => navigate(`/devices/${id}`)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/RaspberryPI.png"
                    alt={device.name}
                    sx={{
                      objectFit: "contain",
                      width: "100%",
                      height: "auto",
                      maxWidth: "200px",
                      maxHeight: "140px",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{device.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      A smart plant that you can control
                    </Typography>
                  </CardContent>
                </ButtonBase>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
