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
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleStopJob = (taskId : string) =>{
    fetch(`http://localhost:8000/api/jobs/tasks/${taskId}/`, {
      method: "DELETE",
    })
    .then((res =>{
      if(!res.ok) throw new Error("Erro ao parar o processo");
      return res.json();
    }))
    //.then(() => {
      // Atualiza a lista depois de parar
      //setJobs((prev) =>
        //prev.map((job) =>
          //job.task_id === taskId ? { ...job, status: "stopped" } : job
        //)
      //);
    //})
    .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetch("http://localhost:8000/api/jobs/")
      .then((res) => res.json())
      .then((data) =>{
        console.log("Resposta da API", data);
        if (Array.isArray(data.results)) {
            setJobs(data.results); 
        }
        else {
            console.error("Formato inesperado de resposta:", data);
        }
      })
      .catch(console.error);
  }, []);

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
                  {job.status === "PENDING" && (
                  <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => handleStopJob(job.task_id)}
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
