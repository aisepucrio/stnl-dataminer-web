
import React from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ModalCodeBlockProps {
  open: boolean;
  onClose: () => void;
  code: object | string;
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

const ModalCodeBlock: React.FC<ModalCodeBlockProps> = ({ open, onClose, code }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-code-block-title">
      <Box sx={{ ...style, position: 'relative', paddingTop: 5 }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            background: 'background.paper',
            boxShadow: 1,
            '&:hover': { background: 'background.default' },
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', borderRadius: 1, background: '#222', mt: 1 }}>
          <SyntaxHighlighter language="json" style={materialDark} customStyle={{ margin: 0, background: 'transparent' }}>
            {(() => {
              let jsonString = typeof code === 'string' ? code : JSON.stringify(code, null, 2);
              try {
                const parsed = JSON.parse(jsonString);
                return JSON.stringify(parsed, null, 2);
              } catch {
                return jsonString;
              }
            })()}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCodeBlock;
