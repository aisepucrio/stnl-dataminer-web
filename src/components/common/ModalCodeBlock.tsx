
import React from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ModalCodeBlockProps {
  open: boolean;
  onClose: () => void;
  code: object | string;
  title?: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  maxWidth: '80vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  outline: 'none',
};

const ModalCodeBlock: React.FC<ModalCodeBlockProps> = ({ open, onClose, code, title }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-code-block-title">
      <Box sx={style}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography id="modal-code-block-title" variant="h6" component="h2">
            {title || 'JSON Preview'}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', borderRadius: 1, background: '#222' }}>
          <SyntaxHighlighter language="json" style={materialDark} customStyle={{ margin: 0, background: 'transparent' }}>
            {typeof code === 'string' ? code : JSON.stringify(code, null, 2)}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCodeBlock;
