"use client";
import Image from "next/image";
import styles from "./page.module.css";
// MUI
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import InfoCard from "@/components/common/InfoCard";

// ---------------------------------------------------
//  fake response - REMOVER
// const response = null

const fakeDataJira = {
  projects: ["stone", "flopo", "apiMiner"],
};

// ---------------------------------------------------

const row = {
  display: "flex",
  flexDirection: "row",
};
const column = {
  display: "flex",
  flexDirection: "column",
};

const blue = { bgcolor: "blue" };
const red = { bgcolor: "red" };

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

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);

  const [selectedSource, setSelectedSource] = useState("github");
  const [items, setItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [repository, setRepository] = useState("");
  const [project, setProject] = useState("");

  const [qtyRepository, setQtyRepository] = useState<number | null>(0);
  const [qtyProject, setQtyProject] = useState<number | null>(0);
  const [qtyIssue, setQtyIssue] = useState<number | null>(0);
  const [qtyPullrequest, setQtyPullrequest] = useState<number | null>(0);
  const [qtyCommit, setQtyCommit] = useState<number | null>(0);
  const [qtyComment, setQtyComment] = useState<number | null>(0);
  const [qtyFork, setQtyFork] = useState<number | null>(0);
  const [qtyStar, setStar] = useState<number | null>(0);

  const [qtySprint, setQtySprints] = useState<number | null>(0);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedSource(event.target.value as string);
    // fetchItems(selectedSource);
  };

  const fetchItems = async (source: string) => {
    setLoading(false);
    const url = apiUrl + sources[source].fetchUrl;

    try {
      const response = await fetch(url);

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${source}`);
      }

      const {
        issues_count = 0,
        pull_requests_count = 0,
        commits_count = 0,
        repositories_count = 0,
        projects_count,
      } = data;

      if (selectedSource === "github") {
        const repositories = data.repositories.map(
          (repo: any) => repo.repository
        );

        setQtyIssue(issues_count);
        setQtyPullrequest(pull_requests_count);
        setQtyCommit(commits_count);
        setQtyRepository(repositories_count);
        setItems(repositories);

        setQtyComment(0);
        setQtySprints(0);

        return;
      }

      if (selectedSource === "jira") {  
        // console.log(data)
        const projects = data.projects.map((project: string) => project);

        setQtyIssue(issues_count);
        // setQtyComment();
        setQtyProject(projects_count)



        console.log("this is a projects")
        console.log(projects)
        setItems(projects);
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    setSelectedItem("");
    setRepository("");
    setProject("");
    fetchItems(selectedSource);
  }, [selectedSource]);

  return (
    <Box sx={{ width: "100%", ...row }}>
      <Box>
        <Box sx={{ ...row, bgcolor: "orange", width: "60vw" }}>
          <Box sx={{ flex: 1 }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="source-select-label">Source</InputLabel>
              <Select
                labelId="source-select-label"
                id="source-select"
                value={selectedSource}
                onChange={handleChange}
                autoWidth
                label="Source"
              >
                {Object.values(sources).map((source) => (
                  <MenuItem key={source.value} value={source.value}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              disabled={items.length === 0}
            >
              <InputLabel id="items-select-label">Items</InputLabel>
              <Select
                labelId="items-select-label"
                id="items-select"
                value={selectedItem}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedItem(value);
                  if (selectedSource === "github") {
                    setRepository(value);
                  } else if (selectedSource === "jira") {
                    setProject(value);
                  }
                }}
                autoWidth
                label="Items"
              >
                {items.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button> view api docs</button>
          </Box>
        </Box>
        <Box sx={{ bgcolor: "red" }}>
          {selectedSource == "github" ? (
            <>
              "github"
              {selectedItem ? (
                <>
                  {" "}
                  Issues: {`${qtyIssue}`}
                  <br />
                  Pull Requests {`${qtyPullrequest}`}
                  <br />
                  Comments: {`${qtyComment}`}
                  <br />
                  forks: {`${qtyFork}`} <br />
                  Stars: {`${qtyStar}`}
                </>
              ) : (
                <Box sx={{ gap: "20px", ...row }}>
                  <InfoCard
                    label="Repositories"
                    value={qtyRepository}
                    isLoading={loading}
                  />
                  <InfoCard
                    label="Issues"
                    value={qtyIssue}
                    isLoading={loading}
                  />
                  <InfoCard
                    label="Pull Requests"
                    value={qtyPullrequest}
                    isLoading={loading}
                  />
                  <InfoCard label="Commits" value={0} isLoading={loading} />
                  {/* Repositories: {`${qtyRepository}`} <br />
                Issues: {`${qtyIssue}`}
                <br />
                Pull Requests {`${qtyPullrequest}`}
                <br />
                Commits {`${qtyCommit}`}
                <br /> */}
                </Box>
              )}
            </>
          ) : selectedSource == "jira" ? (
            <>
              "jira"
              {selectedItem ? (
                <Box sx={{ gap: "20px", ...row }}>
                  <InfoCard
                    label="Issues"
                    value={qtyIssue}
                    isLoading={loading}
                    color={"blue"}
                  />
                  <InfoCard
                    label="Comments"
                    value={qtyComment}
                    isLoading={loading}
                    color={"blue"}
                  />
                  <InfoCard
                    label="Sprints"
                    value={qtySprint}
                    isLoading={loading}
                    color={"blue"}
                  />

                  {/* Issues: {`${qtyIssue}`}
                <br />
                Comments: {`${qtyComment}`}
                <br />
                Sprints: {`${qtySprint}`}
                <br /> */}
                </Box>
              ) : (
                <Box sx={{ gap: "20px", ...row }}>
                  <InfoCard
                    label="Issues"
                    value={qtyIssue}
                    isLoading={loading}
                  />
                  <InfoCard
                    label="Projects"
                    value={qtyProject}
                    isLoading={loading}
                  />
                  {/* Issues: {`${qtyIssue}`}
                <br />
                Comments: {`${qtyComment}`}
                <br /> */}
                </Box>
              )}
            </>
          ) : (
            <>"error"</>
          )}
        </Box>
      </Box>

      <Box sx={{ bgcolor: "yellow", width: "40vw" }}>
        
        {/*  Colocar o filtro aqui*/}
        
        </Box>
    </Box>
  );
}
