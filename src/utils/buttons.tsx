import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

// export const FmDeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
//   // color: "#960606",
//   fontSize: "large",
//   fontFamily: "Oxanium",
//   "&:hover": {
//     color: "#de0404",
//   },
// }));

export const FmBinIcon = (props: any) => {
  return (
    <DeleteOutlineOutlinedIcon
      {...props}
      sx={{ cursor: "pointer", "&:hover": { color: "red", scale: 1.2 } }}
    />
  );
};

export const FmButton = styled(Button)<ButtonProps>(({ theme }) => ({
  variant: "outlined",
  border: "none",
  color: "#fff",
  padding: "8px",
  borderRadius: "0",
  fontFamily: "Oxanium",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));

export const FmButton2 = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "1px 2px 2px var(--color-secondary-gray)",
  variant: "outlined",
  border: "none",
  backgroundColor: "#104462",
  color: "#fff",
  padding: "8px 40px",
  borderRadius: "23px",
  margin: "5px",
  height: "46px",
  fontSize: "large",
  fontFamily: "Oxanium",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: "#1b70a1",
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));

export const FmButtonDanger = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "1px 2px 2px var(--color-secondary-gray)",
  variant: "outlined",
  border: "none",
  backgroundColor: "#960606",
  color: "#fff",
  padding: "8px 40px",
  borderRadius: "23px",
  margin: "5px",
  height: "46px",
  fontSize: "large",
  fontFamily: "Oxanium",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: "#de0404",
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));

export const FmButtonSecondary = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "1px 2px 2px var(--color-secondary-gray)",
  variant: "outlined",
  border: "none",
  background:
    "radial-gradient(circle, rgba(16,68,98,1) 0%, rgba(5,54,84,0.7455182756696428) 100%)",
  color: "#fff",
  padding: "8px",
  borderRadius: "100%",
  height: "66px",
  aspectRatio: 1 / 1,
  fontFamily: "Oxanium",
  fontSize: "large",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: "#003865",
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));

export const FmButtonCube = styled(Button)<ButtonProps>(({ theme }) => ({
  variant: "outlined",
  border: "none",
  background:
    "linear-gradient(166deg, rgba(16,68,98,0.5522409647452731) 0%, rgba(5,54,84,1) 100%)",
  color: "#fff",
  padding: "8px",
  borderRadius: "38px",
  aspectRatio: 1 / 1,
  fontSize: "large",
  fontFamily: "Oxanium",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: "#003865",
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));
