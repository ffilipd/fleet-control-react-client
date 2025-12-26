import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
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

dayjs.extend(customParseFormat);
const roundedTime = (time: Dayjs): Dayjs => {
  return time.minute() > 30
    ? time.startOf("hour").add(30, "minutes")
    : time.startOf("hour").add(0, "minutes");
};

const MyBookingsComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
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

  const handleSetType = async (type: string) => {
    setSelectedEquipment({
      ...selectedEquipment,
      type,
      equipmentNameId: "",
      identifier: "",
    });
    const names = (await getFilters({ type })) as {
      id: string;
      name: string;
    }[];
    setAvailableEquipment({ ...availableEquipment, names });
  };

  const handleSetName = async (equipmentNameId: string) => {
    setSelectedEquipment({
      ...selectedEquipment,
      equipmentNameId,
      identifier: "",
    });
    const equipment = (await getFilters({
      type: selectedEquipment.type,
      equipmentNameId: equipmentNameId,
    })) as { id: string; identifier: string }[];
    setAvailableEquipment({ ...availableEquipment, identifiers: equipment });
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

  const handleClearSelections = (): void => {
    setSelectedEquipment({ equipmentNameId: "", type: "", identifier: "" });
    setSelectedTime({ ...selectedTime, fromTime: null, toTime: null });
  };

  const handleSetTimeFrom = (newTime: any) => {
    setSelectedTime({ ...selectedTime, fromTime: newTime });
  };
  const handleSetTimeTo = (newTime: any) => {
    setSelectedTime({ ...selectedTime, toTime: newTime });
  };

  const handleBookEquipmentClick = async () => {
    const { type, equipmentNameId, identifier } = selectedEquipment;
    const date = selectedDate?.format("DD-MM-YYYY").toString();
    const { fromTime, toTime } = selectedTime;
    const newBooking: NewBooking = {
      date,
      time_from: fromTime?.format("HH:mm").toString(),
      time_to: toTime?.format("HH:mm").toString(),
      userId: user?.id,
      equipmentId: identifier,
    };
    try {
      const res = await addBooking(newBooking);
      alert(res);
      fetchBookings();
      setSelectedEquipment({ ...selectedEquipment, identifier: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const bookingFilledOut = (): boolean => {
    if (
      selectedDate &&
      selectedTime.fromTime &&
      selectedTime.toTime &&
      selectedEquipment.type &&
      selectedEquipment.equipmentNameId &&
      selectedEquipment.identifier
    )
      return true;
    return false;
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

  return (
    <>
      <Box id="my-page-header">{t("My bookings and reports")}</Box>
      {/* <Divider /> */}
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
