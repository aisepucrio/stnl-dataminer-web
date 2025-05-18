"use client";

import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../../features/items/itemSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect, useState } from "react";

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
  const dispatch = useDispatch<AppDispatch>();


  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState(""); // usado no select
  const [loading, setLoading] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedItem(value);
    dispatch(setItem(event.target.value));
  };

  const fetchSource = async (source: string) => {
    const url = apiUrl + sources[source].fetchUrl;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${source}`);
      }
      setLoading(false);

      if (source === "github") {
        const repositories = data.repositories.map((repo: any) => repo);
        setItems(repositories);
        return;
      }

      if (source === "jira") {
        const projects = data.projects.map((project: string) => project);
        setItems(projects);
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchItem = async (value: any) => {
    let path = "";

    if (source == "github") {
      path = "/api/github/dashboard?repository_id=" + value;
    } else if (source == "jira") {
      path = "/api/jira/dashboard?project_name=" + value;
    } else {
      return;
    }

    try {
      const response = await fetch(apiUrl + path);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Dados recebidos:", data);

      const {
        repositories_count = 0,
        projects_count = 0,
        issues_count = 0,
        pull_requests_count = 0,
        commits_count = 0,
        comments_count = 0,
        forks_count = 0,
        stars_count = 0,
        sprints_count = 0,
      } = data;


      return;
    } catch (error) {
      console.error("Erro ao buscar items:", error);
      return null;
    }
  };

  useEffect(() => {
    if (source) {
      setLoading(false);
    }
    console.log("ola nundo");
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
        value={selectedItem}
        onChange={handleChange}
        displayEmpty
        autoWidth
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
              key={item}
              value={item}
              sx={{ width: "100%", bgcolor: "" }}
            >
              {item}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default ItemSwitcher;
