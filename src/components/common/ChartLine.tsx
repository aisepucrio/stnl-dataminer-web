import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";


const ChartLine = () => {
  const [personName, setPersonName] = useState<string[]>([]);

  return (
    <>
      <Box sx={{ ...row, justifyContent: "space-between" }}>
        <Typography>Charts Geral</Typography>
        <Typography>Select</Typography>
      </Box>
      <Box>

      this si a chart line
      </Box>
    </>
  );
};

const row = {
  display: "flex",
  flexDirection: "row",
};
const column = {
  display: "flex",
  flexDirection: "column",
};

export default ChartLine;
