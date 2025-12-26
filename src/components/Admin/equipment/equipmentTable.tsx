import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TableSortLabel,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import React, { useEffect, useState } from "react";
import { Equipment, FMProfile, UserRole } from "../../../interfaces";
import { useTranslation } from "react-i18next";
import "../mytable.css";
import TablePaginationActions from "../../Pagination";
import { updateUserProfile, deleteUser } from "../../../service/user.service";
import { dummyUser } from "../../../utils/dummy-data";
import { useEquipment } from "../../../EquipmentContext";
import { FMEquipmentTableCell } from "../../../utils/custom-elements";
import { StyledTableRow } from "../../../utils/styled";
import { FmBinIcon } from "../../../utils/buttons";

interface EquipmentProps {
  equipment: Equipment[] | null;
  getEquipment: () => Promise<Equipment[]> | null;
  isMobile: boolean;
  handleRemoveEquipmentClick: (id: string) => void;
}

const EquipmentTable = (props: EquipmentProps) => {
  const { isMobile, getEquipment, handleRemoveEquipmentClick } = props;
  const { t } = useTranslation();
  const { equipmentTypes, equipmentNames } = useEquipment();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [equipmentFilter, setEquipmentFilter] = useState<any>({
    type: [],
    name: [],
  });

  const [equipment, setEquipment] = useState<Equipment[] | null>(null);
  const [filteredEquipment, setFilteredEquipment] = useState<
    Equipment[] | null
  >(null);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage -
            (filteredEquipment ? filteredEquipment.length : 0)
        )
      : 0;

  useEffect(() => {
    async function fetchData() {
      if (!equipment) {
        const fetchedEquipment = await getEquipment();
        if (fetchedEquipment) {
          const simplifiedEquipment = fetchedEquipment.map((item) => {
            return {
              id: item.id,
              type: item.equipment_name.equipment_type.name,
              name: item.equipment_name.name,
              identifier: item.identifier,
            };
          });
          setEquipment(simplifiedEquipment);
          setFilteredEquipment(simplifiedEquipment);
        }
      }
    }
    fetchData();
  }, [equipment, getEquipment]);

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

  const [orderBy, setOrderBy] = useState<string>("type");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const onSort = (type: string) => {
    if (orderBy === type) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(type);
      setOrder("asc");
    }
    if (filteredEquipment) {
      setEquipment(
        filteredEquipment.sort((a, b) => {
          if (order === "asc") {
            if (type === "identifier") {
              return (
                parseInt(a.identifier as unknown as string, 10) -
                parseInt(b.identifier as unknown as string, 10)
              );
            }
            return a[type as keyof Equipment] < b[type as keyof Equipment]
              ? -1
              : 1;
          } else {
            if (type === "identifier") {
              return (
                parseInt(b.identifier as unknown as string, 10) -
                parseInt(a.identifier as unknown as string, 10)
              );
            }
            return a[type as keyof Equipment] > b[type as keyof Equipment]
              ? -1
              : 1;
          }
        })
      );
    }
  };

  const handleFilterSelect = (
    event: SelectChangeEvent<string>,
    item: string
  ) => {
    const value = event.target.value as unknown as string[];
    setEquipmentFilter({ ...equipmentFilter, [item]: value });
    const filtered =
      equipment?.filter((equipment) => {
        return (
          (value.length === 0 || value.includes(String(equipment[item]))) &&
          (equipmentFilter.name.length === 0 ||
            equipmentFilter.name.includes(equipment.name) ||
            equipmentFilter.type.length === 0 ||
            equipmentFilter.type.includes(equipment.type))
        );
      }) || null;
    setFilteredEquipment(filtered);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        id="equipment-filter-element"
        sx={{
          display: "grid",
          flexDirection: "row",
          gridTemplateColumns: "0.5fr 3fr 3fr",
          marginBottom: "15px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <InputLabel sx={{ margin: "15px 0 0 0", fontSize: "1.2em" }}>
          {t("Filter: ")}
        </InputLabel>
        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Type")}
          </InputLabel>
          <Select
            sx={{
              borderRadius: "20px",
              border: "1px solid var(--color-secondary-gray)",
              padding: "2px 0 0 10px",
              boxShadow: "1px 2px 2px var(--color-secondary-gray)",
            }}
            labelId="type-filter"
            id="type-filter-select"
            multiple
            disableUnderline
            value={equipmentFilter.type}
            onChange={(e) => handleFilterSelect(e, "type")}
          >
            {equipmentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" className="name-filter-form">
          <InputLabel htmlFor="name-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Name")}
          </InputLabel>
          <Select
            sx={{
              borderRadius: "20px",
              border: "1px solid var(--color-secondary-gray)",
              padding: "2px 0 0 10px",
              boxShadow: "1px 2px 2px var(--color-secondary-gray)",
            }}
            disableUnderline
            labelId="name-filter"
            id="name-filter-select"
            multiple
            value={equipmentFilter.name}
            onChange={(e) => handleFilterSelect(e, "name")}
          >
            {equipmentNames?.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box id="my-page-table-wrapper">
        {/* <Typography className="label">
          {t("Booking and report history")}
        </Typography> */}
        <TableContainer id="my-table-container">
          <Table size="small">
            <TableHead sx={{ backgroundColor: "var(--color-theme-dark)" }}>
              <StyledTableRow>
                {isMobile ? (
                  <>
                    <FMEquipmentTableCell sortDirection={"asc"} align="left">
                      {t("Date")}
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell align="left">
                      {t("Name")}
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell align="left">
                      {t("Number")}
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell></FMEquipmentTableCell>
                  </>
                ) : (
                  <>
                    <FMEquipmentTableCell align="left" key={"type"}>
                      <TableSortLabel
                        // active={true}
                        direction={orderBy === "type" ? order : "asc"}
                        onClick={() => onSort("type")}
                      >
                        {t("Type")}
                      </TableSortLabel>
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell align="left">
                      <TableSortLabel
                        // active={true}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => onSort("name")}
                      >
                        {t("Name")}
                      </TableSortLabel>
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell align="left">
                      <TableSortLabel
                        // active={true}
                        direction={orderBy === "identifier" ? order : "asc"}
                        onClick={() => onSort("identifier")}
                      >
                        {t("Number / Identifier")}
                      </TableSortLabel>
                    </FMEquipmentTableCell>
                    <FMEquipmentTableCell />
                  </>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody id="my-table-body">
              {!isMobile &&
                filteredEquipment &&
                (rowsPerPage > 0
                  ? filteredEquipment.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredEquipment
                ).map((row, i) => (
                  <React.Fragment key={`${row.id}-${row.name}-${i}`}>
                    <StyledTableRow
                      className="hover-highlight"
                      sx={{
                        height: "44px",
                        "& > *": { borderBottom: "unset" },
                        cursor: "pointer",
                      }}
                      // onClick={() => handleClickUserRow(row)}
                      // onMouseOver={() => handleMouseOverRow(row)}
                    >
                      <FMEquipmentTableCell align="left">
                        {String(row.type)}
                      </FMEquipmentTableCell>
                      <FMEquipmentTableCell align="left">
                        {String(row.name)}
                      </FMEquipmentTableCell>
                      <FMEquipmentTableCell align="left">
                        {String(row.identifier)}
                      </FMEquipmentTableCell>
                      <FMEquipmentTableCell
                        align="right"
                        className="delete-icon-cell"
                      >
                        <FmBinIcon
                          onClick={() =>
                            handleRemoveEquipmentClick(String(row.id))
                          }
                        />
                      </FMEquipmentTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 44 * emptyRows }}>
                  <FMEquipmentTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  id="my-table-pagination"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={11}
                  width={"100%"}
                  count={filteredEquipment ? filteredEquipment.length : 0}
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
    </Box>
  );
};

export default EquipmentTable;
