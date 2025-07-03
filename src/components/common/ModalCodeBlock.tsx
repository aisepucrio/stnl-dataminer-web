
import React from "react";
import { Modal, Box, IconButton, Typography, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  const [copied, setCopied] = React.useState(false);

  // Prepare the code string for display and copying
  const codeString = React.useMemo(() => {
    let jsonString = typeof code === 'string' ? code : JSON.stringify(code, null, 2);
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback or error handling could go here
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-code-block-title">
      <Box sx={{ ...style, position: 'relative', paddingTop: 5 }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
            maxWidth: 32,
            maxHeight: 32,
            borderRadius: 1,
            padding: 0,
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { background: 'rgba(0,0,0,0.04)' },
            '& .MuiTouchRipple-root': { borderRadius: 1 },
          }}
          disableRipple
          aria-label="close"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
        {/* Copy Button */}
        <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="left" arrow>
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 44,
              zIndex: 2,
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              maxWidth: 32,
              maxHeight: 32,
              borderRadius: 1,
              padding: 0,
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
              background: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { background: 'rgba(0,0,0,0.04)' },
              '& .MuiTouchRipple-root': { borderRadius: 1 },
            }}
            disableRipple
            aria-label="copy"
          >
            <ContentCopyIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', borderRadius: 1, background: '#222', mt: 1 }}>
          <SyntaxHighlighter language="json" style={materialDark} customStyle={{ margin: 0, background: 'transparent' }}>
            {codeString}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCodeBlock;
