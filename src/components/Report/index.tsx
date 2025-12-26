import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import "./report.css";
import { useEffect, useState } from "react";
import {
  Booking,
  DamageType,
  EquipmentFilterResponse,
  NewReport,
  Report,
} from "../../interfaces";
import { getBookings } from "../../service/booking.service";
import { getEquipmentFilters } from "../../service/equipment.service";
import { useTranslation } from "react-i18next";
import {
  LocalizationProvider,
  DatePicker,
  DateCalendar,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import i18next from "i18next";
import React from "react";
import { FmButton2 } from "../../utils/buttons";
import {
  addReport,
  getDamageTypes,
  getReportById,
  getReports,
} from "../../service/report.service";
import { useUser } from "../../UserContext";
import { CheckBox } from "@mui/icons-material";

const ReportComponent = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: { id: string; name: string }[];
    identifiers: { id: string; identifier: string }[];
  }>({
    types: [],
    names: [],
    identifiers: [],
  });

  const initialReportValues: NewReport = {
    bookingId: "",
    damageType: "",
    description: "",
  };
  const damageTypes: DamageType[] = ["major", "minor", "none", "other"];
  const [newReport, setNewReport] = useState<NewReport>(initialReportValues);
  const [newReportWithoutBooking, setNewReportWithoutBooking] = useState<{
    equipmentType: string;
    equipmentNameId: string;
    equipmentIdentifier: string;
  }>({
    equipmentType: "",
    equipmentNameId: "",
    equipmentIdentifier: "",
  });
  const [reportExistsNote, setReportExistsNote] = useState<boolean>(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false);
  const [yourBooking, setYourBooking] = useState<boolean>(false);
  const handleChangeYourBooking = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setYourBooking(event.target.checked);
  };
  const labels = {
    booking: i18next.t("Select booking"),
    damageType: i18next.t("Any damages?"),
    type: "*" + i18next.t("Equipment type"),
    name: "*" + i18next.t("Class / Name"),
    identifier: "*" + i18next.t("Number / Identifier"),
  };

  const handleSubmitDialogClose = () => {
    setSubmitDialogOpen(false);
  };
  const handleSubmitDialogOpen = () => {
    setSubmitDialogOpen(true);
  };
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

  const fetchBookings = async () => {
    if (!user) return;
    const bookingsData: Booking[] = await getBookings({
      userId: user.id,
      date: selectedDate?.format("DD-MM-YYYY"),
      usage: "report",
    });
    setBookings(bookingsData);
  };

  const handleSelectDate = (newDate: Dayjs | null) => {
    setSelectedBookingId("");
    setSelectedDate(newDate);
  };

  const handleSelectBooking = async (bookingId: string) => {
    const reportExists = await getReportById(bookingId);
    if (reportExists && bookingId !== "no-booking") {
      return setReportExistsNote(true);
    }
    if (bookingId === "no-booking") {
      setNewReport({ ...newReport, bookingId: null });
      return setSelectedBookingId(bookingId);
    } else {
      setReportExistsNote(false);
      setNewReport({ ...newReport, bookingId: bookingId });
      setSelectedBookingId(bookingId);
    }
  };

  const handleSelectDamageType = (damageType: string): void => {
    setNewReport({ ...newReport, damageType });
  };

  const setFilterTypes = async () => {
    const types = (await getFilters()) as string[];
    setAvailableEquipment({ ...availableEquipment, types });
  };

  const handleSetEquipmentType = async (equipmentType: string) => {
    setNewReportWithoutBooking({
      ...newReportWithoutBooking,
      equipmentType,
      equipmentNameId: "",
      equipmentIdentifier: "",
    });
    const names = (await getFilters({
      type: equipmentType,
    })) as { id: string; name: string }[];
    setAvailableEquipment({ ...availableEquipment, names });
  };

  const handleSetEquipmentName = async (equipmentNameId: string) => {
    setNewReportWithoutBooking({
      ...newReportWithoutBooking,
      equipmentNameId,
      equipmentIdentifier: "",
    });
    const identifiers = (await getFilters({
      type: newReportWithoutBooking.equipmentType,
      equipmentNameId: equipmentNameId,
    })) as {
      id: string;
      identifier: string;
    }[];
    setAvailableEquipment({ ...availableEquipment, identifiers });
  };

  const handleSetEquipmentIdentifier = (equipmentId: string) => {
    setNewReportWithoutBooking({
      ...newReportWithoutBooking,
      equipmentIdentifier: equipmentId,
    });
  };

  const reportFilledOut = (): boolean => {
    const { bookingId, damageType, description } = newReport;
    if (bookingId !== "no-booking") {
      if (damageType === "none") return true;
      if (damageType !== "none" && description) return true;
    }
    const { equipmentNameId, equipmentIdentifier, equipmentType } =
      newReportWithoutBooking;
    if (bookingId === "no-booking") {
      if (equipmentNameId && equipmentIdentifier && equipmentType) {
        if (damageType === "none") return true;
        if (damageType !== "none" && description) return true;
      }
    }
    return false;
  };

  const handleSubmitReportClick = async () => {
    if (selectedBookingId === "no-booking") {
      newReport.description = `no-booking-equipment-id=${newReportWithoutBooking.equipmentIdentifier}+${newReport.description}`;
    }
    try {
      await addReport(newReport);
      setNewReport(initialReportValues);
      setSelectedBookingId("");
      handleSubmitDialogOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const addDescription = (event: any) => {
    setNewReport({ ...newReport, description: event.target.value });
    console.log(event.target.value);
  };

  useEffect(() => {
    setFilterTypes();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, yourBooking]);
  return (
    <>
      <Box id="report-header">{t("Report Equipment Usage")}</Box>
      <Divider />
      <Box id="report-wrapper">
        <Box id="report-container">
          {/*<FormGroup id="your-booking-select">
            <FormControlLabel
              control={<Checkbox onChange={handleChangeYourBooking} />}
              label={t("I booked the equipment myself")}
            />
          </FormGroup>*/}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD-MM-YYYY"
              value={selectedDate}
              sx={{ borderRadius: "8px" }}
              label={t("Select date of booking / usage")}
              onChange={(newDate) => handleSelectDate(newDate)}
            />
          </LocalizationProvider>

          <FormControl fullWidth className="report-select-item">
            <InputLabel id="equipment-type">{labels.booking}</InputLabel>
            <Select
              className="report-select-button"
              labelId="equipment-type-label"
              id="report-booking-input"
              label={labels.booking}
              value={selectedBookingId ?? ""}
              onChange={(e: SelectChangeEvent) => {
                handleSelectBooking(e.target.value);
              }}
            >
              {bookings.map((booking: Booking) => (
                <MenuItem
                  id="report-booking-item"
                  key={booking.id}
                  value={booking.id}
                >
                  <Box>
                    {`${booking.equipment_name} #${booking.equipment_identifier}`}
                  </Box>
                  <Box>{`${booking.time_from}—${booking.time_to}`}</Box>
                </MenuItem>
              ))}
              <MenuItem
                sx={{ justifyContent: "space-around" }}
                id="report-booking-no-booking"
                key={"no-booking"}
                value={"no-booking"}
              >
                {t("––– I cannot find the booking –––")}
              </MenuItem>
            </Select>
          </FormControl>
          {reportExistsNote && (
            <Alert severity="warning" className="report-select-item">
              {t("A report for this booking already exists!")}
            </Alert>
          )}
          {selectedBookingId === "no-booking" && (
            <React.Fragment>
              {/* TYPE */}
              <Alert severity="info" className="report-select-item">
                {t("Please select the equipment you used!")}
              </Alert>
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-type">{labels.type}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-type-label"
                  id="equipment-type"
                  label={labels.type}
                  // value={newReport.type}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetEquipmentType(e.target.value);
                  }}
                >
                  {availableEquipment.types?.map(
                    (type: string, index: number) => (
                      <MenuItem key={`${type}-${index}`} value={type}>
                        {type}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* CLASS/NAME */}
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-name">{labels.name}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-name-label"
                  // disabled={newReport.type === ""}
                  id="equipment-name"
                  label={labels.name}
                  value={newReportWithoutBooking.equipmentNameId}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetEquipmentName(e.target.value);
                  }}
                >
                  {availableEquipment.names.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* EQUIPMENT NUMBER */}
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-nbr">{labels.identifier}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-nbr-label"
                  disabled={newReportWithoutBooking.equipmentNameId === ""}
                  id="equipment-nbr"
                  label={labels.identifier}
                  value={newReportWithoutBooking.equipmentIdentifier}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetEquipmentIdentifier(e.target.value);
                  }}
                >
                  {availableEquipment.identifiers.map((identifier) => (
                    <MenuItem key={identifier.id} value={identifier.id}>
                      {identifier.identifier}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </React.Fragment>
          )}
          <FormControl fullWidth className="report-select-item">
            <InputLabel>{labels.damageType}</InputLabel>
            <Select
              className="report-select-button"
              labelId="equipment-type-label"
              id="report-booking-input"
              label={labels.damageType}
              value={newReport.damageType}
              onChange={(e: SelectChangeEvent) => {
                handleSelectDamageType(e.target.value);
              }}
            >
              {damageTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type[0].toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {newReport.damageType === "other" ? (
            <Alert severity="info" className="report-select-item">
              {t("Please provide description!")}
            </Alert>
          ) : (
            (newReport.damageType === "major" ||
              newReport.damageType === "minor") && (
              <Alert severity="warning" className="report-select-item">
                {t("Description of the damage is mandatory!")}
              </Alert>
            )
          )}
          <TextField
            className="report-select-item"
            id="report-notes-textfield"
            label="Notes / Description"
            multiline
            rows={4}
            variant="outlined"
            value={newReport.description}
            onChange={addDescription}
          />
          <FmButton2
            id={
              !reportFilledOut()
                ? "submit-disabled-button"
                : "submit-report-button"
            }
            disabled={!reportFilledOut()}
            onClick={handleSubmitReportClick}
          >
            {t("Submit Report")}
          </FmButton2>
        </Box>
      </Box>
      <Dialog
        fullWidth
        open={submitDialogOpen}
        onClose={handleSubmitDialogClose}
      >
        <DialogTitle id="submit-dialog-title">
          {t("Report submited")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-dialog-description">
            {t("Thank you for the report!")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitDialogClose}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportComponent;
