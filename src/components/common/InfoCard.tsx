"use client";

import { Box, Typography, Skeleton, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type InfoCardProps = {
  label: string;
  value: number | null;
  isLoading?: boolean;
  color?: any;
  tooltip?: string;
};

const InfoCard = ({
  label,
  value,
  isLoading = false,
  color,
  tooltip = "",
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
              height: "112px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: color ? color : "white",
              boxSizing: "border-box",
              // px: 0,
              padding: "24px",
              borderRadius: "16px",
              gap: "8px",
              position: "relative",
            }}
          >
            {tooltip && (
              <Tooltip 
                title={tooltip} 
                placement="bottom"
                slotProps={{
                  tooltip: {
                    sx: {
                      fontSize: '14px',
                      maxWidth: '300px',
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    padding: "4px",
                  }}
                >
                  <InfoOutlinedIcon fontSize="medium" color="action" />
                </IconButton>
              </Tooltip>
            )}
            <Box sx={{ bgcolor: "", width: "100%" }}>
              <Typography
                sx={{ fontSize: "16px", bgcolor: "", fontWeight: 600 }}
                // color="#1C4886"
              >
                {label}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: "", width: "100%" }}>
              <Typography
                sx={{ fontSize: "24px", bgcolor: "", fontWeight: 600 }}
                // color="#1C4886"
              >
                {value}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default InfoCard;
