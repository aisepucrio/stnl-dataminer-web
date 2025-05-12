import { BorderColor } from "@mui/icons-material";
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
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}

const filter = {
  bgcolor: "white",
  width: "20vw",
  height: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  px: "27px",
  pt: "20px",
};

const color = "#1C4886";

const title = { color, fontSize: "32px" };

const label = { color, fontSize: "24px" };

const input = {
  width: "90%",
  BorderColor: color,
  border: "none", // remove completamente a borda
  borderRadius: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 0, // zera o border-radius do contorno
  },
};

const button = {
  bgcolor: "#1c4886",
  minWidth: "218px",
  height: "76px",
  fontWeight: 700,
  color: "white",
};

const Filter = ({
  source,
  item,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: FilterProps) => {
  const [startHash, setStartHash] = useState<string>("");
  const [endHash, setEndHash] = useState<string>("");

  return (
    <Box sx={filter}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography sx={title}>Filters</Typography>

        <Typography sx={label}>Start</Typography>

        <TextField
          type="date"
          sx={input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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

        {source === "jira" && item && <Typography>tem item do jira</Typography>}

        {/* ------------------------------------ */}
        <Typography sx={label}>Finish</Typography>

        <TextField
          sx={input}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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

        {source === "jira" && item && <Typography>tem item do jira</Typography>}
      </Box>
      <br />
      <br />
      <Box>
        <Button sx={button}>Apply filters</Button>
      </Box>
    </Box>
  );
};

export default Filter;
