"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  colors,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useRouter } from "next/navigation";

const Collect = () => {
  const source = useSelector((state: RootState) => state.source.value);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [domainValue, setDomainValue] = useState("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [checkedOptions, setCheckedOptions] = useState<string[]>(["metadata"]);

  const options = useMemo(
    () =>
      source === "github" ? ["issue", "comment", "pull request", "commit"] : [],
    [source]
  );

  const displayOptions = ["select all", ...options];
  const isAllSelected = options.every((option) =>
    checkedOptions.includes(option)
  );

  const handleCheckboxChange = (option: string) => {
    if (option === "select all") {
      if (isAllSelected) {
        setCheckedOptions(["metadata"]);
      } else {
        setCheckedOptions([...options, "metadata", "select all"]);
      }
    } else {
      setCheckedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  const handleAdd = () => {
    if (source === "github") {
      if (inputValue.trim()) {
        setTags((prev) => [...prev, inputValue.trim()]);
        setInputValue("");
        setOpen(false);
      }
    } else if (source === "jira") {
      if (domainValue.trim() && inputValue.trim()) {
        setTags((prev) => [
          ...prev,
          { jira_domain: domainValue.trim(), project_key: inputValue.trim() },
        ]);
        setDomainValue("");
        setInputValue("");
        setOpen(false);
      }
    }
  };

  const collectTypeMap: Record<string, string> = {
    commit: "commits",
    comment: "comments",
    "pull request": "pull_requests",
    issue: "issues",
    metadata: "metadata",
  };

  const formatDateGitHub = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setHours(13, 42, 0, 888);
    return date.toISOString();
  };

  const formatDateJira = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Retorna no formato 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setLoading(false);
    setTags([]); // zera as tags sempre que source muda
    setCheckedOptions(["metadata"]);
  }, [source]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleCollect = () => {
    // Validação
    if (tags.length === 0) {
      alert("Adicione ao menos uma tag antes de coletar.");
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    let payload: any = {};
    if (source === "github") {
      payload = {
        ...(startDate && { start_date: formatDateGitHub(startDate) }),
        ...(endDate && { end_date: formatDateGitHub(endDate) }),
      };
    } else if (source === "jira") {
      payload = {
        ...(startDate && { start_date: formatDateJira(startDate) }),
        ...(endDate && { end_date: formatDateJira(endDate) }),
      };
    }

    if (source === "github") {
      payload.repositories = tags;
      payload.depth = "basic";
      payload.collect_types = checkedOptions
        .filter((opt) => opt !== "select all")
        .map((opt) => collectTypeMap[opt]);
    } else if (source === "jira") {
      payload.projects = tags;
    }

    const endpoint =
      source === "github"
        ? `${apiUrl}/api/github/collect-all/`
        : source === "jira"
        ? `${apiUrl}/api/jira/issues/collect/`
        : "";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erro na requisição: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        console.log("Sucesso:", data);
        router.push("/jobs");
      })
      .catch((err) => {
        console.error("Erro ao coletar dados:", err);
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Box A - Tags */}
      <Box
        mb={2}
        sx={{
          height: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: -3,
        }}
      >
        <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
          {source === "github" ? "Repository Name" : "Projects Name"}
        </Typography>

        <Box
          sx={{
            borderRadius: 1,
            padding: 1,
            mt: 1,
            minHeight: 50,
            display: "flex",
            flexWrap: "wrap",
            // gap: 1,
            alignItems: "center",
            gap: "20px",
          }}
        >
          {tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={
                source === "github"
                  ? tag
                  : `${tag.jira_domain}/${tag.project_key}`
              }
              onDelete={() =>
                setTags((prev) => prev.filter((_, i) => i !== idx))
              }
              deleteIcon={
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "#cccfd2",
                    color: "white",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </Box>
              }
              sx={{
                height: "50px",
                border: "1px solid #1C4886",
                bgcolor: "white",
                px: 2,
                fontWeight: 500,
                fontSize: "14px",
              }}
            />
          ))}

          <TextField
            label="Add"
            value=""
            onClick={() => setOpen(true)}
            placeholder="+ Add"
            InputProps={{ readOnly: true }}
            sx={{ width: 140, cursor: "pointer", ml: -1 }}
          />
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 300,
          }}
        >
          {source === "github" ? (
            <>
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Format : owner/repo"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box mb={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Domain"
                  value={domainValue}
                  onChange={(e) => setDomainValue(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Project"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Box B - Datas */}
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "30px", mt: -2 }}
      >
        {!startDate && !endDate && (
          <Alert variant="outlined" severity="warning" sx={{ width: "40vw" }}>
            Leaving the date fields empty will mine data from the entire period.
          </Alert>
        )}
        <TextField
          label="Start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{
            height: "80px",
            width: "230px",
            borderRadius: "16px",
            background: "#E1EEFF",
            "& fieldset": { border: "none" },
          }}
        />
        <TextField
          label="Finish"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{
            height: "80px",
            width: "230px",
            borderRadius: "16px",
            background: "#E1EEFF",
            "& fieldset": { border: "none" },
          }}
        />
      </Box>

      {/* Box C - Checkboxes */}
      {source === "github" && (
        <Box sx={{ width: "50%", py: "40px", mt: -2, mb: -2 }}>
          <FormGroup
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 1,
            }}
          >
            {displayOptions.map((option: string) => (
              <FormControlLabel
                key={option}
                label={option}
                sx={
                  option === "select all"
                    ? {
                        color: "#1C4886",
                      }
                    : {
                        color: "black",
                      }
                }
                control={
                  <Checkbox
                    checked={checkedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    sx={
                      option === "select all"
                        ? {
                            color: "#1C4886",
                            "&.Mui-checked": {
                              color: "#1C4886",
                            },
                          }
                        : {}
                    }
                  />
                }
              />
            ))}
          </FormGroup>
        </Box>
      )}

      {/* Botão Final */}
      <Box display="flex">
        <Button
          onClick={handleCollect}
          variant="contained"
          disabled={tags.length === 0}
          sx={{
            color: "white",
            bgcolor: "#1C4886",
            height: "76px",
            width: "225px",
            fontSize: "22px",
            textTransform: "none",
            borderRadius: "12px",
            marginTop: 2,
            fontWeight: 600,
          }}
        >
          Collect
        </Button>
      </Box>
    </Box>
  );
};

export default Collect;
