"use client";
import { Box, IconButton, MenuItem, Select, Typography, Tooltip } from "@mui/material";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MUIDataTable from "mui-datatables";
import { debounceSearchRender } from "mui-datatables";
import FilterPreview from "@/components/common/FilterPreview";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import { useRouter } from "next/navigation";
import ModalDownload from "@/components/common/ModalDownload";

const row = { display: "flex", flexDirection: "row" };
// const column = { display: "flex", flexDirection: "column" };

const Preview = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const source = useSelector((state: RootState) => state.source.value);
  const itemId = useSelector((state: RootState) => state.item.value);
  const itemName = useSelector((state: RootState) => state.item.itemName);
  const params = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [total, setTotal] = useState<number>();
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const formatColumns = () => {
    if (!results || results.length === 0) return [];
    const firstColumn = results[0];

    const listAux = Object.keys(firstColumn).map((key) => ({
      name: key,
      label: key,
      options: {
        filter: true,
        sort: true,
      },
    }));

    return listAux;
  };

  const columns = formatColumns();

  const onClose = () => {
    setOpen(false);
  };

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
    fixedHeader: false,
    print: false,
    download: false,
    elevation: 1,
    filter: false,
    customSearchRender: debounceSearchRender(500),
    customToolbar: () => {
      return (
        <Tooltip title="Export">
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      );
    },
    serverSide: true,
    onTableChange: (action: string, tableState: any) => {
      switch (action) {
        case "sort":
          setSortOrder(tableState.sortOrder.direction === "desc" ? 
            tableState.sortOrder.name : "-" + tableState.sortOrder.name);
          setPage(1);
          break;
        case "search":
          setSearchText(tableState.searchText);
          setPage(1);
          break;
      }
    },
  };

  const fetchPreview = async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const tag = String(params.tag);
    const section = String(params.section);
    const itemParam =
      itemId && source === "github"
        ? `&repository=${itemName}`
        : itemId && source === "jira"
        ? `&project=${itemId}`
        : "";

    const startDateParam = startDate ? `&created_after=${startDate}` : "";
    const endDateParam = endDate ? `&created_before=${endDate}` : "";
    const searchParam = searchText ? `&search=${searchText}` : "";
    const orderParam = sortOrder ? `&ordering=${sortOrder}` : "";
    const endpoint = `${apiUrl}/api/${tag}/${section}?page=${page}&page_size=${pageSize}${itemParam}${startDateParam}${endDateParam}${searchParam}${orderParam}`;
    console.log("Endpoint:", endpoint);

    try {
      const res = await fetch(endpoint, { signal });
      if (!res.ok) throw new Error("Erro no fetch");
      const data = await res.json();

      // Only update state if the request wasn't aborted
      if (!signal.aborted) {
        setResults(data.results); // salva os resultados
        // setResults(
        //   data.results.map((item) => {
        //     const newItem: any = {};
        //     Object.keys(item).forEach((key) => {
        //       const value = item[key];
        //       newItem[key] =
        //         typeof value === "object" && value !== null
        //           ?"---Object---"
        //           : value;
        //     });
        //     return newItem;
        //   })
        // );
        setResults(
          data.results.map((item) => {
            const newItem: any = {};
            Object.keys(item).forEach((key) => {
              let value = item[key];

              if (typeof value === "object" && value !== null) {
                // value = "---Object---";
                value = JSON.stringify(value);
                // value = String(JSON.stringify(value)).slice(0, 60) + "...";
              } else if (String(value).length > 40) {
                value = String(value).slice(0, 40) + "...";
              }

              newItem[key] = value;
            });
            return newItem;
          })
        );

        setTotal(data.count);
      }
    } catch (err) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (err.name !== 'AbortError') {
        console.error("Erro ao buscar preview:", err);
      }
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [ startDate, endDate, page, itemId, itemName , sortOrder, searchText]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push("/");
  }, [source]);

  // Cleanup function to cancel pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Box sx={{ ...row, gap: "20px", px: "20px", pt: 3 }}>
      <Box>
        <Box
          sx={{
            width: "60vw",
            height: "77vh",
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
      <ModalDownload open={open} onClose={onClose} source={source} />
    </Box>
  );
};

export default Preview;
