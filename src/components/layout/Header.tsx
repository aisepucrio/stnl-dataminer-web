"use client";
import { Box, Typography, Button, Breadcrumbs, Link, Tooltip, FormControl, Dialog, DialogContent, MenuItem, Select, DialogActions, SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ItemSwitcher from "../ui/itemSwitcher";
import ArticleIcon from '@mui/icons-material/Article';
import { useState } from "react";

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
  const isPreviewPage = pathname.includes("/preview");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');


  const breadcrumbs = pathSegments.length === 0
    ? ["Overview"]
    : pathSegments.map(formatSegment);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFormat('');
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setSelectedFormat(event.target.value as string);
  };

  const handleExport = () => {
    if (selectedFormat) {
      console.log(`Exportando no formato: ${selectedFormat}`);
      handleCloseDialog();
    }
  };

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
      
      {isPreviewPage &&
      <Box
          sx={{
            width: "13vw",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            
          }}
          >
          <Button
            onClick={handleOpenDialog} 
            variant="outlined"
            sx={{
              border: "0.15rem solid #1C4886",
              color: "#1C4886",
              borderRadius: "16px",
              marginLeft: "-8vw",
              padding: "10px 12px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(28, 72, 134, 0.04)",
                borderColor: "#1C4886",
              },
            }}>

            Export CSV / JSON
          </Button>
          <Dialog open={openDialog} 
      onClose={handleCloseDialog}
      PaperProps={{
        sx: {
          bgcolor: "#ffffff", 
          borderRadius: '16px', 
        },
      }}>        
        <DialogContent> 
          <FormControl fullWidth sx={{ minWidth: 400}}>
            <Select
              labelId="format-select-label"
              id="format-select"
              value={selectedFormat}
              onChange={handleFormatChange}
              sx={{
                color: 'black', 
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'black', 
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black', 
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black', 
                },
                '& .MuiSvgIcon-root': { 
                  color: '#63A4FF', 
                },
              }}
            >
              <MenuItem value="">
                <em>Select a format type</em>
              </MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#63A4FF' }}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            
            sx={{
                bgcolor: '#376BD2',
                color: 'white',
                marginRight: "10px",
                '&:hover': { bgcolor: '#173B6C' }
            }}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
          
          </Box>}

      <Box sx={{ width: "180px", ...row, height: "40px" }}>
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

      <Tooltip title="View API DOCS">
        <Button
          component={Link}
          href={apiUrl}
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            alignItems: "center",
            color: "white",
            mr: 1,
            "&:hover": {
              backgroundColor: "rgba(28, 72, 134, 0.04)",
            },
          }}
        >
          <ArticleIcon
          sx={{
            width: "27px",
            height: "27px"
          }}/>
        </Button>
        </Tooltip>


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
