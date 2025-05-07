"use client"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography , Paper} from "@mui/material";
import { useEffect, useState } from "react";

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
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/jobs/")
      .then((res) => res.json())
      .then(setJobs)
      .catch(console.error);
  }, []);

  return  <Box p={3}>
  <Typography variant="h4" gutterBottom>
    Jobs
  </Typography>

  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Operation</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.task_id}>
            <TableCell>{job.task_id}</TableCell>
            <TableCell>{job.status}</TableCell>
            <TableCell>{job.operation}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
}
export default Jobs;
