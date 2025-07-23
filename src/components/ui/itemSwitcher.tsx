"use client";

import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectProps,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setItem, setItemName } from "../../features/items/itemSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect, useState, useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const sources = {
  github: {
    name: "GitHub",
    value: "github",
    fetchUrl: "/api/github/dashboard",
  },
  jira: { name: "Jira", value: "jira", fetchUrl: "/api/jira/dashboard" },
};

// Select estilizado
const CustomSelect = styled((props: SelectProps<string>) => (
  <Select {...props} />
))(() => ({
  backgroundColor: "#1C4886",
  borderRadius: "10px",
  color: "white",
  "& .MuiSelect-icon": {
    display: "none", // escondemos o ícone padrão
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1C4886",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1C4886",
  },
}));

// Setinha customizada
const RotatingArrow = styled(ArrowForwardIosIcon, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  color: "white",
  fontSize: 16,
  marginRight: 8,
  transform: open ? "rotate(90deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
}));

const ItemSwitcher = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [open, setOpen] = useState(false);

  const source = useSelector((state: RootState) => state.source.value);
  const item = useSelector((state: RootState) => state.item.value);
  const prevSourceRef = useRef<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // const handleChange = (event: SelectChangeEvent) => {
  //   const value = event.target.value;
  //   dispatch(setItem(value));
  // };
  const handleChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const selectedItemObj = items.find((i) => i.id === selectedId);

    if (!selectedItemObj) return;

    dispatch(setItem(selectedId));
    dispatch(
      setItemName(
        source === "github" ? selectedItemObj.repository : selectedItemObj.name
      )
    );
  };

  const onClear = () => {
    dispatch(setItem(""));
  };

  // console.log(JSON.stringify(items))

  const fetchSource = async (source: string) => {
    const url = apiUrl + sources[source].fetchUrl;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setItems([]);
        throw new Error(`Erro ao buscar dados de ${source}`);
      }

      if (source === "github") {
        setItems(data.repositories);
      } else if (source === "jira") {
        setItems(data.projects);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const prevSource = prevSourceRef.current;

    if (prevSource !== undefined && prevSource !== source) {
      if (source) {
        setLoading(false);
      }

      if (prevSource !== null) {
        dispatch(setItem(""));
      }

      fetchSource(source);
    }

    prevSourceRef.current = source;
  }, [source]);

  if (loading) {
    return <div></div>;
  }

  return (
    <FormControl
      sx={{ width: "100%", height: "100%", color: "white" }}
      disabled={items.length === 0}
    >
      <CustomSelect
        labelId="items-select-label"
        id="items-select"
        value={item}
        onChange={handleChange}
        displayEmpty
        autoWidth
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        endAdornment={
          item && (
            <IconButton size="small" onClick={onClear}>
              <ClearIcon
                sx={{ color: "white", fontSize: "17px", marginRight: "15px" }}
              />
            </IconButton>
          )
        }
        sx={{
          height: "100%",
          boxSizing: "border-box",
          bgcolor: "#1C4886",
          color: "#fff",
          borderRadius: "12px",
          width: "75%",
        }}
        renderValue={(selected) => {
          const selectedItemObj = items.find((i) => i.id === selected);
          const label = !selected
            ? source === "github"
              ? "All repositories (click to filter)"
              : source === "jira"
              ? "All projects (click to filter)"
              : "All items (click to filter)"
            : source === "github"
            ? selectedItemObj?.repository ?? selected
            : source === "jira"
            ? selectedItemObj?.name ?? selected
            : selected;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <RotatingArrow open={open} />
              <Typography sx={{ color: "white" }}>{label}</Typography>
            </Box>
          );
        }}
      >
        <MenuItem value="" disabled>
          {source === "github"
            ? "Select repository"
            : source === "jira"
            ? "Select project"
            : "Select item"}
        </MenuItem>

        {source === "github" &&
          items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.repository}
            </MenuItem>
          ))}

        {source === "jira" &&
          items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
      </CustomSelect>
    </FormControl>
  );
};

export default ItemSwitcher;
