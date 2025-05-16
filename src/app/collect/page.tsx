"use client";
import { useState } from "react";
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
} from "@mui/material";
import SourceSwitcher from "@/components/ui/SourceSwitcher";

let source = "github"; // ou "jira"

let item = "facebook/react";

const Collect = () => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    setCheckedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const options =
    source === "github"
      ? ["issue", "comment", "pull request", "commit"]
      : ["commit"];

  const handleAdd = () => {
    if (inputValue.trim()) {
      setTags((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
      setOpen(false);
    }
  };

  const handleCollect = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // const payload = {}; // Substituir depois pelo objeto que você vai especificar
    const payload = {
      repositories: [item],
      start_date: "2025-05-16T13:42:00.888Z",
      end_date: "2025-05-15T13:42:00.888Z",
      depth: "basic",
      collect_types: ["commits"],
    };

    let endpoint = "";

    switch (source) {
      case "github":
        endpoint = apiUrl + "/api/github/collect-all/";
        break;
      case "jira":
        endpoint = apiUrl + "/api/jira/collect-all/";
        break;
      // Outros cases no futuro
      default:
        console.error("Fonte desconhecida:", source);
        return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao coletar dados:", error);
      });
  };

  return (
    <Box p={2}>
      <SourceSwitcher/>
      <Box mb={2}>
        {/* Essa é a box A */}
        {source === "github" ? (
          <Typography>Repository URLS</Typography>
        ) : source === "jira" ? (
          <Typography>Projects URLS</Typography>
        ) : null}

        {/* Container com tags e caixa de entrada */}
        <Box
          sx={{
            border: "1px solid #ccc",
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
            <Chip key={idx} label={tag} />
          ))}

          {/* Caixa que abre o modal */}
          <Box
            onClick={() => setOpen(true)}
            sx={{
              border: "1px dashed #aaa",
              padding: "6px 12px",
              borderRadius: 1,
              cursor: "pointer",
              color: "#777",
              flexShrink: 0,
            }}
          >
            + Add
          </Box>
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
          <TextField
            fullWidth
            label="Digite o valor"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Modal>

      {/* Essa é a box B */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Finish"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      {/* Essa é a box C */}
      <Box>
        <Typography mb={1}>Select Types</Typography>
        <FormGroup row>
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
        <Button onClick={handleCollect}>Collect</Button>
      </Box>
    </Box>
  );
};

export default Collect;
