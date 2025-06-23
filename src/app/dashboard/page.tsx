"use client";
import ChartLine from "@/components/common/ChartLine";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import InfoCard from "@/components/common/InfoCard";
import Filter from "@/components/common/Filter";

// ---------------------------------------------------

const row = {
  display: "flex",
  flexDirection: "row",
};
const column = {
  display: "flex",
  flexDirection: "column",
};

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

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const source = useSelector((state: RootState) => state.source.value);
  const item = useSelector((state: RootState) => state.item.value);

  // date -----------------------------
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(formatDate(oneYearAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));
  // date -----------------------------

  const [startHash, setStartHash] = useState<string>("");
  const [endHash, setEndHash] = useState<string>("");

  const [startSprint, setStartSprint] = useState<string>("");
  const [endSprint, setEndSprint] = useState<string>("");

  const [loading, setLoading] = useState(true);

  const [qtyRepository, setQtyRepository] = useState<number | null>(0);
  const [qtyProject, setQtyProject] = useState<number | null>(0);
  const [qtyIssue, setQtyIssue] = useState<number | null>(0);
  const [qtyPullrequest, setQtyPullrequest] = useState<number | null>(0);
  const [qtyCommit, setQtyCommit] = useState<number | null>(0);
  const [qtyComment, setQtyComment] = useState<number | null>(0);
  const [qtyFork, setQtyFork] = useState<number | null>(0);
  const [qtyStar, setQtyStar] = useState<number | null>(0);
  const [qtySprint, setQtySprints] = useState<number | null>(0);

  const fetchSource = async (source: string) => {
    setLoading(false);
    let stringDateInitial = "";
    let stringDateFinal = "";

    if (startDate) {
      stringDateInitial = `start_date=${startDate}`;
    }

    if (endDate) {
      stringDateFinal = `end_date=${endDate}`;
    }

    const dateParams = [stringDateInitial, stringDateFinal]
      .filter(Boolean)
      .join("&");
    const url =
      apiUrl + sources[source].fetchUrl + (dateParams ? `?${dateParams}` : "");

    try {
      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados de ${source}`);
      }

      const {
        issues_count = qtyIssue,
        pull_requests_count = qtyPullrequest,
        commits_count = qtyCommit,
        repositories_count = qtyRepository,
        projects_count = qtyProject,
      } = data;

      if (source === "github") {
        setQtyIssue(issues_count);
        setQtyPullrequest(pull_requests_count);
        setQtyCommit(commits_count);
        setQtyRepository(repositories_count);

        return;
      }

      if (source === "jira") {
        setQtyIssue(issues_count);
        setQtyProject(projects_count);

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
      path = "/api/jira/dashboard?project_id=" + value;
    } else {
      return;
    }

    const stringDateInitial = startDate ? `start_date=${startDate}` : "";
    const stringDateFinal = endDate ? `end_date=${endDate}` : "";
    const dateParams = [stringDateInitial, stringDateFinal]
      .filter(Boolean)
      .join("&");

    if (dateParams) {
      path += `&${dateParams}`;
    }
    
    try {
      const response = await fetch(apiUrl + path);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }
      const data = await response.json();

      const {
        repositories_count = qtyRepository,
        projects_count = qtyProject,
        issues_count = qtyIssue,
        pull_requests_count = qtyPullrequest,
        commits_count = qtyCommit,
        comments_count = qtyComment,
        forks_count = qtyFork,
        stars_count = qtyStar,
        sprints_count = qtySprint,
      } = data;

      setQtyRepository(repositories_count);
      setQtyProject(projects_count);
      setQtyIssue(issues_count);
      setQtyPullrequest(pull_requests_count);
      setQtyCommit(commits_count);
      setQtyComment(comments_count);
      setQtyFork(forks_count);
      setQtyStar(stars_count);
      // time mined here
      setQtySprints(sprints_count);

      return;
    } catch (error) {
      console.error("Erro ao buscar items:", error);
      return null;
    }
  };


  useEffect(() => {
    if (item) {
      fetchItem(item);
    } else {
      fetchSource(source);
    }
  }, [item, startDate, endDate]);

  if (loading) {
    return <div></div>;
  }

  return (
    <Box
      sx={{
        ...row,
        width: "100%",
        height: "752px",
        bgcolor: "",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        py: 3,
      }}
    >


        <Box
          sx={{
            width: "72%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            bgcolor: "",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              bgcolor: "",
              ...column,
              justifyContent: "center",
            }}
          >
            {source == "github" ? (
              <>
                {item ? (
                  <Box sx={{ gap: "20px", ...row }}>
                    <InfoCard
                      label="Issues"
                      value={qtyIssue}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Pull Requests"
                      value={qtyPullrequest}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Comments"
                      value={qtyComment}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Users"
                      value={qtyComment}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Forks"
                      value={qtyFork}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Stars"
                      value={qtyStar}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                  </Box>
                ) : (
                  <Box sx={{ gap: "20px", ...row }}>
                    <InfoCard
                      label="Repositories"
                      value={qtyRepository}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Issues"
                      value={qtyIssue}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Pull Requests"
                      value={qtyPullrequest}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Commits"
                      value={qtyCommit}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Users"
                      value={qtyCommit}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                  </Box>
                )}
              </>
            ) : source == "jira" ? (
              <>
                {item ? (
                  <Box sx={{ gap: "20px", ...row }}>
                    <InfoCard
                      label="Issues"
                      value={qtyIssue}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Comments"
                      value={qtyComment}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Sprints"
                      value={qtySprint}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Users"
                      value={qtySprint}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                  </Box>
                ) : (
                  <Box sx={{ gap: "20px", ...row }}>
                    <InfoCard
                      label="Issues"
                      value={qtyIssue}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Projects"
                      value={qtyProject}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
                    <InfoCard
                      label="Users"
                      value={qtyProject}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                  </Box>
                )}
              </>
            ) : (
              <>"error"</>
            )}
          </Box>
          <Box flexGrow={1} sx={{ bgcolor: "#f7f9fb", borderRadius: "16px", height: "100%" }}>
            <ChartLine  startDate={startDate} endDate={endDate} />
          </Box>
        </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Centraliza horizontalmente
          alignItems: "center", // Mantém o alinhamento no topo (não altera a vertical)
          boxSizing: "border-box",
          height: "100%",
        }}
      >
        <Filter
          source={source}
          item={item}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startHash={startHash}
          setStartHash={setStartHash}
          endHash={endHash}
          setEndHash={setEndHash}
          startSprint={startSprint}
          setStartSprint={setStartSprint}
          endSprint={endSprint}
          setEndSprint={setEndSprint}
        />
      </Box>
    </Box>
  );
}
