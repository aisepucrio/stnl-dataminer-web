"use client";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<Record<string, any>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const source = params.source;
  const section = params.section;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/${source}/${section}`, {
            method:"GET",
        });
        console.log("Fetching:", apiUrl);


        if (!res.ok) throw new Error("Erro ao buscar dados");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      }
    };

    fetchData();
  }, [apiUrl, source, section]);

  if (error) return <Typography color="error">Erro: {error}</Typography>;
  if (!data) return <Typography>Carregando...</Typography>;
  if (data.length === 0) return <Typography>Nenhum dado encontrado.</Typography>;

  const columns = Object.keys(data[0]); // Pegamos os campos da primeira linha

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>
        Fonte: {source} / Seção: {section}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col}>{String(item[col])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Preview;
