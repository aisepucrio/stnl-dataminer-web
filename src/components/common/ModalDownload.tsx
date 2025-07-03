import {
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ModalDownloadProps {
  open: boolean;
  onClose: () => void;
  source: string;
  section: string;
  // onDownload: (format: string) => void;
}

interface Payload {
  format: string;
  table?: string;
  data_type?: string;
}

const ModalDownload = ({
  open,
  onClose,
  source,
  section,
}: ModalDownloadProps) => {
  const [format, setFormat] = useState<string>("json");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const download = () => {
    const endpoint = `${apiUrl}/api/${source}/export/`;
    const payload: Payload = { format };

    if (section === "commits") {
      payload.table = "githubcommit";
    } else if (section === "issues") {
      payload.table = "githubissuepullrequest";
      payload.data_type = "issue";
    } else if (section === "pull-requests") {
      payload.table = "githubissuepullrequest";
      payload.data_type = "pull_request";
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "download.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Erro ao fazer download:", err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "557px",
          height: "176px",
          bgcolor: "background.paper",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Format:</Typography>
          <Select
            sx={{ width: "100%" }}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            size="small"
          >
            {/* <MenuItem value="csv">CSV</MenuItem> */}
            <MenuItem value="json">JSON</MenuItem>
          </Select>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => download()}>
            Download
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDownload;
