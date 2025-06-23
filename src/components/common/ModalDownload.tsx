import { Box, Modal, Button, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

interface ModalDownloadProps {
  open: boolean;
  onClose: () => void;
  onDownload: (format: string) => void;
}

const ModalDownload = ({ open, onClose, onDownload }: ModalDownloadProps) => {
  const [format, setFormat] = useState<string>(".CSV");

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "557px",
          height: "176px",
          bgcolor: "background.paper",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
          mx: "auto",
          my: "20vh",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Format:</Typography>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            size="small"
          >
            <MenuItem value=".CSV">.CSV</MenuItem>
            <MenuItem value=".JSON">.JSON</MenuItem>
          </Select>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => onDownload(format)}>
            Download
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDownload;
