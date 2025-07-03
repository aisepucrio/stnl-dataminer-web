"use client";
import { Box, IconButton, MenuItem, Select, Typography, Tooltip, Skeleton, Button } from "@mui/material";
import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useParams } from "next/navigation";
import MUIDataTable from "mui-datatables";
import { debounceSearchRender } from "mui-datatables";
import FilterPreview from "@/components/common/FilterPreview";
import ModalCodeBlock from "@/components/common/ModalCodeBlock";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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
  const [pageSize, setPageSize] = useState(5);
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [total, setTotal] = useState<number>();
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [open, setOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [prevDateRange, setPrevDateRange] = useState<{startDate: string, endDate: string}>({startDate: "", endDate: ""});
      
  const tag = String(params.tag);
  const section = String(params.section);

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

  const baseColumns = formatColumns();

  const onClose = () => {
    setOpen(false);
  };

  const handleCodeModalClose = () => {
    setCodeModalOpen(false);
    setSelectedCellData(null);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1); // Reset page to 1 when page size changes
    setIsInitialLoading(true); // Trigger loading state
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
        <>

          <Tooltip title="Export">
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Click any cell to view its full contents in a modal. For cells with long text or objects, click to expand and see the complete value. This is useful for inspecting truncated or complex data.">
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </>
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
    onCellClick: (colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => {
      if (colData && colData.__isShowItemButton) {
        // Do nothing, handled by button
        return;
      }
      const fullValue = results[cellMeta.dataIndex][columns[cellMeta.colIndex].name];
      setSelectedCellData(fullValue);
      setCodeModalOpen(true);
    }
  };

  const fetchPreview = async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;


    const itemParam =
      itemId && source === "github"
        ? `&repository=${itemName}`
        : itemId && source === "jira"
        ? `&project=${itemId}`
        : "";

    const dateParamMap: any = {
      github: {
        commits: { start: "date__gte", end: "date__lte" },
        users: { start: "date__gte", end: "date__lte" },
        default: { start: "created_at__gte", end: "created_at__lte" },
      },
      jira: {
        sprints: { start: "startDate__gte", end: "endDate__lte" },
        users: { start: "updated_at__gte", end: "updated_at__lte" },
        default: { start: "created__gte", end: "created__lte" },
      },
    };

    let startDateParam = "";
    let endDateParam = "";
    if (source === "github") {
      const dateParams = dateParamMap.github[section] || dateParamMap.github.default;
      const { start, end } = dateParams;
      startDateParam = startDate ? `&${start}=${startDate}` : "";
      endDateParam = endDate ? `&${end}=${endDate}` : "";
    } else if (source === "jira") {
      const dateParams = dateParamMap.jira[section] || dateParamMap.jira.default;
      const { start, end } = dateParams;
      startDateParam = startDate ? `&${start}=${startDate}` : "";
      endDateParam = endDate ? `&${end}=${endDate}` : "";
    }

    const searchParam = searchText ? `&search=${searchText}` : "";
    const orderParam = sortOrder ? `&ordering=${sortOrder}` : "";
    const endpoint = `${apiUrl}/api/${tag}/${section}?page=${page}&page_size=${pageSize}${itemParam}${startDateParam}${endDateParam}${searchParam}${orderParam}`;
    try {
      const res = await fetch(endpoint, { signal });
      if (!res.ok) throw new Error("Erro no fetch");
      const data = await res.json();

      // Only update state if the request wasn't aborted
      if (!signal.aborted) {
        setResults(data.results);
        setResults(
          data.results.map((item) => {
            const newItem: any = {};
            Object.keys(item).forEach((key) => {
              const value = item[key];
              if (typeof value === "object" && value !== null) {
                // Instead of stringifying, show a button placeholder
                newItem[key] = { __isShowItemButton: true, value };
              } else {
                newItem[key] = value;
              }
            });
            return newItem;
          })
        );
        setTotal(data.count);
        setIsInitialLoading(false);
      }
    } catch (err) {
      // Ignore AbortError as it's expected when requests are cancelled
      if (err.name !== 'AbortError') {
        console.error("Erro ao buscar preview:", err);
        setIsInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPreview();
    // Show toast only when date range changes (not on first render)
    if (!isFirstRender.current && 
        (startDate !== prevDateRange.startDate || endDate !== prevDateRange.endDate)) {
      setShowUpdateToast(true);
    }
    // Update previous date range
    setPrevDateRange({startDate, endDate});
  }, [ startDate, endDate, page, pageSize, itemId, itemName , sortOrder, searchText]);

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

  // Custom render for cells: show button for objects, otherwise show value
  // Helper to check if a string is an ISO date
  const isIsoDateString = (str: string) => {
    // Accepts 2025-03-17T13:36:54Z or 2025-01-02T16:53:26+00:00
    return (
      typeof str === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(str)
    );
  };

  // Format ISO date string to human readable
  const formatIsoDate = (str: string) => {
    try {
      const date = new Date(str);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    } catch {}
    return str;
  };

  const getColumnsAndHandleSpecialCases = () => {
    if (!results || results.length === 0) return baseColumns;
    return baseColumns.map((col) => ({
      ...col,
      options: {
        ...col.options,
        customBodyRender: (value: any, tableMeta: any) => {
          if (value && value.__isShowItemButton) {
            // For objects, show button as before
            return (
              <Button
                variant="outlined"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedCellData(value.value);
                  setCodeModalOpen(true);
                }}
              >
                Show
              </Button>
            );
          }
          // Detect and format ISO date strings
          if (typeof value === 'string' && isIsoDateString(value)) {
            return (
              <span title={value}>{formatIsoDate(value)}</span>
            );
          }
          // Truncate long primitive values for display, but keep full value for modal
          if (typeof value === 'string' && value.length > 40) {
            return (
              <span
                style={{ cursor: 'pointer' }}
                title={value}
              >
                {value.slice(0, 40) + '...'}
              </span>
            );
          }
          return value;
        },
      },
    }));
  };
  const columns = getColumnsAndHandleSpecialCases();

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
          {isInitialLoading ? (
            <Box sx={{ p: 2 }}>
              {/* Table header skeleton */}
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1 }} />
              {/* Table rows skeleton */}
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="100%"
                  height={52}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          ) : (
            <MUIDataTable
              title={""}
              data={results}
              columns={columns}
              options={options}
            />
          )}
        </Box>
        <br />
        {isInitialLoading ? (
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ bgcolor: "", ...row, justifyContent: "flex-end" }}
          >
            <Skeleton variant="text" width={120} height={40} />
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={60} height={32} />
            <Skeleton variant="text" width={60} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        ) : (
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

            <Select
              size="small"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              sx={{ minWidth: 60 }}
            >
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
                <MenuItem key={pageNum} value={pageNum}>
                  {pageNum}
                </MenuItem>
              ))}
            </Select>
            <Typography>of {totalPages || 1}</Typography>

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
        )}
      </Box>
      {String(params.section) !== "users" && <Box>
        <FilterPreview
          source={source}
          item={itemId}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Box>}
      <ModalDownload open={open} onClose={onClose} source={source} section={section} />
      <ModalCodeBlock 
        open={codeModalOpen} 
        onClose={handleCodeModalClose} 
        code={selectedCellData}
      />
      <Snackbar
        open={showUpdateToast}
        autoHideDuration={1500}
        onClose={() => setShowUpdateToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setShowUpdateToast(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          Table filtered using new date range!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Preview;
