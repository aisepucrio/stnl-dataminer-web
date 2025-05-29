"use client";
import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useRouter } from 'next/navigation'; // ✅ CERTO no App Router



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

  const handleCheckboxChange = (option: string) => {
    setCheckedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const options =
    source === "github" ? ["issue", "comment", "pull request", "commit"] : [];

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
    metadata: "metadata"
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setHours(13, 42, 0, 888);
    return date.toISOString();
  };

  useEffect(() => {
    if (source) {
      setLoading(false);
      setTags([]); // zera as tags sempre que source muda
    }
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

    const payload: any = {
      ...(startDate && { start_date: formatDate(startDate) }),
      ...(endDate && { end_date: formatDate(endDate) }),
    };

    if (source === "github") {
      payload.repositories = tags;
      payload.depth = "basic";
      payload.collect_types = checkedOptions.map((opt) => collectTypeMap[opt]);
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
        }}
      >
        {/* Essa é a box A */}
        <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
          {source === "github" ? "Repository URLs" : "Projects URLS"}
        </Typography>

        {/* Container com tags e caixa de entrada */}
        <Box
          sx={{
            borderRadius: 1,
            padding: 1,
            mt: 1,
            minHeight: 50,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          {/* Tags */}
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

          {/* Caixa que abre o modal */}

          {/* Campo visual que abre o modal ao clicar */}
          <TextField
            label="Adicionar"
            value=""
            onClick={() => setOpen(true)}
            placeholder="+ Add"
            InputProps={{ readOnly: true }}
            sx={{ width: 120, cursor: "pointer" }}
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
                  label="Repository URL"
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
                  Cancelar
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
                  Cancelar
                </Button>
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Essa é a box B */}
      {/* Box B - Datas */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
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
            height: "100px",
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
            height: "100px",
            width: "230px",
            borderRadius: "16px",
            background: "#E1EEFF",
            "& fieldset": { border: "none" },
          }}
        />
      </Box>

      {/* Essa é a box C */}
      {/* Box C - Checkboxes */}
      {/* {source === "github" && ( */}
      <Box sx={{ width: "50%", py: "40px" }}>
        <FormGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
          }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={checkedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </Box>
      {/* )} */}

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
