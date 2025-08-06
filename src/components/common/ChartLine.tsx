import { Box, Typography, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

const color = "#1C4886";

interface ChartLineProps {
  startDate: string;
  endDate: string;
}

const ChartLine = ({ startDate, endDate }: ChartLineProps) => {
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<string>("month");
  const [noData, setNoData] = useState(false);
  const source = useSelector((state: RootState) => state.source.value);
  const item = useSelector((state: RootState) => state.item.value);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [lineData, setLineData] = useState<any>([]);
  const lineColors = ["#D81B60", "#1E88E5", "#FFC107", "#004D40"];

  const [options, setOptions] = useState<
    { key: string; label: string; color: string }[]
  >([]);

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
    console.log("fetchData", startDate, endDate, source, item);
    let endpoint = "";

    const itemIdParam = item
      ? source === "github"
        ? `&repository_id=${item}`
        : source === "jira"
        ? `&project_id=${item}`
        : ""
      : "";

    const startDateParam = startDate ? `&start_date=${startDate}` : "";
    const endDateParam = endDate ? `&end_date=${endDate}` : "";

    endpoint = `${apiUrl}/api/${source}/dashboard/graph?interval=${interval}${startDateParam}${endDateParam}${itemIdParam}`;
    // window.alert(endpoint);
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

      // Check if data is empty
      const hasData = formatted && formatted.length > 0 && formatted.some((series: any) => series.data && series.data.length > 0);
      setNoData(!hasData);
      setLineData(formatted);
    } catch (err) {
      console.error("Erro ao buscar dados do gráfico:", err);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }, [source, item]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays < 30) {
        setInterval("day");
      } else if (diffInDays < 366) {
        setInterval("month");
      } else {
        setInterval("year");
      }
    } else {
      setInterval("month");
    }
  }, [startDate, endDate, source, item]);

  useEffect(() => {
    fetchData();
  }, [interval]);

  if (loading) {
    return <div> ... loading ...</div>;
  }

  if (noData) {
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
            Charts (Cumulative)
          </Typography>
        </Box>
        <Box 
          sx={{ 
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: "16px"
          }}
        >
          <Alert severity="warning" 
          sx={{
            fontSize: "18px"
          }}>
            No data was available for the selected criteria.
          </Alert>
        </Box>
      </>
    );
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
          Charts (Cumulative)
        </Typography>
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
// const column = {
//   display: "flex",
//   flexDirection: "column",
// };

export default ChartLine;
