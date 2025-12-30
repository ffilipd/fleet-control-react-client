import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import i18next from "i18next";
import "./mypage.css";
import { useEffect, useState } from "react";
import { getEquipmentFilters } from "../../service/equipment.service";
import {
  addBooking,
  deleteBooking,
  getBookings,
} from "../../service/booking.service";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";
import {
  DatePicker,
  MobileTimePicker,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { FmButton2 } from "../../utils/buttons";
import MyTable from "./Table";
import { Booking, NewBooking } from "../../interfaces";
import { useUser } from "../../UserContext";
import { useEquipment } from "../../EquipmentContext";
import users from "../Admin/users/users";
import { RiSearchLine } from "react-icons/ri";
const SearchIcon = RiSearchLine as unknown as React.ComponentType;

const uniqueItems = (
  bookings: Booking[],
  key: keyof Booking
): (keyof Booking)[] => {
  const items: (keyof Booking)[] = bookings
    .map((b) => b[key])
    .filter(Boolean) as unknown as (keyof Booking)[];
  return items.reduce((acc: (keyof Booking)[], item: keyof Booking) => {
    if (!acc.includes(item)) acc.push(item);
    return acc.sort();
  }, []);
};

dayjs.extend(customParseFormat);
const roundedTime = (time: Dayjs): Dayjs => {
  return time.minute() > 30
    ? time.startOf("hour").add(30, "minutes")
    : time.startOf("hour").add(0, "minutes");
};

const MyBookingsComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const {
    equipmentNames,
    equipmentTypes,
    // equipmentIdentifiers
  } = useEquipment();
  // const equipmentTypes = getEquipmentTypes();
  const labels = {
    equipment: {
      type: "*" + i18next.t("Equipment type"),
      name: "*" + i18next.t("Class / Name"),
      identifier: "*" + i18next.t("Number / Identifier"),
    },
  };
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<{
    fromTime: Dayjs | null;
    toTime: Dayjs | null;
  }>({
    fromTime: null,
    toTime: null,
  });

  const [selectedEquipment, setSelectedEquipment] = useState<{
    type: string;
    equipmentNameId: string;
    identifier: string;
  }>({ type: "", equipmentNameId: "", identifier: "" });

  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: { id: string; name: string }[];
    identifiers: { id: string; identifier: string }[];
  }>({
    types: [],
    names: [],
    identifiers: [],
  });

  const [bookingsFilter, setbookingsFilter] = useState<{
    dateFrom: string;
    dateTo: string;
    equipmentType: string;
    equipmentName: string;
    identifier: string; // Number
    userName: string;
    reported: boolean;
    damageType: string;
  }>({
    dateFrom: "",
    dateTo: "",
    equipmentType: "",
    equipmentName: "",
    identifier: "",
    userName: "",
    reported: false,
    damageType: "",
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const getFilters = async (params?: {
    type?: string;
    equipmentNameId?: string;
  }) => {
    try {
      const response = await getEquipmentFilters({
        type: params?.type,
        equipmentNameId: params?.equipmentNameId,
      });
      return response;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    setFilterTypes();
  }, []);

  const setFilterTypes = async () => {
    const types = (await getFilters()) as string[];
    setAvailableEquipment({ ...availableEquipment, types });
  };

  const fetchBookings = async () => {
    if (!user) return;
    const bookingsData: Booking[] = await getBookings({
      userId: user.id,
      equipmentNameId: selectedEquipment.equipmentNameId,
      equipment_type: selectedEquipment.type,
      equipmentId: selectedEquipment.identifier,
      date: selectedDate?.format("DD-MM-YYYY") || "",
      time_from: selectedTime.fromTime?.format("HH:mm") || "",
      time_to: selectedTime.toTime?.format("HH:mm") || "",
      usage: "edit",
    });
    setBookings(bookingsData);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedEquipment, selectedTime]);

  const handleEditBooking = (e: any) => {
    console.log("edit" + e);
  };
  const handleEditReport = (e: any) => {
    console.log("edit" + e);
  };

  const [deleteBookingDialogOpen, setDeleteBookingDialogOpen] =
    useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const handleOpenDeleteDialog = (bookingId: string) => {
    setDeleteBookingDialogOpen(true);
    if (bookingId) setBookingToDelete(bookingId);
  };
  const handleCloseDeleteDialog = () => setDeleteBookingDialogOpen(false);
  const handleDeleteBooking = async () => {
    if (bookingToDelete) {
      const message = await deleteBooking(bookingToDelete);
      alert(message);
      fetchBookings();
    }
    setDeleteBookingDialogOpen(false);
  };

  const [description, setDescription] = useState<string>("");
  const [descriptionDialogOpen, setDescriptionDialogOpen] =
    useState<boolean>(false);
  const handleCloseDescriptionDialog = () => {
    setDescriptionDialogOpen(false);
    setDescription("");
  };
  const openDescriptionDialog = (description: string) => {
    setDescription(description);
    setDescriptionDialogOpen(true);
  };

  const handleCreateReportNow = (bookingId: string) => {
    console.log(bookingId);
  };

  const onFreeSearch = (value: string | null) => {
    // const results = users.filter(
    //   (user) =>
    //     user.name.toLowerCase().includes(value?.toLowerCase() ?? "") ||
    //     user.email.toLowerCase().includes(value?.toLowerCase() ?? "")
    // );
    // setFilteredUsers(results);
  };

  return (
    <>
      <Box id="my-page-header">{t("My bookings and reports")}</Box>
      <Divider />
      <Box
        sx={{
          padding: "15px 0",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <InputLabel sx={{ fontSize: "1.2em" }}>{t("Filter: ")}</InputLabel>
        <FormControl
          variant="standard"
          className="booking-filter-search"
          sx={{ flexGrow: 1, paddingRight: "10px" }}
        >
          <Autocomplete
            freeSolo
            options={uniqueItems(bookings, "user_name")
              .concat(uniqueItems(bookings, "damage_type"))
              .concat(uniqueItems(bookings, "equipment_name"))
              .sort()}
            autoSelect
            // onChange={(e, value) => onFreeSearch(value)}
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
      </Box>

      <Box
        id="equipment-filter-element"
        sx={{
          display: "grid",
          flexDirection: "row",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          marginBottom: "15px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Date From")}
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
            value={bookingsFilter.dateFrom ? bookingsFilter.dateFrom : []}
            // onChange={(e) => handleFilterSelect(e, "dateFrom")}
          >
            {uniqueItems(bookings, "date").map((date, index) => (
              <MenuItem key={`date-from-${date}-${index}`} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Date To")}
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
            value={bookingsFilter.dateTo ? bookingsFilter.dateTo : []}
            // onChange={(e) => handleFilterSelect(e, "type")}
          >
            {uniqueItems(bookings, "date").map((date, index) => (
              <MenuItem key={`date-to-${date}-${index}`} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            value={
              bookingsFilter.equipmentType ? bookingsFilter.equipmentType : []
            }
            // onChange={(e) => handleFilterSelect(e, "type")}
          >
            {/* {uniqueItems(bookings, "equipment_name").map((name, index) => (
              <MenuItem key={`equipment-${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))} */}
            {equipmentTypes.map((name, index) => (
              <MenuItem key={`equipment-${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Name")}
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
            value={
              bookingsFilter.equipmentName ? bookingsFilter.equipmentName : []
            }
            // onChange={(e) => handleFilterSelect(e, "type")}
          >
            {/* {uniqueItems(bookings, "equipment_name").map((name, index) => (
              <MenuItem key={`equipment-${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))} */}
            {equipmentNames.map((name, index) => (
              <MenuItem key={`equipment-${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" className="name-filter-form">
          <InputLabel htmlFor="name-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Number")}
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
            value={bookingsFilter.identifier ? bookingsFilter.identifier : []}
            // onChange={(e) => handleFilterSelect(e, "name")}
          >
            {uniqueItems(bookings, "equipment_identifier").map(
              (number, index) => (
                <MenuItem key={`identifier-${number}-${index}`} value={number}>
                  {number}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <FormControl variant="standard" className="name-filter-form">
          <InputLabel htmlFor="name-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("User")}
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
            value={bookingsFilter.userName ? bookingsFilter.userName : []}
            // onChange={(e) => handleFilterSelect(e, "name")}
          >
            {uniqueItems(bookings, "user_name").map((name, index) => (
              <MenuItem key={`user-${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Report")}
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
            value={bookingsFilter.reported ? bookingsFilter.reported : []}
            // onChange={(e) => handleFilterSelect(e, "type")}
          >
            <MenuItem key={"Reported"} value={"Reported"}>
              {"Reported"}
            </MenuItem>
            <MenuItem key={"Empty"} value={"Empty"}>
              {"Empty"}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" className="type-filter-form">
          <InputLabel htmlFor="type-filter" sx={{ padding: "2px 0 0 10px" }}>
            {t("Damage Type")}
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
            value={bookingsFilter.damageType ? bookingsFilter.damageType : []}
            // onChange={(e) => handleFilterSelect(e, "type")}
          >
            {uniqueItems(bookings, "damage_type").map((type, index) => (
              <MenuItem key={`${type}-${index}`} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Box id="my-page-wrapper">
        <MyTable
          handleCreateReportNow={handleCreateReportNow}
          openDescriptionDialog={openDescriptionDialog}
          handleEditReport={handleEditReport}
          handleEditBooking={handleEditBooking}
          handleDeleteBooking={handleOpenDeleteDialog}
          bookings={bookings}
          setBookings={setBookings}
          isMobile={isMobile}
          labels={labels}
          availableTypes={availableEquipment.types}
        />
      </Box>
      <Dialog
        open={deleteBookingDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("Delete booking")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete booking?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} autoFocus>
            {t("Cancel")}
          </Button>
          <Button onClick={handleDeleteBooking}>{t("Delete")}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={descriptionDialogOpen}
        onClose={handleCloseDescriptionDialog}
      >
        <DialogTitle id="alert-dialog-title">
          {t("Description of damage report")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyBookingsComponent;
