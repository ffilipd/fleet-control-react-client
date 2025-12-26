import { FMProfile } from "../../../../interfaces";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  TableCellProps,
  CheckboxProps,
} from "@mui/material";
import { FMUserTableCell as StyledTableCell } from "../../../../utils/custom-elements";
import { StyledTableRow } from "../../../../utils/styled";
import { useTranslation } from "react-i18next";

interface UserTableRowProps {
  row: FMProfile;
  handleDeleteUserClick: () => void;
  setSelectedUser: (user: FMProfile) => void;
  handleClickUserRow: (user: FMProfile) => void;
}

export const UserTableRow = (props: UserTableRowProps) => {
  const { row, handleClickUserRow, setSelectedUser, handleDeleteUserClick } =
    props;
  const { created_date, name, email, rejected, active, role, last_login } = row;
  const rowItems = [
    { text: created_date, align: "left" },
    { text: name, align: "left" },
    { text: email, align: "left" },
    {
      text: rejected ? "Rejected" : active ? "Active" : "Inactive",
      align: "left",
    },
    { text: role, align: "left" },
    { text: last_login, align: "left" },
  ];

  const rejectedIndex = 3;

  return (
    <StyledTableRow
      className="hover-highlight"
      sx={{
        "& > *": { borderBottom: "unset" },
        cursor: "pointer",
      }}
      onClick={() => handleClickUserRow(row)}
      // onMouseOver={() => handleMouseOverRow(row)}
    >
      {rowItems.map((item, i) => {
        return (
          <StyledTableCell
            key={i}
            align={item.align as TableCellProps["align"]}
          >
            {i === rejectedIndex ? (
              <StatusChip
                status={
                  rejected ? "Rejected" : row.active ? "Active" : "Inactive"
                }
              />
            ) : (
              item.text
            )}
          </StyledTableCell>
        );
      })}
      <StyledTableCell align="right" className="delete-icon-cell">
        <DeleteOutlineOutlinedIcon
          sx={{ cursor: "pointer", "&:hover": { color: "red", scale: 1.2 } }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setSelectedUser(row);
            handleDeleteUserClick();
          }}
        />
      </StyledTableCell>
    </StyledTableRow>
  );
};

const StatusChip: React.FC<{
  status: "Active" | "Inactive" | "Rejected" | "default";
}> = ({ status }) => {
  const getColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "orange";
      case "Rejected":
        return "red";
      default:
        return "var(--color-theme-light)";
    }
  };

  return (
    <Chip
      label={status}
      style={{
        backgroundColor: getColor(status),
        color: "white",
        width: "100%",
      }}
    />
  );
};

interface UserStaticCheckBoxesProps {
  user: FMProfile | null;
  onChange: (e: React.SyntheticEvent<Element, Event>) => void;
  selectedUser?: FMProfile;
}

export const UserStaticCheckBoxes = (props: UserStaticCheckBoxesProps) => {
  const { user, selectedUser, onChange } = props;
  const { t } = useTranslation();
  const staticItems = [
    { label: "Active", color: "success", key: "active" },
    { label: "Rejected", color: "error", key: "rejected" },
  ];

  return (
    <FormGroup sx={{ margin: "20px 0 0 0" }}>
      {staticItems.map((item, i) => {
        return (
          <FormControlLabel
            control={<Checkbox color={item.color as CheckboxProps["color"]} />}
            label={t(item.label)}
            name={item.key}
            checked={
              !!(selectedUser
                ? selectedUser[item.key as keyof FMProfile]
                : false)
            }
            key={i}
            disabled={user?.role !== "admin"}
            onChange={(e) => onChange(e)}
          />
        );
      })}
    </FormGroup>
  );
};
