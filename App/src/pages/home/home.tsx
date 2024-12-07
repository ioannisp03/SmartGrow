import { Typography, Button, Container, Box, Grid, Paper } from "@mui/material";

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            Welcome to SmartGrow
          </Typography>
          <Typography variant="h5" gutterBottom>
            Control and monitor your smart device effortlessly.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 4 }}
            href="/devices"
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Features
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ mb: 6, color: "text.secondary" }}
        >
          <Typography sx={{ color: "#00AF3A" }}>
            Explore the amazing capabilities of SmartGrow.
          </Typography>
        </Typography>
        <Grid container spacing={4} mb="10px">
          {[
            {
              title: "Monitor Device",
              description:
                "Real-time monitoring of your connected device with ease.",
            },
            {
              title: "Take Control of Tasks",
              description: "Seamlessly customize and control your devices to match your lifestyle.",
            },
            {
              title: "Energy Efficiency",
              description: "Optimize energy consumption for a greener planet.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
