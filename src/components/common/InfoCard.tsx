"use client";

import { Box, Typography, Skeleton } from "@mui/material";

type InfoCardProps = {
  label: string;
  value: number | null;
  isLoading?: boolean;
};

const InfoCard = ({ label, value, isLoading = false }: InfoCardProps) => {
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="rectangular" height={"16vh"} sx={{flex:1}}/>
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
              bgcolor: "pink",
              boxSizing: "border-box",
              px: "0",
              py: "50px",
            }}
          >
            <Typography variant="h4" color="text.secondary">
              {label}
            </Typography>

            <Typography variant="h2" color="text.primary">
              {value}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default InfoCard;
