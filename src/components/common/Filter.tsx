import { BorderColor, Height } from "@mui/icons-material";
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

const color = "#1C4886";

const title = { color, fontSize: "32px" };

const label = { color, fontSize: "24px" };

const date = {
  //   border: "none",
  //   bgcolor: "green",
  BorderColor: color,
  border: "none", // remove completamente a borda
  borderRadius: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 0, // zera o border-radius do contorno
  },
};

const button = {
  bgcolor: "#1c4886",
  width: "218px",
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
  //   const [startDate, setStartDate] = useState(item);
  //   const [endDate, setEndDate] = useState(source);

  return (
    <Box>
      <Box>
        <Typography sx={title}>Filters</Typography>

        <Typography sx={label}>Start</Typography>

        <TextField
          type="date"
          sx={date}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          // InputLabelProps={{ shrink: true }}
        />

        <Typography sx={label}>Finish</Typography>

        <TextField
          sx={date}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          // InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box>
        <Button sx={button}>Apply filters</Button>
      </Box>
    </Box>
  );
};

export default Filter;
