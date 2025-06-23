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
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

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

type user={
  id: string, 
  name: string;
  email: string;  

}

// changing date format 
const formatDateToYYYYMMDD = (isoDate: string) => {
  if (!isoDate) return ''; 
  const [year, month, day] = isoDate.split('-');
  return `${year} / ${month} / ${day}`;
};

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true); 

  const [earliestDataDate, setEarliestDataDate] = useState<string>('');
  const [latestDataDate, setLatestDataDate] = useState<string>('');   


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
      setLoadingData(true);
      setError(null);
      try {
        let realSection = section;
        if (section === "comments") realSection = "issues";
        if (section === "users") realSection = "commits";

        const res = await fetch(`${apiUrl}/api/${tag}/${realSection}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Erro ao buscar dados");
        const json = await res.json();
        console.log(`Resposta da API para a seção ''${realSection}:`,json);

        let formattedData = [];
      if (json && Array.isArray(json.results)) {
        formattedData = json.results;
      } else if (Array.isArray(json)) {
        formattedData = json;
      }

        setData(Array.isArray(formattedData) ? formattedData : []);

        let minTimestamp = Infinity;
        let maxTimestamp = -Infinity;

        formattedData.forEach((item: any) => {
          
          const itemDateValue = item.date || item.created_at || item.created;
          if (itemDateValue) {
            const dateObj = new Date(itemDateValue);
            const timestamp = dateObj.getTime();
            if (!isNaN(timestamp)) { // Garante que é uma data válida
              minTimestamp = Math.min(minTimestamp, timestamp);
              maxTimestamp = Math.max(maxTimestamp, timestamp);
            }
          }
        });

        if (minTimestamp !== Infinity && maxTimestamp !== -Infinity) {
          const minDateObj = new Date(minTimestamp);
          const maxDateObj = new Date(maxTimestamp);

          
          setEarliestDataDate(minDateObj.toISOString().split('T')[0]);
          setLatestDataDate(maxDateObj.toISOString().split('T')[0]);
        }

        
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally{
        setLoadingData(false);
      }
    };

      fetchData();
  }, [apiUrl, tag, section]);

  const filteredDataByDate = (data || []).filter((item: any) => {
    const itemDateValue = item.date || item.created_at || item.created;
    const itemDate = new Date(itemDateValue).getTime();
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return itemDate >= start && itemDate <= end;
  });

  const processedData = (() => {
    if (section === "comments" && source === "github") {
      return filteredDataByDate.map((item: any) => ({
        id: item.id,
        title: item.title,
        comments: item.comments,
      }));
    }
  
    if (section === "users" && source === "github") {
      const allUsers = new Map<string, user>();

      filteredDataByDate.forEach((commit: github_commits) => {
        if (commit.author && commit.author.name) {
          const userId = commit.author.email || commit.author.name; 
          if (!allUsers.has(userId)) { 
            allUsers.set(userId, {
              id: userId,
              name: commit.author.name,
              email: commit.author.email,
            });
          }
        }
      });
      return Array.from(allUsers.values());
    }
  
    return filteredDataByDate;
  })();



  let columns;

  if (source === "github" && section === "commits") {
    columns = columns_github_commits;
  } else if (source === "github" && section === "issues") {
    columns = columns_github_issues;
  } else if(processedData.length > 0){
    columns = Object.keys(filteredDataByDate[0]).map((key) => ({
      accessorKey: key,
      header: key,
    }));
  }
  else{
    columns = [];
  }

  const noData = !filteredDataByDate || filteredDataByDate.length === 0;


  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      maxWidth: "90vw",
      overflowX: "auto",  
      height: "90vh",     
     }}>

        {loadingData ? ( // Verifica se está carregando
        <Typography sx={{ marginTop: 2, marginLeft: 2 }}>Carregando dados da tabela...</Typography>
      ) : error ? ( // Verifica se há um erro
        <Typography color="error" sx={{ marginTop: 2, marginLeft: 2 }}>
          Erro ao carregar dados: {error}
        </Typography>
      ) : filteredDataByDate.length === 0 ? ( // Verifica se não há dados processados
        <Typography sx={{ marginTop: 3, marginLeft: 2}}>
          {data && data.length === 0
            ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: "1px solid #F3550B", borderRadius: 5, padding: 2, paddingRight: 70}}> 
                <WarningAmberRoundedIcon/> 
                {`Could not find ${section} :(`} 
              </Box>
            )
            :
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: "1px solid #F3550B", borderRadius: 5, padding: 2, paddingRight: 70}}> 
                <WarningAmberRoundedIcon/> 
                {`Could not find ${section} between start and finish dates.`} 
            </Box>    
            }
        </Typography>
      ) : ( 
        <Box>
          <DataGrid
            rows={filteredDataByDate.map((row, index) => ({ id: row.id || index, ...row }))}
            columns={columns.map((col) => ({
              field: col.accessorKey, 
              headerName: col.header, 
              renderCell: (params: any) => {
                let valueToRender = params.value;              
                if (col.accessorKey) {
                    const keys = col.accessorKey.split(".");
                    let rawValue = params.row;
                    for (const key of keys) {
                        rawValue = rawValue?.[key];
                    }
                    valueToRender = typeof rawValue === "object" && rawValue !== null
                        ? JSON.stringify(rawValue)
                        : String(rawValue ?? "");
                }

                return (
                  <span title={valueToRender} style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    display: 'block'
                  }}>
                    {valueToRender}
                  </span>
                );
              },
            }))}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
            checkboxSelection
            
            sx={{
              width: "62vw",
              height: "83vh",
              marginTop: 3,
              marginLeft: 2,
              marginBottom: 2,
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
          
          
        </Box>
      )}

      

      <Box
      sx={{
        position: noData ? "absolute" : "static", 
        right: noData ? 0 : 'auto',            
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginLeft: 2,
        height: "83vh",
        marginTop: 3,
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
          color: "#1C1C1C",
          fontSize: "20px",
          fontWeight: 600
        }}
      >Filters</Typography>

      
      <Box sx={{ mb: 1, backgroundColor: "#F7F9FB", borderRadius: 5,padding: 2}}>
        <Typography
          sx={{
            mb: 1,
            color: "#1C1C1C",
            fontSize: "22px",
            paddingLeft: 1.2,
          }}
        >Start</Typography>
        <input
          type="date"
          value={startDateInput}
          onChange={(e) => setStartDateInput(e.target.value)}
          min={earliestDataDate || undefined} // Define a data mínima permitida
          max={latestDataDate || undefined}   // Define a data máxima permitida
          style={{
            width: "100%",
            height: "20px",
            fontSize: "20px",
            padding: "0 5px",
            borderRadius: 0,
            border: "none",
            backgroundColor: "#F7F9FB",
            fontWeight: "bold",
          }}
        />
      </Box>
      <Typography sx={{color: "#595957", mb: 3, ml: 1, fontSize: "15px"}}>
          Data starts from {formatDateToYYYYMMDD(earliestDataDate)}
        </Typography>

      <Box sx={{ mb: 1, backgroundColor: "#F7F9FB", borderRadius: 5,padding: 2}}>
        <Typography
          sx={{
            mb: 1,
            color: "#1C1C1C",
            fontSize: "22px",
            paddingLeft: 1.2,
          }}
        >
          Finish
        </Typography>
        <input
          type="date"
          value={endDateInput}
          onChange={(e) => setEndDateInput(e.target.value)}
          min={earliestDataDate || undefined} 
          max={latestDataDate || undefined}   
          style={{
            width: "100%",
            height: "40px",
            fontSize: "20px",
            padding: "0 10px",
            borderRadius: 0,
            border: "none",
            backgroundColor: "#F7F9FB",
            color: "#000000", 
            fontWeight: "bold",
          }}
        />
      </Box>
      <Typography sx={{color: "#595957", mb: 5, ml: 1, fontSize: "15px"}}>
          Data ends on {formatDateToYYYYMMDD(latestDataDate)}
        </Typography>

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
