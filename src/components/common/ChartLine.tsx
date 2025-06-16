import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
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
  const lineColors = ["#D81B60", "#1E88E5", "#FFC107", "#004D40"];


  const [options, setOptions] = useState<
    { key: string; label: string; color: string }[]
  >([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>(options.map((o) => o.key));

  const formatLineData = (data: any) => {
// ================================================================
    const { time_series } = data;
    const { labels, ...otherSeries } = time_series;

    const result = Object.keys(otherSeries).map((key) => {
      return {
        id: key,
        data: otherSeries[key].map((value: number, index: number) => ({
          x: labels[index],
          y: value,
        })),
      };
    });

    return result;
  };

  const fetchData = async () => {
    let endpoint = "";
    endpoint = `${apiUrl}/api/${source}/dashboard/graph?interval=${interval}&start_date=${startDate}&end_date=${endDate}`;

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

    } catch (err) {
      console.error("Erro ao buscar dados do gráfico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    if (source === "github") {
      const githubOptions = [
        { key: "commits", label: "Commits", color: "#e9e29c" },
        { key: "issues", label: "Issues", color: "#dfc8b4" },
        { key: "pull_requests", label: "Pull Quests", color: "#db9387" },
      ];
      setOptions(githubOptions);
      setSelected(githubOptions.map((o) => o.key));
    } else if (source === "jira") {
      const jiraOptions = [
        { key: "commits", label: "Commits", color: "#e9e29c" },
        { key: "issues", label: "Issues", color: "#dfc8b4" },
        { key: "comments", label: "Comments", color: "#db9387" },
        { key: "sprints", label: "Sprints", color: "#a7d3a6" }, // cor escolhida
      ];
      setOptions(jiraOptions);
      setSelected(jiraOptions.map((o) => o.key));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 30) {
      setInterval("day");
    } else if (diffInDays < 12) {
      setInterval("month");
    } else {
      setInterval("year");
    }

    fetchData();
  }, [startDate, endDate, source]);

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
        {/* select aqui CHART select*/}
        {/* <Button
          onClick={handleClick}
          startIcon={<ChevronRightIcon />}
          sx={{
            textTransform: "none",
            display: "flex",
            gap: 1,
            alignItems: "center",
            // bgcolor: "green",
            marginLeft: "10px",
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
            <MenuItem key={option.key} onClick={() => handleToggle(option.key)}>
              <FormControlLabel
                control={<Checkbox checked={selected.includes(option.key)} />}
                label={option.label}
              />
            </MenuItem>
          ))}
        </Menu> */}
      </Box>

      <Box
        sx={{
          height: 450,
          bgcolor: "",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "50px",
        }}
      >
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 90, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          axisBottom={{
            tickRotation: -45,
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
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
          // colors={(serie) => {
          //   const id = String(serie.id);
          //   const option = options.find((o) => o.key === id);
          //   return selected.includes(id)
          //     ? option?.color ?? "#ccc"
          //     : "rgba(0,0,0,0)";
          // }}
          colors={lineColors}
          legends={[
            {
              anchor: "bottom", // posição da legenda
              direction: "row", // coluna vertical
              toggleSerie: true,
              justify: false,
              translateX: 90,
              translateY: 80,
              itemsSpacing: 8,
              itemDirection: "left-to-right",
              itemWidth: 200,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12, // tamanho do símbolo na legenda (9 aqui)
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
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
