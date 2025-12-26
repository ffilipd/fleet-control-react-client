import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import i18next from "i18next";
// @ts-ignore: Ignore side-effect import for CSS without type declarations
import "./booking.css";
import { useEffect, useState } from "react";
import { getEquipmentFilters } from "../../service/equipment.service";
import { addBooking, getBookings } from "../../service/booking.service";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";
import {
  DatePicker,
  TimePicker,
  MultiSectionDigitalClock,
  renderTimeViewClock,
  TimeClock,
} from "@mui/x-date-pickers";
import { FmButton2 } from "../../utils/buttons";
import BookingTable from "./Table";
import { Booking, NewBooking } from "../../interfaces";
import { useUser } from "../../UserContext";
import MobileBooking from "./mobile";
import FmCalendar from "../../utils/calendar/calendar";
import { useAlert } from "../../AlertContext";

dayjs.extend(customParseFormat);
const roundedTime = (time: Dayjs): Dayjs => {
  return time.minute() > 30
    ? time.startOf("hour").add(30, "minutes")
    : time.startOf("hour").add(0, "minutes");
};

const BookingComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const accessTypes = user?.access?.split(",") || [];
  const { showAlert } = useAlert();
  // const equipmentTypes = getEquipmentTypes();
  const labels = {
    equipment: {
      type: "*" + i18next.t("Type"),
      name: "*" + i18next.t("Name"),
      identifier: "*" + i18next.t("Number"),
    },
  };
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<{
    fromTime: Dayjs | null;
    toTime: Dayjs | null;
  }>({
    fromTime: roundedTime(dayjs().add(0, "hour")),
    toTime: roundedTime(dayjs().add(1, "hour")),
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

  const [bookings, setBookings] = useState<Booking[] | null>([]);

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
    if (types.length === 0) {
      showAlert({
        severity: "error",
        message: t("No equipment available"),
      });
    }
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
      equipmentNameId: selectedEquipment.equipmentNameId,
      equipment_type: selectedEquipment.type,
      equipmentId: selectedEquipment.identifier,
      date: selectedDate?.format("DD-MM-YYYY") || "",
      time_from: selectedTime.fromTime?.format("HH:mm") || "",
      time_to: selectedTime.toTime?.format("HH:mm") || "",
      usage: "booking",
      userId: user.id,
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
      if (res) {
        showAlert({
          severity: res.includes("added") ? "success" : "error",
          message: res,
        });
        fetchBookings();
        setSelectedEquipment({ ...selectedEquipment, identifier: "" });
      }
    } catch (error) {
      if (error instanceof Error) {
        showAlert({ severity: "error", message: error.message });
      } else {
        showAlert({ severity: "error", message: String(error) });
      }
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

  return (
    <>
      <Box id="booking-header">{t("Book equipment")}</Box>
      <Divider />
      <Box id="booking-wrapper">
        <Box id="booking-container">
          {/* Calendar */}
          <Box id="calendar-box">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isMobile ? (
                <DatePicker
                  format="DD-MM-YYYY"
                  value={selectedDate}
                  sx={{ borderRadius: "8px" }}
                  label={t("Select Date")}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              ) : (
                <>
                  <Typography className="label">{t("Select Date")}</Typography>
                  <FmCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                  />
                </>
              )}
            </LocalizationProvider>
          </Box>
          {!isMobile && (
            <Button
              variant="outlined"
              id="clear-selections-button"
              onClick={handleClearSelections}
            >
              {t("Clear Selections")}
            </Button>
          )}
          <Box id="time-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <TimePicker
                  className="time"
                  value={selectedTime.fromTime}
                  ampm={false}
                  sx={{ paddingRight: "4px" }}
                  minutesStep={30}
                  label={"*" + t("From")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                  onChange={handleSetTimeFrom}
                />
              </Box>
              <Box>
                <TimePicker
                  className="time"
                  value={selectedTime.toTime}
                  sx={{ paddingLeft: "4px" }}
                  ampm={false}
                  minutesStep={30}
                  label={"*" + t("To")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                  onChange={handleSetTimeTo}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          {false ? (
            <MobileBooking />
          ) : (
            <Box id="select-box">
              {/* TYPE */}
              <FormControl fullWidth className="booking-select-item">
                <InputLabel id="equipment-type">
                  {labels.equipment.type}
                </InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-type-label"
                  id="equipment-type"
                  label={labels.equipment.type}
                  // value={labels.equipment.type}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetType(e.target.value);
                  }}
                >
                  {availableEquipment.types?.map(
                    (type: string, index: number) => (
                      <MenuItem
                        key={`${type}-${index}`}
                        value={type}
                        disabled={
                          user?.role !== "admin" &&
                          !user?.access?.includes(type)
                        }
                      >
                        {type}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* CLASS/NAME */}
              <FormControl fullWidth className="booking-select-item">
                <InputLabel id="equipment-name">
                  {labels.equipment.name}
                </InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-name-label"
                  disabled={selectedEquipment.type === ""}
                  id="equipment-name"
                  label={labels.equipment.name}
                  value={selectedEquipment.equipmentNameId}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetName(e.target.value);
                  }}
                >
                  {availableEquipment.names.map((name) => (
                    <MenuItem
                      key={name.id}
                      value={name.id}
                      disabled={
                        !user?.access?.includes(name.name) &&
                        user?.role !== "admin"
                      }
                    >
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* EQUIPMENT NUMBER */}

              <FormControl fullWidth className="booking-select-item">
                <InputLabel id="equipment-nbr">
                  {labels.equipment.identifier}
                </InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-nbr-label"
                  disabled={selectedEquipment.equipmentNameId === ""}
                  id="equipment-nbr"
                  label={labels.equipment.identifier}
                  value={selectedEquipment.identifier}
                  onChange={(e: SelectChangeEvent) => {
                    setSelectedEquipment({
                      ...selectedEquipment,
                      identifier: e.target.value,
                    });
                  }}
                >
                  {availableEquipment.identifiers.map((identifier) => (
                    <MenuItem
                      key={identifier.id}
                      value={identifier.id}
                      disabled={bookings?.some(
                        (booking) => booking.equipmentId === identifier.id
                      )}
                    >
                      {identifier.identifier}
                      {bookings?.some(
                        (booking) => booking.equipmentId === identifier.id
                      ) && <i> - {t("booked")}</i>}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FmButton2
                id={!bookingFilledOut() ? "disabled-button" : "book-button"}
                disabled={!bookingFilledOut()}
                onClick={handleBookEquipmentClick}
              >
                {t("Book")}
              </FmButton2>
            </Box>
          )}
        </Box>
        <BookingTable
          bookings={bookings}
          setBookings={setBookings}
          isMobile={isMobile}
          labels={labels}
          availableTypes={availableEquipment.types}
        />
      </Box>
    </>
  );
};

export default BookingComponent;
