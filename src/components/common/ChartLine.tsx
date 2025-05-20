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
];

const ChartLine = ({ startDate, endDate }: ChartLineProps) => {
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<string>("month");
  const source = useSelector((state: RootState) => state.source.value);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    let endpoint = "";
    if (source === "github") {
      endpoint = `${apiUrl}/api/github/dashboard/graph/`;
    } else if (source === "jira") {
      endpoint = `${apiUrl}`; // substitua pelo endpoint correto quando souber
    }

    window.alert("vai dar fetch");
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
      console.log("dados são:", data);
      // Aqui você pode usar os dados, por exemplo: setData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do gráfico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          data={chartData}
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
          curve="monotoneX"
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
