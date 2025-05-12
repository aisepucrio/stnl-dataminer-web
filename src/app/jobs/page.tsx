"use client"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography , Paper, Button} from "@mui/material";
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [jobs, setJobs] = useState<Job[]>([]);

  const stopJob = async (taskId : string) =>{
    try{
      const response = await fetch(`http://localhost:8000/api/jobs/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchJobs(); // Atualiza após parar
      } else {
        console.error("Erro ao parar job:", await response.text());
      }
    }
    catch(error){
      console.error("Erro ao parar a task");
    }
  }

  const fetchJobs = async () => {
    try{
      const response = await fetch("http://localhost:8000/api/jobs/");
      const data = await response.json();
      setJobs(data.results);
    }
    catch (error){
      console.error("Erro ao buscar tasks: ", error);
    }
}

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(() =>{
      fetchJobs();
    }, 10000);
  })

  const headerCellStyle = {
    color: "#1C4886",
    fontWeight: "700",
    fontSize: "20px",
  }

  return  (
  <Box 
  sx={{
    minHeight:"90vh",
    width:"80vw",
    backgroundColor: "white",
    marginTop:"5vh",
    marginLeft:"2vw",
    marginRight:"2vw",
    borderRadius:"10px",
  }}>

    <Box p={3}>
    <Typography variant="h4" gutterBottom
    sx={{
        color: "#1C4886",
        fontWeight: "600"
    }}>
        Jobs
    </Typography>

    <TableContainer component={Paper}>
        <Table>
        <TableHead
        sx={{
          backgroundColor: "#1C488636",
          color: "#1C4886",
        }}>  
            <TableRow>
            <TableCell sx={headerCellStyle}>Job ID</TableCell>
            <TableCell sx={headerCellStyle}>Status</TableCell>
            <TableCell sx={headerCellStyle}>Description</TableCell>
            <TableCell></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {jobs.map((job) => (
            <TableRow key={job.task_id}>
                <TableCell>{job.task_id}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.operation}</TableCell>
                <TableCell>
                  {job.status === "STARTED" && (
                  <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => stopJob(job.task_id)}
                  >
                  Parar
                  </Button>
                  )}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    </Box>
</Box>
)}
export default Jobs;
