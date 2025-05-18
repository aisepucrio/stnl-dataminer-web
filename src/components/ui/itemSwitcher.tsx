"use client";

import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Box,
  Typography,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../../features/items/itemSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";

// const apiUrl = "https://sua-api.com/";
// const sources: Record<string, { fetchUrl: string }> = {
//   github: { fetchUrl: "github/data" },
//   jira: { fetchUrl: "jira/data" },
//   stackoverflow: { fetchUrl: "so/data" },
// };

// Select estilizado

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
  const dispatch = useDispatch<AppDispatch>();

  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState(""); // usado no select

  const [loading, setLoading] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    // window.alert(value);
    setSelectedItem(value);
    fetchItem(value);
    dispatch(setItem(event.target.value));
  };

  const fetchSource = async (source: string) => {
    const url = apiUrl + sources[source].fetchUrl;

    try {
      const response = await fetch(url);

      const data = await response.json();

      // console.log(data);

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${source}`);
      }

      setLoading(false);

      const {
        issues_count = 0,
        pull_requests_count = 0,
        commits_count = 0,
        repositories_count = 0,
        projects_count,
      } = data;

      if (source === "github") {
        const repositories = data.repositories.map((repo: any) => repo);
        // console.log(repositories);

        // setQtyIssue(issues_count);
        // setQtyPullrequest(pull_requests_count);
        // setQtyCommit(commits_count);
        // setQtyRepository(repositories_count);
        setItems(repositories);

        // setQtyComment(0);
        // setQtySprints(0);

        return;
      }

      if (source === "jira") {
        const projects = data.projects.map((project: string) => project);

        // setQtyIssue(issues_count);
        // setQtyComment();
        // setQtyProject(projects_count);

        // console.log("this is a projects");
        // console.log(projects);
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

      //   setQtyRepository(repositories_count);
      //   setQtyProject(projects_count);
      //   setQtyIssue(issues_count);
      //   setQtyPullrequest(pull_requests_count);
      //   setQtyCommit(commits_count);
      //   setQtyComment(comments_count);
      //   setQtyFork(forks_count);
      //   setQtyStar(stars_count);
      // time mined here
      //   setQtySprints(sprints_count);

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
      {/* <InputLabel id="items-select-label" sx={{ color: "#fff", height: "100%", bgcolor: "pink",  }}>
        Items
      </InputLabel> */}
      <Select
        labelId="items-select-label"
        id="items-select"
        value={selectedItem}
        onChange={(e) => {
          const value = e.target.value;
          // window.alert(value);
          setSelectedItem(value);
          fetchItem(value);
        }}
        autoWidth
        label="Items"
        sx={{
          //   width: "330px",
          height: "100%",
          boxSizing: "border-box",
          //   bgcolor: "white",
          bgcolor: "#1C4886",
          color: "#1C4886",
          borderRadius: "12px",
          // fontSize: "26px"
        }}
      >
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
