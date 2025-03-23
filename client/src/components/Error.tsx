import { Box, Typography } from "@mui/material";

const SomethingWentWrong = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        gap: 2,
      }}
    >
      {/* Error Graphic */}
      <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#E53E3E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <Typography variant="h6" color="error">
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        An unexpected error occurred. Please try again.
      </Typography>
    </Box>
  );
};

export default SomethingWentWrong;
