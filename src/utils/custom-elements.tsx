import {
  styled,
  TableCell,
  tableCellClasses,
  TableCellProps,
  Typography,
} from "@mui/material";

type styledTypographyType = {
  text: string | null;
  wrap?: boolean;
};

export const DarkThemeHeader = ({ text }: styledTypographyType) => {
  return (
    <Typography
      sx={{
        color: "var(--color-theme-dark)",
        fontSize: "var(--font-size-text-s)",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );
};
export const SecondaryText = ({ text, wrap }: styledTypographyType) => {
  return (
    <Typography
      sx={{
        color: "var(--color-secondary-gray)",
        fontSize: "var(--font-size-text-s)",
        whiteSpace: wrap ? "" : "nowrap",
      }}
    >
      {text}
    </Typography>
  );
};

export const SmallText: React.FC<any> = ({ children }) => {
  return (
    <Typography
      sx={{
        color: "var(--color-secondary-gray)",
        fontSize: "var(--font-size-text-xs)",
      }}
    >
      {children}
    </Typography>
  );
};

interface StyledTableCellProps extends TableCellProps {
  status?: "active" | "inactive" | "rejected";
}

export const FMUserTableCell = styled(TableCell)<StyledTableCellProps>(
  ({ theme, status }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--color-theme-dark)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.root}`]: {
      backgroundColor:
        status === "active"
          ? "green"
          : status === "inactive"
          ? "orange"
          : status === "rejected"
          ? "red"
          : "var(--color-theme-light",
      color: theme.palette.common.white,
      display: "flex",
      alignItems: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  })
);

export const FMEquipmentTableCell = styled(TableCell)<TableCellProps>(
  ({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--color-theme-dark)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.root}`]: {
      backgroundColor: "var(--color-theme-light",
      color: theme.palette.common.white,
      display: "flex",
      alignItems: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  })
);
