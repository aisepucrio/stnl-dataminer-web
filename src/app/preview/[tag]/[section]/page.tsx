"use client";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/app/store";
import { DataGrid } from "@mui/x-data-grid";

type github_commits={
  id: string,
  author: {
    name: string,
    email: string,
  },
  committer: {
    name: string,
    email: string,
  },
  modified_files: [
    {
      filename: string,
      change_type: string,
      added_lines: string,
      deleted_lines: string,
      complexity: string,
      methods: [
        {
          name: string,
          complexity: string,
          max_nesting: string,
        }
      ]
    }
  ],
  repository: string,
  message: string,
  sha: string,
  insertions: string,
  deletions: string,
  files_changed: string,
  in_main_branch: string,
  merge: string,
  time_mined: string,
  date: string,
  dmm_unit_size: string,
  dmm_unit_complexity: string,
  dmm_unit_interfacing: string,
  }


type github_issues={
  id: string,
  number: string,
  repository: string,
  record_id: string,
  title: string,
  state: string,
  creator: string,
  assignees: string,
  labels: string,
  milestone: string,
  locked: string,
  body: string,
  comments: string,
  timeline_events: string,
  merged_at: string,
  commits: string,
  is_pull_request: true,
  author_association: string,
  reactions: string,
  data_type: string,
  time_mined: string, 
  created_at_formatted: string,
  updated_at_formatted: string,
  closed_at_formatted: string,
  merged_at_formatted: string,
  created_at: string,
  updated_at: string,
  closed_at: string,
}

type github_pullrequests = {
  id: string,
  created_at_formatted: string,
  updated_at_formatted: string,
  closed_at_formatted: string,
  merged_at_formatted: string,
  repository: string,
  record_id: string,
  number: string,
  title: string,
  state: string,
  creator: string,
  assignees: string,
  labels: string,
  milestone: string,
  locked: string,
  created_at: string,
  updated_at: string,
  closed_at: string,
  body: string,
  comments: string,
  timeline_events: string,
  merged_at: string,
  commits: string,
  is_pull_request: string,
  author_association: string,
  reactions: string,
  data_type: string,
  time_mined: string,
}



type jira_issues={ 
  count: string,
  next: string,
  previous: string,
  results: [
    {
      issue_id: string,
      issue_key: string,
      issuetype: string,
      project: string,
      priority: string,
      status: string,
      assignee: string,
      creator: string,
      created: string,
      updated: string,
      summary: string,
      description: string,
      history: string,
      activity_log: string,
      checklist: string,
      history_formatted: string,
      activity_log_formatted: string,
      checklist_formatted: string,
    }
  ]
  
}

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const tag = params.tag;
  const section = params.section;

  // choosing the order 
  const columns_github_commits = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "author.name", header: "Author Name" },
    { accessorKey: "author.email", header: "Author Email" },
    { accessorKey: "committer.name", header: "Committer Name" },
    { accessorKey: "committer.email", header: "Committer Email" },
    { accessorKey: "modified_files", header: "Modified Files" }, 
    { accessorKey: "repository", header: "Repository" },
    { accessorKey: "message", header: "Message" },
    { accessorKey: "insertions", header: "Insertions" },
    { accessorKey: "deletions", header: "Deletions" },
    { accessorKey: "sha", header: "SHA" },
    { accessorKey: "files_changed", header: "Files Changed" },
    { accessorKey: "in_main_branch", header: "In Main Branch" },
    { accessorKey: "merge", header: "Merge" },
    { accessorKey: "time_mined", header: "Time Mined" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "dmm_unit_size", header: "DMM Unit Size" },
    { accessorKey: "dmm_unit_complexity", header: "DMM Unit Complexity" },
    { accessorKey: "dmm_unit_interfacing", header: "DMM Unit Interfacing" },
  ]



  const columns_github_issues = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "number", header: "Number" },
  { accessorKey: "repository", header: "Repository" },
  { accessorKey: "record_id", header: "Record ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "state", header: "State" },
  { accessorKey: "creator", header: "Creator" },
  { accessorKey: "body", header: "Body" },
  { accessorKey: "assignees", header: "Assignees" },
  { accessorKey: "labels", header: "Labels" },
  { accessorKey: "milestone", header: "Milestone" },
  { accessorKey: "locked", header: "Locked" },
  { accessorKey: "comments", header: "Comments" },
  { accessorKey: "timeline_events", header: "Timeline Events" },
  { accessorKey: "merged_at", header: "Merged At" },
  { accessorKey: "commits", header: "Commits" },
  { accessorKey: "is_pull_request", header: "Is Pull Request" },
  { accessorKey: "author_association", header: "Author Association" },
  { accessorKey: "reactions", header: "Reactions" },
  { accessorKey: "data_type", header: "Data Type" },
  { accessorKey: "time_mined", header: "Time Mined" },
  { accessorKey: "created_at_formatted", header: "Created At (Formatted)" },
  { accessorKey: "updated_at_formatted", header: "Updated At (Formatted)" },
  { accessorKey: "closed_at_formatted", header: "Closed At (Formatted)" },
  { accessorKey: "merged_at_formatted", header: "Merged At (Formatted)" },
  { accessorKey: "created_at", header: "Created At" },
  { accessorKey: "updated_at", header: "Updated At" },
  { accessorKey: "closed_at", header: "Closed At" },
  ]

  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");

  const [startDate, setStartDate] = useState<string>(""); 
  const [endDate, setEndDate] = useState<string>("");
 
  const source = useSelector((state: RootState) => state.source.value);

  const handleApplyFilters = () => {
    setStartDate(startDateInput);
    setEndDate(endDateInput);
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const realSection = section === "comments" ? "issues" : section;

        const res = await fetch(`${apiUrl}/api/${tag}/${realSection}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Erro ao buscar dados");
        const json = await res.json();

        const formattedData = tag === "jira" && realSection === "issues" ? json.results : json;

        setData(formattedData);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      }
    };

    fetchData();
  }, [apiUrl, tag, section]);

  if (error) return <Typography color="error">Erro: {error}</Typography>;
  if (!data) return <Typography>Carregando...</Typography>;

  const filteredDataByDate = (data || []).filter((item: any) => {
    const itemDateValue = item.date || item.created_at || item.created;
    const itemDate = new Date(itemDateValue).getTime();
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return itemDate >= start && itemDate <= end;
  });

  const processedData = section === "comments" && source === "github" ? 
  filteredDataByDate.map((item: any) => ({
    id: item.id,
    title: item.title,
    comments: item.comments,
  }))
: filteredDataByDate;

if (processedData.length === 0) {
  if (data.length === 0) {
      return <Typography>Nenhum dado encontrado.</Typography>;
  }
  return <Typography>Nenhum dado encontrado com os filtros aplicados.</Typography>;
}

  let columns;

  if (source === "github" && section === "commits") {
    columns = columns_github_commits;
  } else if (source === "github" && section === "issues") {
    columns = columns_github_issues;
  } else {
    columns = Object.keys(filteredDataByDate[0]).map((key) => ({
      accessorKey: key,
      header: key,
    }));
  }

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      maxWidth: "90vw",         
      overflowX: "auto",       
    }}>
      <DataGrid
        rows={filteredDataByDate.map((row, index) => ({ id: index, ...row }))}
        columns={columns.map((col) => ({
          field: col.accessorKey,
          headerName: col.header,
          renderCell: (params: any) => {
            const keys = col.accessorKey.split(".");
            let value = params.row;
            for (const key of keys) {
              value = value?.[key];
            }
            return typeof value === "object" && value !== null
              ? JSON.stringify(value, null, 2)
              : String(value ?? "");
          },
        }))}
        pageSizeOptions={[10, 25, 50, 100]}
        pagination 
        checkboxSelection     
        sx={{
          width: "50vw",
          marginTop: 2,
          marginLeft: 2,
          marginBottom: 5,
          overflowX: "auto",
          tableLayout: "fixed",
          '& .MuiDataGrid-cell': {
            minWidth: "7vw",
          },
          '& .MuiDataGrid-columnHeader': {          
            minWidth: "7vw",
          },
        }}
      />
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginLeft: 2,
        height: "100vh",
        marginTop: 2,
        marginRight: 2,
        backgroundColor: "#E7F2FF",
        width: "18vw",
        borderRadius: 4,
        padding: 3,
        }}
      >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#1C4886",
          fontSize: "32px",
        }}
      >Filters</Typography>

      {/* Start */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: "#1C4886",
            fontSize: "22px",
          }}
        >Start</Typography>
        <input
          type="date"
          value={startDateInput}
          onChange={(e) => setStartDateInput(e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            fontSize: "20px",
            padding: "0 10px",
            border: "1px solid #A0AAB4",
            borderRadius: 0,
            backgroundColor: "#E7F2FF",
            color: "black"
          }}
        />
      </Box>

      {/* Finish */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: "#1C4886",
            fontSize: "22px",
          }}
        >
          Finish
        </Typography>
        <input
          type="date"
          value={endDateInput}
          onChange={(e) => setEndDateInput(e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            fontSize: "20px",
            padding: "0 10px",
            border: "1px solid #A0AAB4",
            borderRadius: 0,
            backgroundColor: "#E7F2FF",
            color: "#000000"
          }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleApplyFilters}
        sx={{
          bgcolor: "#1C4886",
          borderRadius: "16px",
          width: "100%",
          height: "70px",
          fontWeight: 700,
          color: "white",
          fontSize: "22px",
          textTransform: "none",
          ":hover": {
            backgroundColor: "#173B6C",
          },
        }}
      >
        Apply filters
      </Button>
    </Box>

    </Box>
  );
};

export default Preview;
