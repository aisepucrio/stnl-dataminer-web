"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  Toolbar,
  Typography,
  List,
  Drawer,
  ListItemButton,
  ListItem,
  ListItemText,
} from "@mui/material";

const pages = [
  { name: "Dashboard", path: "/" },
  { name: "Preview", path: "/preview" },
  { name: "Collect", path: "/colect" },
  { name: "Jobs", path: "/jobs" },
];

const MainMenu = () => {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex" }}>
      
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          padding: 10,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",

          },
        }}
        >
        <Toolbar />
        
        <Box sx={{ overflow: "auto" }}>
          <List>
            {pages.map(({ name, path }) => {
                const isActive = pathname === path;

                return (
                  <Link href={path} key={name} passHref legacyBehavior>
                    <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      sx={{
                        borderRadius: 2,
                        margin: 1.5,
                        display: "block",
                        backgroundColor: isActive ? "#1C488638" : "transparent",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemText 
                      primary={name} 
                      primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: isActive ? "#1C4886" : "#BCBDBC",
                      }}
                      />
                    </ListItemButton>
                  </ListItem>
                  </Link>
                );
            })}

          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MainMenu;
