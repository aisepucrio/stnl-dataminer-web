"use client";

import React from 'react';
import Link from "next/link";
import { 
  Box, 
  Button,
  Dialog,
  DialogTitle,    
  DialogContent,  
  DialogActions,  
  FormControl,    
  InputLabel,    
  Select,        
  MenuItem,       
  SelectChangeEvent, 
} from "@mui/material";
import { useEffect, useState } from "react";


const Footer = () => {
  const [openDialog, setOpenDialog] = useState(false); // Estado para abrir/fechar o dialog
  const [selectedFormat, setSelectedFormat] = useState<string>(''); // Estado para o formato selecionado

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

  return(
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 4,
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
          marginLeft: "44.5vw",
          padding: "16px 20px",
          mr: 4,
          textTransform: "none",
          fontSize: "1.5rem",
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
          bgcolor: "#21211F", 
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
                color: 'white', 
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'white', 
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', 
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', 
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



    </Box>

  );
};

export default Footer;
