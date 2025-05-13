"use client";

import { Box, Typography, Skeleton } from "@mui/material";

type InfoCardProps = {
  label: string;
  value: number | null;
  isLoading?: boolean;
  color?: any;
};

const InfoCard = ({
  label,
  value,
  isLoading = false,
  color,
}: InfoCardProps) => {
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rectangular" height={"16vh"} sx={{ flex: 1 }} />
        </>
      ) : (
        <>
          <Box
            sx={{
              //   width: "100%",
              flex: 1,
              height: "16vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: color ? color : "white",
              boxSizing: "border-box",
              px: "0",
              py: "50px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h5" color="#1C4886">
              {label}
            </Typography>
            <br />
            <Typography variant="h4" color="#1C4886">
              {value}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default InfoCard;
