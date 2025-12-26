import { Box } from "@mui/material";

interface InnerProps {
  children: React.ReactNode;
}

const Inner: React.FC<InnerProps> = ({ children }) => {
  return (
    <Box id="body-inner">
      <Box id="body-root">{children}</Box>
    </Box>
  );
};

export default Inner;
