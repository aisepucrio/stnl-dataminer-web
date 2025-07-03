import {
  Box,
  MenuItem,
  Select,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

interface FilterProps {
  source: string;
  item: string;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;

  startHash: string;
  setStartHash: (value: string) => void;

  endHash: string;
  setEndHash: (value: string) => void;

  startSprint: string;
  setStartSprint: (value: string) => void;

  endSprint: string;
  setEndSprint: (value: string) => void;
}

const filter = {
  bgcolor: "#e8f2fe",
  width: "20vw",
  height: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  px: "27px",
  pt: "15px",
};

const color = "#1C1C1C";

const title = { color, fontSize: "32px" };

const label = { color, fontSize: "22px"};

const input = {
  height: "45px",
  width: "90%",
  fontSize: "20px",
  backgroundColor: "#F7F9FB",
  fontWeight: "bold",
  border: "none",
  marginLeft: 2

};

const button = {
  bgcolor: "#1c4886",
  borderRadius: "12px",
  width: "100%",
  height: "76px",
  fontWeight: 700,
  color: "white",
  fontSize: "20px",
  textTransform: "none",
};

const Filter = ({
  source,
  item,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  startHash,
  setStartHash,
  endHash,
  setEndHash,
  startSprint,
  setStartSprint,
  endSprint,
  setEndSprint,
}: FilterProps) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  // const [startHash, setStartHash] = useState<string>("");
  // const [endHash, setEndHash] = useState<string>("");

  // const [startSprint, setStartSprint] = useState<string>("");
  // const [endSprint, setEndSprint] = useState<string>("");

  const handleApply = () => {
    setStartDate(localStartDate);
    setEndDate(localEndDate);
  };

  const isDateChanged = localStartDate !== startDate || localEndDate !== endDate;

  const buttonStyle = {
    ...button,
    bgcolor: isDateChanged ? '#1c4886' : '#bdbdbd',
    cursor: isDateChanged ? 'pointer' : 'not-allowed',
    transition: 'background 0.2s',
  };

  return (
    <Box sx={filter}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography sx={title}>Filters</Typography>

        <Box
          sx={{
            backgroundColor: "#F7F9FB",
            borderRadius: 5,
            padding: 2,
            
          }}
        >
          <Typography sx={label}>Start</Typography>
          <input
            type="date"
            style={{
              ...input,
              marginLeft: "6.5%",
              
            }}
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
          />

          {/* ... seus outros TextField para hash/tag e sprint ... */}
          {source === "github" && item && (
            <TextField
              sx={{
                ...input,
                width: "100%",
                '& .MuiInputBase-root': {
                    height: "45px",
                    
                    '&::before': { borderBottom: 'none !important' },
                    '&::after': { borderBottom: 'none !important' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none !important' },
                },
                '& .MuiInputBase-input': {
                    border: 'none',
                    '&::placeholder': {
                        color: 'gray', 
                        opacity: 1, 
                    },
                }
              }}
              type="text"
              variant="standard"
              onChange={(e) => setStartHash(e.target.value)}
              placeholder="Hash or tag"
            />
          )}

          {source === "jira" && item && (
            <TextField
              sx={{
                ...input,
                width: "100%",
                '& .MuiInputBase-root': {
                    height: "45px",
                    
                    '&::before': { borderBottom: 'none !important' },
                    '&::after': { borderBottom: 'none !important' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none !important' },
                },
                '& .MuiInputBase-input': {
                    border: 'none',
                    '&::placeholder': {
                        color: 'gray',
                        opacity: 1,
                    },
                }
              }}
              type="text"
              variant="standard"
              onChange={(e) => setEndHash(e.target.value)}
              placeholder="# Sprint"
            />
          )}
        </Box>

        <Box
          sx={{
            marginTop: 2,
            backgroundColor: "#F7F9FB",
            borderRadius: 5,
            padding: 2,
            border: "none",
          }}
        >
          <Typography sx={label}>Finish</Typography>
          <input
          type="date"
            style={{
              ...input,
              marginLeft: "6.5%"
              
            }}
            
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
          />

          {/* ... seus outros TextField para hash/tag e sprint ... */}
          {source === "github" && item && (
            <TextField
              sx={{
                ...input,
                width: "100%",
                '& .MuiInputBase-root': {
                    height: "45px",
                    
                    '&::before': { borderBottom: 'none !important' },
                    '&::after': { borderBottom: 'none !important' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none !important' },
                },
                '& .MuiInputBase-input': {
                    border: 'none',
                    '&::placeholder': {
                        color: 'gray',
                        opacity: 1,
                    },
                }
              }}
              type="text"
              variant="standard"
              onChange={(e) => setEndHash(e.target.value)}
              placeholder="Hash or tag"
            />
          )}

          {source === "jira" && item && (
            <TextField
              sx={{
                ...input,
                width: "100%",
                '& .MuiInputBase-root': {
                    height: "45px",
                    
                    '&::before': { borderBottom: 'none !important' },
                    '&::after': { borderBottom: 'none !important' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none !important' },
                },
                '& .MuiInputBase-input': {
                    border: 'none',
                    '&::placeholder': {
                        color: 'gray',
                        opacity: 1,
                    },
                }
              }}
              type="text"
              variant="standard"
              onChange={(e) => setEndHash(e.target.value)}
              placeholder="# Sprint"
            />
          )}
        </Box>
      </Box>
      <br />
      <br />
      <Box>
        <Button sx={buttonStyle} onClick={handleApply} disabled={!isDateChanged}>
          Apply filters
        </Button>
      </Box>
    </Box>
  );
};

export default Filter;