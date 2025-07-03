"use client";
import ChartLine from "@/components/common/ChartLine";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import { Box, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import InfoCard from "@/components/common/InfoCard";
import Filter from "@/components/common/Filter";

// ---------------------------------------------------

const formatTimeMined = (dateString: string | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch (error) {
    return dateString;
  }
};

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

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [startHash, setStartHash] = useState<string>("");
  const [endHash, setEndHash] = useState<string>("");

  const [startSprint, setStartSprint] = useState<string>("");
  const [endSprint, setEndSprint] = useState<string>("");


  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [qtyRepository, setQtyRepository] = useState<number | null>(0);
  const [qtyProject, setQtyProject] = useState<number | null>(0);
  const [qtyIssue, setQtyIssue] = useState<number | null>(0);
  const [qtyPullrequest, setQtyPullrequest] = useState<number | null>(0);
  const [qtyCommit, setQtyCommit] = useState<number | null>(0);
  const [qtyComment, setQtyComment] = useState<number | null>(0);
  const [qtyFork, setQtyFork] = useState<number | null>(0);
  const [qtyStar, setQtyStar] = useState<number | null>(0);
  const [qtySprint, setQtySprints] = useState<number | null>(0);
  const [qtyUsers, setQtyUsers] = useState<number | null>(0);
  const [timeMined, setTimeMined] = useState<string | null>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);

      let path = "";

      // Build the API path based on whether we have an item selected
      if (item) {
        if (source === "github") {
          path = `/api/github/dashboard?repository_id=${item}`;
        } else if (source === "jira") {
          path = `/api/jira/dashboard?project_id=${item}`;
        } else {
          return;
        }
      } else {
        path = sources[source].fetchUrl;
      }

      // Build date parameters
      const stringDateInitial = startDate ? `start_date=${startDate}` : "";
      const stringDateFinal = endDate ? `end_date=${endDate}` : "";
      const dateParams = [stringDateInitial, stringDateFinal]
        .filter(Boolean)
        .join("&");

      // Append date parameters to the URL
      if (dateParams) {
        path += (path.includes("?") ? "&" : "?") + dateParams;
      }

      const url = apiUrl + path;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status}`);
        }

        const data = await response.json();

        // Create a mapping of API fields to state setters
        const stateUpdaters = {
          repositories_count: setQtyRepository,
          projects_count: setQtyProject,
          issues_count: setQtyIssue,
          pull_requests_count: setQtyPullrequest,
          commits_count: setQtyCommit,
          comments_count: setQtyComment,
          forks_count: setQtyFork,
          stars_count: setQtyStar,
          sprints_count: setQtySprints,
          users_count: setQtyUsers,
          time_mined: setTimeMined,
        };

        // Update all states in one loop
        Object.entries(stateUpdaters).forEach(([key, setter]) => {
          if (data[key] !== undefined) {
            setter(data[key]);
          }
        });

        // Show snackbar if fetch was triggered by date change
        if (startDate || endDate) {
          setShowSnackbar(true);
        }

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [item, startDate, endDate, source, apiUrl]);


  if (loading) {
    return <div></div>;
  }

  return (
    <>
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
                      label="Commits"
                      value={qtyCommit}
                      isLoading={loading}
                      color={"#e6ecf5"}
                    />
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
                      label="Users"
                      value={qtyUsers}
                      isLoading={loading}
                      color={"#e2edfe"}
                    />
                    <InfoCard
                      label="Forks"
                      value={qtyFork}
                      isLoading={loading}
                      color={"#e6ecf5"}
                      tooltip={`Number of times this repository has been forked by other users, at the time of mining (${formatTimeMined(
                        timeMined
                      )})`}
                    />
                    <InfoCard
                      label="Stars"
                      value={qtyStar}
                      isLoading={loading}
                      color={"#e2edfe"}
                      tooltip={`Number of users who have starred this repository, at the time of mining (${formatTimeMined(
                        timeMined
                      )})`}
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
                      value={qtyUsers}
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
                      value={qtyUsers}
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
                      value={qtyUsers}
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
          <Box
            flexGrow={1}
            sx={{ bgcolor: "#f7f9fb", borderRadius: "16px", height: "100%" }}
          >
            <ChartLine startDate={startDate} endDate={endDate} />
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
      <Snackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Table filtered using new date range!
        </Alert>
      </Snackbar>
    </>
  );
}
