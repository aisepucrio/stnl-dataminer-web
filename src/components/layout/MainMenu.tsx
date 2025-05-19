"use client";

import React, {useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Box,
  List,
  Drawer,
  ListItemButton,
  ListItem,
  ListItemText,
  ListItemIcon, 
  IconButton,
  Icon,
  Button,
} from "@mui/material";
import SourceSwitcher from "../ui/SourceSwitcher";

// import icons 
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';


const pages = [
  { name: "Overview", path: "/", icon: <QueryStatsOutlinedIcon sx={{fontSize:22}}></QueryStatsOutlinedIcon>},
  { name: "Preview", path: "/preview", icon: <WorkOutlineOutlinedIcon sx={{fontSize:22}}></WorkOutlineOutlinedIcon>, children:[],},
  { name: "Collect", path: "/collect", icon: <FolderOutlinedIcon sx={{fontSize:22}}></FolderOutlinedIcon> },
  { name: "Jobs", path: "/jobs", icon: <ImportContactsOutlinedIcon sx={{fontSize:22}}></ImportContactsOutlinedIcon>},
];

// if preview, tenho que colocar mais um icone 


const MainMenu = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const pathname = usePathname();
  const searchParams = useSearchParams();



  const [selectedOption, setSelectedOption] = useState("GitHub");
  const [optionsOpen, setOptionsOpen] = useState(false);


  const getPreviewSubItems = () => {
    if(selectedOption === "GitHub"){
      return[
        {name: "Issue"}, 
        {name: "Pull Request"},
        {name: "Comment"}, 
        {name: "Commit"}, 
      ];
    } else if(selectedOption === "Jira"){
      return[
        {name: "Issue"}, 
        {name: "Users"},
        {name: "Comment"},
        {name: "Commit"},
        {name: "Pull Request"},
      ];
    }

  }

  const pagesItems = pages.map(item =>{ 
    if(item.name === "Preview"){
      return {
        ... item, children: getPreviewSubItems() 
      };
      return item;
    }

  });

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
        
        <Box sx={{position: "relative" }}> 
          <Button 
          variant="contained"
          onClick={() => setOptionsOpen(!optionsOpen)}
          sx={{
            backgroundColor: "#1C4886",
            color : "#FFFFFF",
            fontSize: 18,
            width: 150, 
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
            textAlign: "center",
            borderRadius: 3,
            padding: 1,
            marginTop: 5,
            marginLeft: 4,
          }}
          startIcon={ optionsOpen ? <ExpandMoreRoundedIcon/> : <ChevronRightOutlinedIcon/>}
          >
            {selectedOption}
          </Button>

          {optionsOpen && (
          <Box
            sx={{
              position: "absolute", 
              top: "100%", 
              left: 0, 
              width: 150, 
              boxShadow: 3, 
              borderRadius: 1, 
              zIndex: 10,
              marginLeft: 4,
              backgroundColor: "white"

            }}
            >
            {["GitHub", "Jira"].map((option) => (
              <Box
              key={option}
              onClick ={() => {
                setSelectedOption(option);
                setOptionsOpen(false);
              }}
              sx={{
                padding: .5,
                cursor: "pointer",
                border: "0.5px solid #1C1C1C33",
                textAlign: "center"
                                  
              }}
              >
                {option}
              </Box>
            ))}

          </Box>
          )}
          
        </Box>
          <SourceSwitcher/>
        <Box sx={{ overflow: "auto", flexGrow : 1}}>
          <List sx={{ marginTop: 10 }}>
            {pages.map(({ name, path, icon, children }) => {
                const isActive = pathname === path;
                if(name === "Preview"){
                  const subItems = getPreviewSubItems();

                  return(
                    <Link href={path} key={name} passHref legacyBehavior>  
                      <ListItem disablePadding sx={{
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Icon sx={{
                          paddingLeft: 1,
                        }}> 
                          <ChevronRightOutlinedIcon sx={{
                            fontSize: 24,
                          }}></ChevronRightOutlinedIcon>
                        </Icon>
                        <ListItemButton 
                        component="a"
                        sx={{
                          width: "80%",
                          borderRadius: 2,
                          marginTop: 1,
                          marginBottom: 1,
                          marginRight: 2,
                          display: "flex",
                          "&:hover": {
                            backgroundColor: "action.hover"
                          },
                        }}>
                        <ListItemIcon sx={{ fontSize: 24 }}>
                          {icon} </ListItemIcon>
                        <ListItemText 
                        primary={name} 
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: 20,
                          color: "#000000"
                        }}/>


                        </ListItemButton>
                      </ListItem>
                    </Link>
                  )
                }

                return (
                  <Link href={path} key={name} passHref legacyBehavior>
                    <ListItem disablePadding>
                      <ListItemButton
                        component="a"
                        sx={{
                          width: "80%",
                          borderRadius: 2,
                          margin: 1,
                          marginLeft: 3,
                          marginRight: 2,
                          display: "flex",
                          "&:hover": {
                            backgroundColor: "action.hover"
                          },
                        }}
                      >
                        <ListItemIcon sx={{ fontSize: 24 }}>
                           {icon} </ListItemIcon>
                        <ListItemText 
                        primary={name} 
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: 20,
                          color: "#000000"
                        }}/>
                      </ListItemButton>
                    </ListItem>
                  </Link>
                );
            })}

          </List>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center" }}
          >
          <Image
            src="/images/logo-raise.svg"
            alt="Logo"
            width={170}
            height={70}
            style={{ 
              objectFit: "contain", 
              marginTop: 15,
            }}
          />
          
        </Box>
        <Box 
        component="a"
        href={apiUrl}
        sx={{
          border: "3px solid #1C4886",
          fontSize: 18,
          fontWeight: 600,
          color: "#1C4886",
          borderRadius: 2,
          margin: 1.5,
          textAlign: "center", 
          paddingTop: "7px",
          paddingBottom: "7px", 
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
