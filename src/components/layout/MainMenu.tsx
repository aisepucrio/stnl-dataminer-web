"use client";

import React, { useState, useEffect } from "react";
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
  Icon,
} from "@mui/material";
import SourceSwitcher from "../ui/SourceSwitcher";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

// import icons 
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const MainMenu = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const pathname = usePathname();
  const source = useSelector((state: RootState) => state.source.value);

  const [previewOpen, setPreviewOpen] = useState(false);

  const getPreviewChildren = () => {
    switch (source) {
      case "github":
        return [
          { title: "Issue", to: "/preview/github/issues" },
          { title: "Pull Request", to: "/preview/github/pull-requests" },
          { title: "Comment", to: "/preview/github/comments" },
          { title: "Commit", to: "/preview/github/commits" },
        ];
      case "jira":
        return [
          { title: "Users", to: "/preview/jira/users" },
          { title: "Issue", to: "/preview/jira/issues" },
          { title: "Pull Request", to: "/preview/jira/pull-requests" },
          { title: "Comment", to: "/preview/jira/comments" },
          { title: "Commit", to: "/preview/jira/commits" },
        ];
      default:
        return null;
    }
  };

  const pages = [
    { name: "Overview", path: "/", icon: "icons/iconOverview.svg" },
    { name: "Collect", path: "/collect", icon: "icons/iconCollect.svg" },
    {
      name: "Preview",
      path: "/preview",
      icon: "icons/iconPreview.svg",
      children: getPreviewChildren(),
    },
    { name: "Jobs", path: "/jobs", icon: "icons/iconJobs.svg" },
  ];

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
            backgroundColor: "#C8DEFF7A",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          },
        }}
      >
        <Box 
        sx={{
          mt: 7,
          mx: 2,
        }}>
          <SourceSwitcher />
        </Box>
        <Box 
        sx={{
          opacity: 0.6,
          marginTop: 4,
          marginLeft: 3, 
          fontSize: 16,
        }}>
          Navigation
        </Box>

        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <List>
            {pages.map(({ name, path, icon, children }) => {
              const isActive = pathname === path;
              const isPreview = name === "Preview";

              return (
                <React.Fragment key={name}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (isPreview) {
                          setPreviewOpen(!previewOpen);
                        }
                      }}
                      component={!isPreview ? "a" : "div"}
                      href={!isPreview ? path : undefined}
                      sx={{
                        width: isPreview? "70%" : "90%",
                        borderRadius: 2,
                        margin: 0.5,
                        ml: 3,
                        mr: isPreview? 5 : 2,
                        display: "flex",
                        backgroundColor: isActive? "#0000000D" : "transparent",
                        paddingRight: isPreview? 25 : 20,
                        paddingLeft: isPreview? 0 : 2.5,
                        "&:hover": {
                          backgroundColor: "#0000000D",
                        },
                      }}
                    >
                      {isPreview && (
                        <Icon sx={{fontSize: 20, marginBottom: .5, opacity: 0.6}}>
                          {previewOpen ? <ExpandMoreRoundedIcon /> : <ChevronRightOutlinedIcon />}
                        </Icon>
                      )}
                      <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: 'center' }}>
                        {typeof icon === 'string' ? (
                          <Image
                            src={`/${icon}`} // caminho da imagem
                            alt={`${name} icon`}
                            width={20} 
                            height={20}
                            style={{
                              objectFit: "contain",
                              
                            }}
                          />
                          ) : ( icon )}
                      </ListItemIcon> 
                      <ListItemText
                        primary={name}
                        primaryTypographyProps={{
                          fontWeight: 400,
                          fontSize: 15,
                          color: "#000000",
                        }}
                      />
                      
                    </ListItemButton>
                  </ListItem>

                  {/* Renderiza os filhos do Preview */}
                  {isPreview && previewOpen && children && (
                    <Box sx={{ ml: 5 }}>
                      {children.map((child) => (
                        <Link href={child.to} key={child.title} passHref legacyBehavior>
                          <ListItem disablePadding>
                            <ListItemButton
                              component="a"
                              sx={{
                                width: "100%",
                                borderRadius: 2,
                                marginY: 0.5,
                                marginRight: 2,
                                pl: 2, 
                                backgroundColor: isActive? "#0000000D" : "transparent",
                                "&:hover": {
                                  backgroundColor: "#0000000D",
                                },                         
                              }}
                            >
                              <ListItemText
                                primary={child.title}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  color: "#333",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      ))}
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link href="/">
          <Image
            src="/images/logo-raise.svg"
            alt="Logo"
            width={170}
            height={70}
            style={{
              objectFit: "contain",
              marginTop: 15,
              marginBottom: 50,
              cursor: "pointer"
            }}
          />
          </Link>
        </Box> 
      </Drawer>
    </Box>
  );
};

export default MainMenu;
