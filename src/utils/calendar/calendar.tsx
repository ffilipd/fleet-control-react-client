/*******************************************************************
 * FmCalendar uses DateCalendar to remap the dates from Sunday as  *
 * first day of week, to Monday as first day of week.              *
 *******************************************************************/
import { DateCalendar, DateCalendarProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

interface FmCalendarProps extends DateCalendarProps<Dayjs> {}

const FmCalendar: React.FC<FmCalendarProps> = ({ ...props }) => {
  const mapCalendar = () => {
    // Move the Sunday header element to the last position
    const headerElement = document.querySelector<HTMLDivElement>(
      ".MuiDayCalendar-header"
    );
    if (!headerElement) return;
    const sundayElement = headerElement.querySelector<HTMLDivElement>(
      '[aria-label="Sunday"]'
    );

    // fix weekday header
    if (sundayElement !== headerElement.lastChild && sundayElement) {
      headerElement.appendChild(sundayElement);
    }

    // Get month container
    const monthContainer = document.querySelector<HTMLDivElement>(
      ".MuiDayCalendar-monthContainer"
    );

    /** GUARD **/
    if (!monthContainer) return;

    // Get week containers
    const weeksContainers = document.querySelectorAll<HTMLDivElement>(
      ".MuiDayCalendar-weekContainer"
    );

    const daysInWeek: number = 7;

    const checkMappingDone = () => {
      // get index from first day from calendar
      const currentFirstDayIndex =
        daysInWeek - weeksContainers[0].querySelectorAll("button").length;
      // const gregorianFirstDayIndex =
      const monthYearElement = document.querySelector(
        ".MuiPickersCalendarHeader-label"
      );
      const monthYear: string | null = monthYearElement
        ? monthYearElement.textContent
        : null;
      const monthYearArray = monthYear?.split(" ");
      const gregorianFirstDayIndex = monthYearArray
        ? new Date(`${monthYearArray[0]} 1, ${monthYearArray[1]}`).getDay() - 1
        : null;
      const isMapped = gregorianFirstDayIndex === currentFirstDayIndex;
      return isMapped;
    };

    if (checkMappingDone()) return;

    // Query the day elements
    const days =
      monthContainer.querySelectorAll<HTMLButtonElement>("[data-timestamp]");

    if (weeksContainers) {
      const fillerDay = monthContainer.querySelector<HTMLDivElement>(
        ".MuiPickersDay-hiddenDaySpacingFiller"
      );

      let dayIndex = 0;

      // Convert NodeList to array and sort the buttons
      const sortedDays = Array.from(days).sort((a, b) => {
        const aText = parseInt(a.textContent || "0", 10);
        const bText = parseInt(b.textContent || "0", 10);
        return aText - bText;
      });

      weeksContainers.forEach((week: HTMLDivElement, index: number) => {
        if (!fillerDay) return;
        // handle first week
        if (index === 0) {
          // Calculate index for the first day
          let firstDayIndex: number =
            Array.from(week.children).findIndex(
              (day) => day instanceof HTMLButtonElement
            ) - 1;

          if (firstDayIndex < 0) firstDayIndex = 6;
          week.innerHTML = "";

          for (let i = 0; i < firstDayIndex; i++) {
            if (fillerDay) {
              week.appendChild(fillerDay.cloneNode(true));
            }
          }
          for (let i = firstDayIndex; i < daysInWeek; i++) {
            week.appendChild(sortedDays[dayIndex]);
            dayIndex++;
          }
          return;
        }

        // The rest of the weeks
        week.innerHTML = "";
        for (let i = 0; i < daysInWeek; i++) {
          if (dayIndex < days.length) {
            week.appendChild(sortedDays[dayIndex]);
            dayIndex++;
          } else {
            week.appendChild(fillerDay.cloneNode(true));
          }
        }
      });
    }
  };
  useEffect(() => {
    mapCalendar();
  }, []);

  const handleOnMonthChange = () => {
    // Set timeout to make sure the new month is loaded before mapping
    setTimeout(() => {
      mapCalendar();
    }, 0);
  };

  return (
    <DateCalendar
      {...props}
      fixedWeekNumber={6}
      onMonthChange={handleOnMonthChange}
      onYearChange={handleOnMonthChange}
    />
  );
};

export default FmCalendar;
