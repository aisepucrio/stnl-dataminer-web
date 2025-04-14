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
const fakeDataGithub = {
  repositories: [
    "quiz-app",
    "task-manager",
    "weather-widget",
    "portfolio-website",
    "chat-app",
  ],
  issues: [
    {
      id: 101,
      title: "Bug: Quiz timer resets on page refresh",
      state: "open",
      repository: "quiz-app",
      created_at: "2024-03-31T12:00:00Z",
      user: { login: "user123", id: 501 },
    },
    {
      id: 102,
      title: "Feature request: Add dark mode",
      state: "open",
      repository: "task-manager",
      created_at: "2024-03-30T15:45:00Z",
      user: { login: "devMike", id: 502 },
    },
  ],
  pullRequests: [
    {
      id: 201,
      title: "Fix: Timer bug in quiz",
      state: "open",
      repository: "quiz-app",
      created_at: "2024-03-30T16:00:00Z",
      user: { login: "fixMaster", id: 601 },
      merged: false,
      html_url: "https://github.com/user123/quiz-app/pull/45",
    },
    {
      id: 202,
      title: "Feature: Implement task categories",
      state: "closed",
      repository: "task-manager",
      created_at: "2024-03-29T13:20:00Z",
      user: { login: "newFeatureDev", id: 602 },
      merged: true,
      html_url: "https://github.com/devMike/task-manager/pull/78",
    },
    {
      id: 203,
      title: "Enhancement: Improve chat UI",
      state: "open",
      repository: "chat-app",
      created_at: "2024-03-28T10:10:00Z",
      user: { login: "uiExpert", id: 603 },
      merged: false,
      html_url: "https://github.com/realTimeDev/chat-app/pull/12",
    },
  ],
  commits: [
    {
      sha: "a1b2c3d4e5",
      message: "Fix quiz timer issue",
      author: {
        login: "fixMaster",
        id: 601,
        avatar_url: "https://github.com/images/fixMaster.png",
        html_url: "https://github.com/fixMaster",
      },
      commit_url: "https://github.com/user123/quiz-app/commit/a1b2c3d4e5",
      date: "2024-03-30T17:20:00Z",
    },
    {
      sha: "f6g7h8i9j0",
      message: "Add dark mode feature",
      author: {
        login: "devMike",
        id: 502,
        avatar_url: "https://github.com/images/devMike.png",
        html_url: "https://github.com/devMike",
      },
      commit_url: "https://github.com/devMike/task-manager/commit/f6g7h8i9j0",
      date: "2024-03-29T14:10:00Z",
    },
  ],
};

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
  jira: { name: "Jira", value: "jira", fetchUrl: "/api/jira" },
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
    fetchItems(selectedSource);
  };

  const fetchItems = async (source: string) => {
    // window.alert("fazendo o fetch")
    setLoading(false);
    setItems(fakeDataGithub.repositories);
    const url = apiUrl + sources[source].fetchUrl;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${source}`);
      }

      const data = await response.json();

      const {
        issues_count = 0,
        pull_requests_count = 0,
        commits_count = 0,
        repositories_count = 0,
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
        const projects = data.projects.map((proj: any) => proj.project);
        setItems(projects)
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
    // <Box sx={{ ...row }}>
    //   <Box sx={{ ...column, ...red }}>
    //     <Box sx={{ ...row }}>
    //       select
    //       <Box>
    //         <FormControl sx={{ m: 1, minWidth: 120 }}>
    //           <InputLabel id="source-select-label">Source</InputLabel>
    //           <Select
    //             labelId="source-select-label"
    //             id="source-select"
    //             value={selectedSource}
    //             onChange={handleChange}
    //             autoWidth
    //             label="Source"
    //           >
    //             {Object.values(sources).map((source) => (
    //               <MenuItem key={source.value} value={source.value}>
    //                 {source.name}
    //               </MenuItem>
    //             ))}
    //           </Select>
    //         </FormControl>
    //       </Box>
    //       <Box>
    //         {" "}
    //         <FormControl
    //           sx={{ m: 1, minWidth: 120 }}
    //           disabled={items.length === 0}
    //         >
    //           <InputLabel id="items-select-label">Items</InputLabel>
    //           <Select
    //             labelId="items-select-label"
    //             id="items-select"
    //             value={selectedItem}
    //             onChange={(e) => setSelectedItem(e.target.value)}
    //             autoWidth
    //             label="Items"
    //           >
    //             {items.map((item) => (
    //               <MenuItem key={item} value={item}>
    //                 {item}
    //               </MenuItem>
    //             ))}
    //           </Select>
    //         </FormControl>{" "}
    //       </Box>
    //     </Box>
    //     <Box sx={{...row}}>
    //             <Box>{qtyRepository}</Box>
    //             <Box>{qtyIssue}</Box>
    //             <Box>{qtyPullrequest}</Box>
    //             <Box>{qtyCommit}</Box>
    //     </Box>
    //     <Box>chart</Box>
    //   </Box>
    //   <Box sx={{ ...row, ...blue }}> this is a filter</Box>
    // </Box>
    <Box>
      <Box sx={{ ...row }}>
        <Box sx={{flex:1}}>
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
        <Box sx={{flex:1}}>
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
      <Box>
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
                <InfoCard label="Issues" value={qtyIssue} isLoading={loading} />
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
                  label="Comments"
                  value={qtyComment}
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
      <Box></Box>
      {/* Se selectedSource == github renderiza <Box> A</Box>  */}
      {/* se selectedSource == jira renderiza <Box>B</Box> */}
      {/* {selectedSource === "github" ? (
        <Box>A</Box>
      ) : selectedSource === "jira" ? (
        <Box>B</Box>
      ) : selectedSource === "stackoverflow" ? (
        <Box>C</Box>
      ) : null} */}
    </Box>
  );
}
