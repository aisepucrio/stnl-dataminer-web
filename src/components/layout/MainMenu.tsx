"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  List,
  Drawer,
  ListItemButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
  CircularProgress,
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
  const router = useRouter();
  const source = useSelector((state: RootState) => state.source.value);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Reset navigation state when pathname changes (page load complete)
  useEffect(() => {
    setIsNavigating(false);
    setNavigatingTo(null);
  }, [pathname]);

  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (isNavigating || path === pathname) {
      return; // Block if already navigating or same page
    }

    setIsNavigating(true);
    setNavigatingTo(path);
    router.push(path);
  };

  const getPreviewChildren = () => {
    switch (source) {
      case "github":
        return [
          { title: "Issue", to: "/preview/github/issues" },
          { title: "Pull Request", to: "/preview/github/pull-requests" },
          //{ title: "Comment", to: "/preview/github/comments" },
          { title: "Commit", to: "/preview/github/commits" },
          { title: "User", to: "/preview/github/users" },

        ];
      case "jira":
        return [
          { title: "User", to: "/preview/jira/users" },
          { title: "Issue", to: "/preview/jira/issues" },
          { title: "Comment", to: "/preview/jira/comments" },
          { title: "Sprints", to: "/preview/jira/sprints" },
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
                      onClick={(event) => {
                        if (isPreview) {
                          setPreviewOpen(!previewOpen);
                        } else {
                          handleNavigation(path, event);
                        }
                      }}
                      component={!isPreview ? "div" : "div"}
                      disabled={isNavigating && !isPreview}
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
                        opacity: (isNavigating && !isPreview) ? 0.6 : 1,
                        "&:hover": {
                          backgroundColor: (isNavigating && !isPreview) ? "transparent" : "#0000000D",
                        },
                      }}
                    >
                      {isPreview && (
                        <Icon sx={{fontSize: 20, marginBottom: .5, opacity: 0.6}}>
                          {previewOpen ? <ExpandMoreRoundedIcon /> : <ChevronRightOutlinedIcon />}
                        </Icon>
                      )}
                      <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: 'center' }}>
                        {isNavigating && navigatingTo === path && !isPreview ? (
                          <CircularProgress size={20} />
                        ) : typeof icon === 'string' ? (
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
                      {children.map((child) => {
                        const isChildActive = pathname === child.to;
                        const isChildNavigating = navigatingTo === child.to;
                        
                        return (
                          <ListItem disablePadding key={child.title}>
                            <ListItemButton
                              onClick={(event) => handleNavigation(child.to, event)}
                              disabled={isNavigating}
                              sx={{
                                width: "100%",
                                borderRadius: 2,
                                marginY: 0.5,
                                marginRight: 2,
                                pl: 2, 
                                backgroundColor: isChildActive? "#0000000D" : "transparent",
                                opacity: isNavigating ? 0.6 : 1,
                                "&:hover": {
                                  backgroundColor: isNavigating ? "transparent" : "#0000000D",
                                },                         
                              }}
                            >
                              {isChildNavigating && (
                                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                  <CircularProgress size={14} />
                                </Box>
                              )}
                              <ListItemText
                                primary={child.title}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  color: "#333",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
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
