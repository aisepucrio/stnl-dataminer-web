"use client";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { darken } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import IconButton from "@mui/material/IconButton";

const statusConfig: Record<string, { color: string; label: string }> = {
  STARTED: { color: "#8A8CD9", label: "Started" },
  PENDING: { color: "#FFC555", label: "Pending" },
  SUCCESS: { color: "#A1E3CB", label: "Success" },
  FAILURE: { color: "#FF5555", label: "Failure" },
  REVOKED: { color: "#A3A3A3", label: "Revoked" },
  PROGRESS: { color: "#D3E3A1", label: "In Progress" },
};

type Job = {
  task_id: string;
  operation: string;
  repository: string;
  created_at: string;
  created_at_formatted: string;
  status: string;
  error: string;
};

const Jobs = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const stopJob = async (taskId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/jobs/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) fetchJobs();
    } catch {
      console.error("Erro ao parar a task");
    }
  };

  const fetchJobs = async () => {
    try {
      const resp = await fetch(`${apiUrl}/api/jobs/`);
      const data = await resp.json();
      setJobs(data.results);
    } catch (err) {
      console.error("Erro ao buscar tasks:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const headerCellStyle = {
    color: "#9e9e9e",
    fontWeight: 500,
    fontSize: "1rem",
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const [rev, setRev] = useState(false);
  const orderedJobs = rev ? [...jobs].reverse() : jobs;

  return (
    <Box
      sx={{
        minHeight: "90vh",
        width: "95%",
        backgroundColor: "white",
        m: "5vh 2vw 0",
        borderRadius: "10px",
      }}
    >
      <Box p={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#1C4886", fontWeight: 600, mb: 4 }}
          >
            Jobs
          </Typography>

          <Box>
            <IconButton onClick={() => setRev(!rev)} sx={{ color: "#1C4886" }}>
              <SwapVertIcon
                sx={{ color: "#1C4886", fontSize: 40, cursor: "pointer" }}
              />
            </IconButton>

            <IconButton onClick={fetchJobs} sx={{ color: "#1C4886" }}>
              <RefreshOutlinedIcon
                sx={{ color: "#1C4886", fontSize: 38, cursor: "pointer" }}
              />
            </IconButton>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>Job ID</TableCell>
                <TableCell sx={headerCellStyle}>Project</TableCell>
                <TableCell sx={headerCellStyle}>Description</TableCell>
                <TableCell sx={headerCellStyle}>Date</TableCell>
                <TableCell sx={headerCellStyle}>Status</TableCell>
                <TableCell sx={headerCellStyle}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orderedJobs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job) => (
                  <TableRow key={job.task_id}>
                    <TableCell sx={{ fontSize: "1rem" }}>
                      {job.task_id}
                    </TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>
                      {job.repository}
                    </TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>
                      {job.operation
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </TableCell>

                    <TableCell sx={{ fontSize: "1rem" }}>
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                        {new Date(job.created_at_formatted).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor:
                              statusConfig[job.status]?.color ?? "#000",
                            mr: 1,
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: darken(
                              statusConfig[job.status]?.color ?? "#000",
                              0.2
                            ),
                          }}
                        >
                          {statusConfig[job.status]?.label ?? job.status}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ width: "10%" }}>
                      {job.status === "STARTED" && (
                        <StopCircleOutlinedIcon
                          onClick={() => stopJob(job.task_id)}
                          sx={{ cursor: "pointer" }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  count={jobs.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  labelRowsPerPage="Linhas por página"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                  colSpan={10}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Jobs;
