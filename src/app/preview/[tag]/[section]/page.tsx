"use client";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MUIDataTable from "mui-datatables";
import columns from "./columns.js";
import FilterPreview from "@/components/common/FilterPreview";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const row = { display: "flex", flexDirection: "row" };
// const column = { display: "flex", flexDirection: "column" };

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const source = useSelector((state: RootState) => state.source.value);
  const itemId = useSelector((state: RootState) => state.item.value);
  const params = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [total, setTotal] = useState<number>(); // Valor fixo só como exemplo
  const totalPages = Math.ceil(total / pageSize);

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1); // Resetar página ao mudar o tamanho
  };

  const options = {
    filterType: "checkbox",
    rowsPerPageOptions: [10, 25, 50, 100],
    pagination: false,
    selectableRows: "none",
    draggableColumns: {
      enabled: true,
    },
    download: true, // <- isso é necessário!  ,
    fixedHeader: false,
    print: false,
    onDownload: () => {
      return false;
    },
    elevation: 1,
    filter: false,
  };

  const fetchPreview = async () => {
    const tag = String(params.tag);
    const section = String(params.section);
    const item =
      itemId && source === "github"
        ? `&repository=${itemId}`
        : itemId && source === "jira"
        ? `&project=${itemId}`
        : "";

    const startDateParam = startDate ? `&created_after=${startDate}` : "";
    const endDateParam = endDate ? `&created_before=${endDate}` : "";

    // const endpoint = `http://localhost:8000/api/${tag}/${section}?page=`;
    const endpoint = `${apiUrl}/api/${tag}/${section}?page=${page}&page_size=${pageSize}${item}${startDateParam}${endDateParam}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Erro no fetch");
      const data = await res.json();
      console.log("Dados recebidos:", data);

      setResults(data.results); // salva os resultados
      setTotal(data.count);
    } catch (err) {
      console.error("Erro ao buscar preview:", err);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [source, itemId, startDate, endDate, page]);

  return (
    <Box sx={{ ...row, gap: "20px", px: "20px", pt: 3 }}>
      <Box>
        <Box
          sx={{
            width: "60vw",
            height: "80vh",
            bgcolor: "",
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* {source} <br />
        {itemId ? <>{itemId}</> : <>nao tem id selcionado</>} <br /> */}
          <MUIDataTable
            title={""}
            data={results}
            columns={columns}
            options={options}
          />
        </Box>
        <br />
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ bgcolor: "", ...row, justifyContent: "flex-end" }}
        >
          <Typography>Rows per page:</Typography>
          <Select
            size="small"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Typography>
            {page} of {totalPages || 1}
          </Typography>

          <IconButton onClick={handlePrev} disabled={page === 1}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Box>
        <FilterPreview
          source={source}
          item={itemId}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Box>
    </Box>
  );
};

export default Preview;
