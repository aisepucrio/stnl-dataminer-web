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

const color = "#1C4886";

const title = { color, fontSize: "32px" };

const label = { color, fontSize: "24px" };

const input = {
  height: "45px",
  width: "90%",
  BorderColor: color,
  border: "none", // remove completamente a borda
  borderRadius: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 0, // zera o border-radius do contorno
    height: "40px",
  },
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

  return (
    <Box sx={filter}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography sx={title}>Filters</Typography>

        <Typography sx={label}>Start</Typography>

        <TextField
          type="date"
          sx={input}
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
        />

        {/* A customização é aqui */}
        {/* {source} */}
        {source === "github" && item && (
          // <Typography>tem item de github</Typography>
          <TextField
            sx={input}
            type="text"
            onChange={(e) => setStartHash(e.target.value)}
            placeholder="Hash or tag"
          />
        )}

        {source === "jira" && item && (
          <TextField
            sx={input}
            type="text"
            onChange={(e) => setEndHash(e.target.value)}
            placeholder="# Sprint"
          />
        )}

        {/* ------------------------------------ */}
        <Typography sx={label}>Finish</Typography>

        <TextField
          sx={input}
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          // InputLabelProps={{ shrink: true }}
        />

        {source === "github" && item && (
          // <Typography>tem item de github</Typography>
          <TextField
            sx={input}
            type="text"
            onChange={(e) => setEndHash(e.target.value)}
            placeholder="Hash or tag"
          />
        )}

        {source === "jira" && item && (
          <TextField
            sx={input}
            type="text"
            onChange={(e) => setEndHash(e.target.value)}
            placeholder="# Sprint"
          />
        )}
      </Box>
      <br />
      <br />
      <Box>
        <Button sx={button} onClick={handleApply}>
          Apply filters
        </Button>
      </Box>
    </Box>
  );
};

export default Filter;
