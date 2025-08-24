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
  source?: string;
  item?: string;
  startDate?: string;
  setStartDate?: (value: string) => void;
  endDate?: string;
  setEndDate?: (value: string) => void;
  minDate?: string;
  maxDate?: string;
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

const FilterPreview = ({
  source,
  item,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  minDate,
  maxDate,
}: FilterProps) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");

  // const [startHash, setStartHash] = useState<string>("");
  // const [endHash, setEndHash] = useState<string>("");

  // const [startSprint, setStartSprint] = useState<string>("");
  // const [endSprint, setEndSprint] = useState<string>("");

  const handleApply = () => {
    if (setStartDate) setStartDate(localStartDate);
    if (setEndDate) setEndDate(localEndDate);
  };

  const DateField = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      type="date"
      min={minDate || undefined}
      max={maxDate || undefined}
      style={{
        ...input,
        marginLeft: "6.5%",
      }}
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (!v) return onChange(v);
        if (minDate && v < minDate) return onChange(minDate);
        if (maxDate && v > maxDate) return onChange(maxDate);
        onChange(v);
      }}
    />
  );

  // Check if there are any changes - normalize undefined/null to empty string
  const originalStartDate = startDate || "";
  const originalEndDate = endDate || "";
  const hasChanges = localStartDate !== originalStartDate || localEndDate !== originalEndDate;

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
          <DateField value={localStartDate} onChange={setLocalStartDate} />

          {/* ... seus outros TextField para hash/tag e sprint ... */}
       
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
          <DateField value={localEndDate} onChange={setLocalEndDate} />

          {/* ... seus outros TextField para hash/tag e sprint ... */}
       
        </Box>
      </Box>
      <br />
      <br />
      <Box>
        <Button 
          sx={{
            ...button,
            bgcolor: hasChanges ? "#1c4886" : "#9e9e9e",
            "&:hover": {
              bgcolor: hasChanges ? "#1a4077" : "#9e9e9e",
            }
          }}
          onClick={handleApply}
          disabled={!hasChanges}
        >
          Apply filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterPreview;