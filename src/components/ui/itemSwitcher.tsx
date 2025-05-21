"use client";

import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../../features/items/itemSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect, useState, useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";

const sources = {
  github: {
    name: "GitHub",
    value: "github",
    fetchUrl: "/api/github/dashboard",
  },
  jira: { name: "Jira", value: "jira", fetchUrl: "/api/jira/dashboard/" },
  // stackoverflow: {
  //   name: "Stack Overflow",
  //   value: "stackoverflow",
  //   fetchUrl: "/api/stackoverflow",
  // },
};

const ItemSwitcher = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const source = useSelector((state: RootState) => state.source.value);
  const item = useSelector((state: RootState) => state.item.value);
  const prevSourceRef = useRef<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState(""); // usado no select
  const [loading, setLoading] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedItem(value);
    dispatch(setItem(event.target.value));
  };

  const onClear = () => {
    dispatch(setItem(""));
  };

  const fetchSource = async (source: string) => {
    const url = apiUrl + sources[source].fetchUrl;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setItems([]);
        throw new Error(`Erro ao buscar dados de ${source}`);
      }
      setLoading(false);

      if (source === "github") {
        const repositories = data.repositories.map((repo: any) => repo);
        setItems(repositories);
        return;
      }

      if (source === "jira") {
        console.log("data é : ::::::::::::::")
        console.log(data)
        const projects = data.projects.map((project: string) => project);

        setItems(projects);
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    const prevSource = prevSourceRef.current;

    if (source) {
      setLoading(false);
    }
    if (prevSource !== null && prevSource !== source) {
      dispatch(setItem(""));
    }
    prevSourceRef.current = source;
    setSelectedItem("");
    fetchSource(source);
  }, [source]);

  if (loading) {
    return <div></div>;
  }

  return (
    <FormControl
      sx={{ width: "100%", height: "100%" }}
      disabled={items.length === 0}
    >
      <Select
        labelId="items-select-label"
        id="items-select"
        value={item}
        onChange={handleChange}
        displayEmpty
        autoWidth
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
        }}
      >
        <MenuItem value="" disabled sx={{ color: "#" }}>
          {source === "github"
            ? "Select repository"
            : source === "jira"
            ? "Select project"
            : "Select item"}
        </MenuItem>

        {source === "github" &&
          items.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              sx={{ width: "100%", bgcolor: "" }}
            >
              {item.repository}
            </MenuItem>
          ))}

        {source === "jira" &&
          items.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              sx={{ width: "100%", bgcolor: "" }}
            >
              {item.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default ItemSwitcher;
