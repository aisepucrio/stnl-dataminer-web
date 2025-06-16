"use client";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ItemSwitcher from "../ui/itemSwitcher";

const row = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const formatSegment = (segment: string) =>
  segment.charAt(0).toUpperCase() + segment.slice(1);

const Header = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.length === 0
    ? ["Overview"]
    : pathSegments.map(formatSegment);

  return (
    <Box
      sx={{
        height: "75px",
        borderBottom: "1px solid #d9e1e9",
        alignItems: "center",
        ...row,
        px: "28px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          height: "28px",
          width: "256px",
          alignItems: "center",
          ...row,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <Typography key={idx} sx={{ color: "#a0a2a4", fontSize: "16px" }}>
              {crumb}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>

      <Box sx={{ width: "100%", ...row, height: "40px" }}>
        <ItemSwitcher />
      </Box>

      <Box
        sx={{
          height: "28px",
          width: "180px",
          ...row,
          justifyContent: "flex-end",
        }}
      >
        <Image
          src="/icons/themeMode.svg"
          alt="Theme Mode"
          width={25}
          height={25}
        />
      </Box>
    </Box>
  );
};

export default Header;
