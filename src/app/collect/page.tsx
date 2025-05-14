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

const source = "github"; // ou "jira"

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

  return (
    <Box p={2}>
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
        <Button>Collect</Button>
      </Box>
    </Box>
  );
};

export default Collect;
