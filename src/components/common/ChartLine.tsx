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
import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

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
    } else if (diffInDays < 120) {
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
      <Box sx={{ ...row, justifyContent: "space-between" }}>
        <Typography
          sx={{
            color,
            fontSize: "32px",
            pt: "7px",
            px: "16px",
            fontWeight: 500,
            bgcolor: "",
          }}
        >
          Charts Geral
        </Typography>
        <Typography>Select</Typography>
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
          curve="monotoneX"
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
