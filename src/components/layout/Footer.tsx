"use client";

import Link from "next/link";
import { Box, Button } from "@mui/material";

const Footer = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 2,
        px: 2,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "transparent",
      }}
    >
      <Button
        component={Link}
        href={apiUrl}
        variant="outlined"
        sx={{
          border: "0.15rem solid #1C4886",
          color: "#1C4886",
          borderRadius: "16px",
          padding: "20px 24px",
          mr: 4,
          textTransform: "none",
          fontSize: "1.5rem",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "rgba(28, 72, 134, 0.04)",
            borderColor: "#1C4886",
          },
        }}
      >
        View API Docs
      </Button>
    </Box>
  );
};

export default Footer;
