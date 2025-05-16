"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Box,
  List,
  Drawer,
  ListItemButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import SourceSwitcher from "../ui/SourceSwitcher";

const pages = [
  { name: "Dashboard", path: "/" },
  { name: "Preview", path: "/preview" },
  { name: "Collect", path: "/colect" },
  { name: "Jobs", path: "/jobs" },
];

const MainMenu = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex" }}>
      
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            display: "flex", 
            justifyContent: "space-between", 
            flexDirection: "column"
          },
        }}
        >
        <Box
          sx={{ display: "flex", justifyContent: "center" }}
          >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={170}
            height={70}
            style={{ 
              objectFit: "contain", 
              marginTop: 15
               
            }}
          />
          
        </Box>
          <SourceSwitcher/>
        <Box sx={{ overflow: "auto", flexGrow : 1}}>
          <List
          sx={{
            marginTop: 10
          }}>
            {pages.map(({ name, path }) => {
                const isActive = pathname === path;

                return (
                  <Link href={path} key={name} passHref legacyBehavior>
                    <ListItem disablePadding>
                    <ListItemButton
                      component="a"
                      sx={{
                        borderRadius: 2,
                        marginLeft: 1.5,
                        marginRight: 1.5,
                        display: "block",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemText 
                      primary={name} 
                      primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: 28,
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
        <Box 
        component="a"
        href={apiUrl}
        sx={{
          border: "3px solid #1C4886",
          fontSize: 20,
          fontWeight: 600,
          color: "#1C4886",
          borderRadius: 2,
          margin: 1.5,
          textAlign: "center", 
          paddingTop: "10px",
          paddingBottom: "10px", 
          marginBottom: 5,
          textDecoration: "none"
        }}>
          View API Docs
        </Box>
      </Drawer>
    </Box>
  );
};

export default MainMenu;
