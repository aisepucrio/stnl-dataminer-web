import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";

const color = "#1C4886";

interface ChartLineProps {
  startDate: string;
  endDate: string;
}

const chartData = [
  {
    id: "Série A",
    data: [
      { x: "Jan", y: 10 },
      { x: "Fev", y: 20 },
      { x: "Mar", y: 15 },
    ],
  },
  {
    id: "Série B",
    data: [
      { x: "Jan", y: 20 },
      { x: "Fev", y: 18 },
      { x: "Mar", y: 15 },
    ],
  },
];

const ChartLine = ({ startDate, endDate }: ChartLineProps) => {
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<string>("month");
  const source = useSelector((state: RootState) => state.source.value);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [lineData, setLineData] = useState<any>([]);

  const options = ["commits", "issues", "pull requests"];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const formatLineData = (data: any) => {
    const labels = data.time_series.labels;
    const issues = data.time_series.issues;
    const pullRequests = data.time_series.pull_requests;
    const commits = data.time_series.commits;

    const formatSeries = (id, values) => ({
      id,
      data: labels.map((label, index) => ({
        x: label,
        y: values[index],
      })),
    });

    const issuesData = formatSeries("issues", issues);
    const pullRequestsData = formatSeries("pull_requests", pullRequests);
    const commitsData = formatSeries("commits", commits);

    return [issuesData, pullRequestsData, commitsData];
  };

  const fetchData = async () => {
    let endpoint = "";
    if (source === "github") {
      endpoint = `${apiUrl}/api/github/dashboard/graph?interval=${interval}&start_date=${startDate}&end_date=${endDate}`;
    } else if (source === "jira") {
      endpoint = `${apiUrl}`; // substitua pelo endpoint correto quando souber
    }

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      const formatted = formatLineData(data);

      setLineData(formatted);

      // Aqui você pode usar os dados, por exemplo: setData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do gráfico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 15) {
      setInterval("day");
    } else if (diffInDays < 90) {
      setInterval("week");
    } else {
      setInterval("month");
    }

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return <div> ... loading ...</div>;
  }

  return (
    <>
      <Box sx={{ ...row, justifyContent: "space-between", py: "24px" }}>
        <Typography
          sx={{
            color,
            fontSize: "18px",
            px: "16px",
            fontWeight: 600,
            bgcolor: "",
          }}
        >
          Charts Geral
        </Typography>
      </Box>
      <Box>
        {/* select aqui */}

        <Button
          onClick={handleClick}
          // variant="outlined"
          startIcon={<ChevronRightIcon />}
          sx={{
            textTransform: "none",
            display: "flex",
            gap: 1,
            alignItems: "center",
            // bgcolor: "green",
            marginLeft: "10px"
          }}
        >
          <Image
            src="/icons/BookOpen.svg"
            alt="chart filter"
            width={20}
            height={20}
          />
          <Typography>Chart Filter</Typography>
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleToggle(option)}>
              <FormControlLabel
                control={<Checkbox checked={selected.includes(option)} />}
                label={option}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box
        sx={{
          height: 400,
          bgcolor: "",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "50px",
        }}
      >
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          axisBottom={{
            tickRotation: -45, // coloca os textos em diagonal
            // legend: "Data",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            // orient: "left",
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={3}
          pointBorderColor={{ from: "serieColor" }}
          enableSlices="x"
          useMesh={true}
          curve="monotoneX"
          enablePoints={true}
          // curve="linear"
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
