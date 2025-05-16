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
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store"; // ajuste o caminho se for diferente

// let source = "github"; // ou "jira"

let item = "facebook/react";

const Collect = () => {
  const source = useSelector((state: RootState) => state.source.value);

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
    } else {
      console.log("Input vazio, não adicionando");
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
    <Box sx={{ bgcolor: "", width: "100%", height: "100vh", p: 3 }}>
      {/* <SourceSwitcher/>;
       */}
      {/* {source} */}

      <Box
        mb={2}
        sx={{
          bgcolor: "",
          width: "100%",
          height: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // alinha verticalmente
          // alignItems: "center", // alinha horizontalmente
        }}
      >
        {/* Essa é a box A */}
        {/* {source === "github" ? (
          <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
            Repository URLs
          </Typography>
        ) : source === "jira" ? (
          <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
            Projects URLS
          </Typography>
        ) : null} */}
        <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
          {source === "github" ? "Repository URLs" : "Projects URLS"}
        </Typography>

        {/* Container com tags e caixa de entrada */}
        <Box
          sx={{
            // border: "1px solid #ccc",
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
              label={tag}
              onDelete={() => {
                setTags((prev) => prev.filter((_, i) => i !== idx));
              }}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            />
          ))}

          {/* Caixa que abre o modal */}
          {/* <Box
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
          </Box> */}
          {/* Campo visual que abre o modal ao clicar */}
          <TextField
            label="Adicionar"
            value=""
            onClick={() => setOpen(true)}
            placeholder="+ Add"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              width: 120,
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>

      {/* Modal */}
      {/* <Modal open={open} onClose={() => setOpen(false)}>
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
      </Modal> */}
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
            p: 3,
            borderRadius: 2,
            width: 400,
          }}
        >
          {source === "github" && (
            <>
              {/* Box superior: Input */}
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

              {/* Box inferior: Botões alinhados à direita */}
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button onClick={() => setOpen(false)} color="inherit">
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  variant="contained"
                  disabled={!inputValue.trim()}
                >
                  Add
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Essa é a box B */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // width: "224px",
          // minWidth: "200px",
          // height: "95px",
          // padding: "24px",
          gap: "8px",
          flexShrink: 0,
          // mb: 2,
          bgcolor: "",
          width: "100%",
        }}
      >
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
            "& fieldset": {
              border: "none", // remove a borda padrão se quiser
            },
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
            "& fieldset": {
              border: "none", // opcional
            },
          }}
        />
      </Box>

      {/* Essa é a box C */}
      {/* <Box>
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
      </Box> */}
      <Box sx={{ width: "50%" }}>
        <FormGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1, // espaçamento entre os elementos
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

      <Box display="flex">
        <Button
          onClick={handleCollect}
          variant="contained"
          sx={{
            color: "white",
            bgcolor: "#1C4886",
            height: "76px",
            width: "225px",
            fontsize: "20px",
            textTransform: "none",
            boxSizing: "border-box",
          }}
        >
          Collect
        </Button>
      </Box>
    </Box>
  );
};

export default Collect;
