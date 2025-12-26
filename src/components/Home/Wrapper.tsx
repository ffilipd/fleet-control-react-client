import { Box } from "@mui/material";
import "./home.css";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Box id="home-wrapper">{children}</Box>;
};

export default Wrapper;
