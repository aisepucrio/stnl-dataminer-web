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
import { ResponsiveLine } from "@nivo/line";

const color = "#1C4886";

const ChartLine = ({ data }: any) => {
  const [personName, setPersonName] = useState<string[]>([]);

  return (
    <>
      <Box sx={{ ...row, justifyContent: "space-between" }}>
        <Typography sx={{color, fontSize: "32px",pt:"7px",px:"16px", fontWeight: 500,bgcolor:""}}>Charts Geral</Typography>
        <Typography>Select</Typography>
      </Box>
      <Box  sx={{ height: 400  , bgcolor:"", alignItems: "center", justifyContent: "center", marginLeft:"50px"}}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          axisBottom={{
            // orient: "bottom",
            legend: "X",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            // orient: "left",
            legend: "Y",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableSlices="x"
          useMesh={true}
        />
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
