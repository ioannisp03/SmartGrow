import {
    Container,
    Typography,
    Box,
} from "@mui/material";

const LoginPage: React.FC = () => {
    return (
        <Box
            sx={{
                bgcolor: "grey.900",
                color: "white",
                py: 4,
                textAlign: "center",
                mt: 6,
            }}
        >
            <Container>
                <Typography variant="body1" gutterBottom>
                    © {new Date().getFullYear()} SmartGrow. All rights reserved.
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
                <Typography sx={{ color: "white" }}>Built with love and technology.</Typography>
            </Container>
        </Box>
    );
};

export default LoginPage;
