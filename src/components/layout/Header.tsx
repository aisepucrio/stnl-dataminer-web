"use client";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ItemSwitcher from "../ui/itemSwitcher";

const row = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const formatPathName = (path: string) => {
  const last = path.split("/").filter(Boolean).pop();
  if (!last) return "Dashboard";
  return last.charAt(0).toUpperCase() + last.slice(1);
};

const Header = () => {
  const pathname = usePathname();
  const pageTitle = formatPathName(pathname);

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
          bgcolor: "",
          alignItems: "center",
          ...row,
        }}
      >
        <Box
          sx={{
            ...row,
            gap: "8px",
            width: "64px",
            alignItems: "center",
            bgcolor: "",
          }}
        >
          <Image
            src="/icons/sidebar.svg"
            alt="Sidebar"
            width={20}
            height={20}
          />
          <Image src="/icons/star.svg" alt="Star" width={20} height={20} />
        </Box>
        <Box sx={{ ...row, width: "184px", px: "8px" }}>
          <Typography
            sx={{ color: "#a0a2a4", fontSize: "16px" }}
            fontWeight={400}
          >
            {pageTitle}
          </Typography>
          <Typography>/</Typography>
          <Typography>Default</Typography>
        </Box>
      </Box>

      <Box sx={{ width: "180px", bgcolor: "", ...row, height: "40px" }}>
        {/* sdf */}
        <ItemSwitcher />
      </Box>
      <Box
        sx={{
          height: "28px",
          width: "180px",
          bgcolor: "",
          ...row,

          justifyContent: "flex-end",
        }}
      >
        <Image
          src="/icons/themeMode.svg"
          alt="Sidebar"
          width={25}
          height={25}
        />
      </Box>
    </Box>
  );
};

export default Header;
