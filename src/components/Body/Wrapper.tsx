import { Box } from "@mui/material";
import "./body.css";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Box id="body-wrapper">{children}</Box>;
};

export default Wrapper;
