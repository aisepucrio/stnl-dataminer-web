"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Box,
  Toolbar,
  Typography,
  List,
  Drawer,
  ListItemButton,
  ListItem,
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
                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    sx={{
                      backgroundColor: isActive ? "#1C488638" : "transparent",
                      borderRadius: 2,
                      margin:1.5,
                    }}
                  >
                    <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: isActive ? "#1C4886" : "#BCBDBC",
                    }}
                    >
                    {name}
                  </Typography>  
          
                </ListItemButton>
                </ListItem>
                
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MainMenu;
