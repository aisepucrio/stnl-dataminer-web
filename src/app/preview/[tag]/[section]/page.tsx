"use client";
import { Box } from "@mui/material";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MUIDataTable from "mui-datatables";
import columns from "./columns.js";
import FilterPreview from "@/components/common/FilterPreview";
import Filter from "@/components/common/Filter";


const row = { display: "flex", flexDirection: "row" };
const column = { display: "flex", flexDirection: "column" };

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const source = useSelector((state: RootState) => state.source.value);
  const itemId = useSelector((state: RootState) => state.item.value);
  const params = useParams();
  const [page, setPage] = useState(3);

  const [pageSize, setPageSize] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  console.log();
  console.log();
  console.log("results");
  console.log(results);

  const options = {
    filterType: "checkbox",
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
    // customTableHeadRender: () => null,
    // display: false,
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

    // const endpoint = `http://localhost:8000/api/${tag}/${section}?page=`;
    const endpoint = `${apiUrl}/api/${tag}/${section}?page=${page}&page_size=${pageSize}${item}`;
    window.alert("Fetching from:" + endpoint);

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Erro no fetch");
      const data = await res.json();
      console.log("Dados recebidos:", data);

      setResults(data.results); // salva os resultados
    } catch (err) {
      console.error("Erro ao buscar preview:", err);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [source, itemId, startDate, endDate]);

  return (
    <Box sx={{ ...row ,    gap: "20px", px: "20px", pt: 3 }}>
      <Box sx={{ width: "60vw", height: "100vh", bgcolor: "", }}>
        {/* {source} <br />
        {itemId ? <>{itemId}</> : <>nao tem id selcionado</>} <br /> */}
        <MUIDataTable
          title={""}
          data={results}
          columns={columns}
          options={options}
        />
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
