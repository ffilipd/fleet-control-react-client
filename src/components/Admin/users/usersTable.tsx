import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableCellProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  Icon,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FMProfile, UserRole } from "../../../interfaces";
import { useTranslation } from "react-i18next";
// @ts-ignore: allow CSS side-effect import without type declarations
import "../mytable.css";
import TablePaginationActions from "../../Pagination";
import { dummyUser } from "../../../utils/dummy-data";
import { useEquipment } from "../../../EquipmentContext";
import { FMUserTableCell as StyledTableCell } from "../../../utils/custom-elements";
import FmDialog from "../../../utils/dialog";
import { UserTableRow } from "./utils/user-table";
import { StyledTableRow } from "../../../utils/styled";
import { useUser } from "../../../UserContext";
import { deleteUser } from "../../../service/user.service";
import UsersDialog from "./utils/users-dialog";
import { RiSearchLine } from "react-icons/ri";
const SearchIcon = RiSearchLine as unknown as React.ComponentType;

interface UsersProps {
  users: FMProfile[];
  isMobile: boolean;
  fetchUsers: () => Promise<void>;
}

const UsersTable = (props: UsersProps) => {
  const { isMobile, users, fetchUsers } = props;
  const { user } = useUser();
  const { t } = useTranslation();
  const { equipmentTypes, getEquipmentNames } = useEquipment();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FMProfile>(dummyUser);
  const userRoles: UserRole[] = ["admin", "user", "moderator"];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<FMProfile[]>([]);
  const [usersFilter, setUsersFilter] = useState<{
    role: string[];
    search: string;
  }>({
    role: [],
    search: "",
  });

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (users ? users.length : 0))
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickUserRow = (user: FMProfile) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const closeUserDetailsDialog = () => {
    setShowUserDetails(false);
    fetchUsers();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteUserClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    const res = await deleteUser(selectedUser.id as keyof FMProfile);
    setDeleteDialogOpen(false);
    alert(res);
    closeUserDetailsDialog();
  };

  const TableHeaderItems = [
    { text: t("Created"), align: "left" },
    { text: t("Name"), align: "left" },
    { text: t("Email"), align: "left" },
    { text: t("Status"), align: "left" },
    { text: t("Role"), align: "left" },
    { text: t("Last seen"), align: "left" },
    { text: "", align: "right" },
  ];

  const roles = ["admin", "user", "moderator"];

  const onFreeSearch = (value: string | null) => {
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value?.toLowerCase() ?? "") ||
        user.email.toLowerCase().includes(value?.toLowerCase() ?? "")
    );
    setFilteredUsers(results);
  };

  const onFilterByRole = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
    if (value.length === 0) {
      setFilteredUsers(users);
      setUsersFilter({ ...usersFilter, role: value });
      return;
    }
    setUsersFilter({ ...usersFilter, role: value });
    const results = users.filter((user) => value.includes(user.role));
    setFilteredUsers(results);
  };

  return (
    <React.Fragment>
      <Box
        id="equipment-filter-element"
        sx={{
          display: "grid",
          flexDirection: "row",
          gridTemplateColumns: "3fr 3fr",
          marginBottom: "15px",
          justifyContent: "bottom",
          alignItems: "center",
          gap: "30px",
          width: "100%",
        }}
      >
        <FormControl variant="standard" className="name-filter-form">
          <Autocomplete
            freeSolo
            options={users
              .map((option) => option.name)
              .concat(users.map((option) => option.email))
              .sort()}
            autoSelect
            onChange={(e, value) => onFreeSearch(value)}
            renderInput={(params) => (
              <>
                <TextField
                  sx={{
                    borderRadius: "20px",
                    border: "1px solid var(--color-secondary-gray)",
                    padding: "2px 0 0 10px",
                    boxShadow: "1px 2px 2px var(--color-secondary-gray)",
                    width: "100%",
                  }}
                  {...params}
                  // label={"Free search..."}
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    type: "search",
                    placeholder: "Free search...",
                    startAdornment: (
                      <Icon
                        color="action"
                        sx={{ marginLeft: "0", marginRight: "5px" }}
                      >
                        <SearchIcon />
                      </Icon>
                    ),
                  }}
                />
              </>
            )}
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ marginBottom: "14px" }}
          className="role-filter-form"
        >
          <InputLabel htmlFor="role-filter" sx={{ padding: "2px 0 0 15px" }}>
            {t("Filter by role...")}
          </InputLabel>
          <Select
            sx={{
              borderRadius: "20px",
              border: "1px solid var(--color-secondary-gray)",
              padding: "2px 0 0 10px",
              boxShadow: "1px 2px 2px var(--color-secondary-gray)",
            }}
            labelId="role-filter"
            id="role-filter-select"
            multiple
            disableUnderline
            value={usersFilter.role}
            onChange={(e) => onFilterByRole(e)}
            renderValue={(selected) => selected.join(", ")}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box id="my-page-table-wrapper">
        <TableContainer id="my-table-container">
          <Table>
            <TableHead>
              <StyledTableRow>
                {!isMobile && (
                  <>
                    {TableHeaderItems.map((item, i) => (
                      <StyledTableCell
                        key={i}
                        align={item.align as TableCellProps["align"]}
                      >
                        {item.text}
                      </StyledTableCell>
                    ))}
                  </>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody id="my-table-body">
              {!isMobile &&
                (rowsPerPage > 0
                  ? filteredUsers?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredUsers
                ).map((row, i) => (
                  <React.Fragment key={`${row.id}-${row.name}-${i}`}>
                    <UserTableRow
                      row={row}
                      handleDeleteUserClick={handleDeleteUserClick}
                      setSelectedUser={setSelectedUser}
                      handleClickUserRow={handleClickUserRow}
                    />
                  </React.Fragment>
                ))}
            </TableBody>
            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 44 * emptyRows }}>
                <StyledTableCell colSpan={6} />
              </StyledTableRow>
            )}
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  id="my-table-pagination"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={11}
                  width={"100%"}
                  count={filteredUsers ? filteredUsers.length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>

      {/* users dialog */}
      <UsersDialog
        showUserDetails={showUserDetails}
        closeUserDetailsDialog={closeUserDetailsDialog}
        handleDeleteUserClick={handleDeleteUserClick}
        setSelectedUser={setSelectedUser}
        user={user ?? null}
        userRoles={userRoles}
        equipmentTypes={equipmentTypes}
        getEquipmentNames={getEquipmentNames}
        selectedUser={selectedUser}
      />
      <FmDialog
        onDialogOpen={deleteDialogOpen}
        onDialogClose={handleCloseDeleteDialog}
        onHandleAction={handleDeleteUser}
        props={{
          title: t("Delete user"),
          description:
            t("Are you sure you want to delete user ") +
            selectedUser.name +
            "?",
          action: t("Delete"),
        }}
      />
    </React.Fragment>
  );
};

export default UsersTable;
