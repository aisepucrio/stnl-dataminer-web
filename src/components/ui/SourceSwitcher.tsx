"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSource } from "../../features/source/sourceSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";

// Select estilizado
const CustomSelect = styled((props: SelectProps<string>) => (
  <Select {...props} />
))(({ theme }) => ({
  backgroundColor: "#1C4886",
  borderRadius: "10px",
  color: "white",
  "& .MuiSelect-icon": {
    display: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1C4886",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1C4886",
  },
}));

// Setinha customizada que gira
const RotatingArrow = styled(ArrowForwardIosIcon, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  color: "white",
  fontSize: 16,
  marginRight: 8,
  transform: open ? "rotate(90deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
}));

const SourceSwitcher = () => {
  const source = useSelector((state: RootState) => state.source.value);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(
      setSource(
        event.target.value as "github" | "jira"
        // | "stackoverflow"
      )
    );
  };

  useEffect(() => {
    if (source) {
      setLoading(false);
    }
  }, [source]);

  if (loading) {
    return <div></div>;
  }

  return (
    <FormControl fullWidth variant="outlined" size="small">
      <CustomSelect
        labelId="source-select-label"
        value={source}
        onChange={handleChange}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        label="Fonte"
        renderValue={(selected) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RotatingArrow open={open} />
            <Typography sx={{ color: "white" }}>{selected}</Typography>
          </Box>
        )}
      >
        <MenuItem value="github">GitHub</MenuItem>
        <MenuItem value="jira">Jira</MenuItem>
        {/* <MenuItem value="stackoverflow">Stack Overflow</MenuItem> */}
      </CustomSelect>
    </FormControl>
  );
};

export default SourceSwitcher;
