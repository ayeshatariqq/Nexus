import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
  CalendarApi,
  EventChangeArg,
} from "@fullcalendar/core";
import { Meeting } from "../../types";

type MeetingCalendarProps = {
  /** Optional controlled list. If omitted, the component uses localStorage itself. */
  initialEvents?: Meeting[];
  /** Called when events change (add/edit/delete/status). */
  onEventsChange?: (events: Meeting[]) => void;
};

const LS_KEY = "events";

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  initialEvents,
  onEventsChange,
}) => {
  const [events, setEvents] = useState<Meeting[]>(() => {
    if (initialEvents) return initialEvents;
    const stored = localStorage.getItem(LS_KEY);
    return stored ? (JSON.parse(stored) as Meeting[]) : [];
  });

  // keep internal state in sync if parent passes a fresh initialEvents
  useEffect(() => {
    if (initialEvents) setEvents(initialEvents);
  }, [initialEvents]);

  // persist + lift state up
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(events));
    onEventsChange?.(events);
  }, [events, onEventsChange]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = window.prompt("Enter meeting title:");
    const calendarApi: CalendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent: Meeting = {
        id: String(Date.now()),
        title,
        // use ISO strings for consistency
        start: selectInfo.startStr,
        end: selectInfo.endStr ?? undefined,
        allDay: selectInfo.allDay,
        status: "pending",
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const current = events.find((e) => e.id === eventId);
    if (!current) return;

    if (current.status === "pending") {
      const action = window.prompt(
        `Meeting: ${current.title}\nType one: accept / decline / delete`
      );
      if (!action) return;
      const val = action.toLowerCase().trim();

      if (val === "accept") {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: "accepted" } : e))
        );
      } else if (val === "decline") {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: "declined" } : e))
        );
      } else if (val === "delete") {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    } else {
      const ok = window.confirm(`Delete '${current.title}'?`);
      if (ok) setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
  };

  // drag/resize to modify a slot — store back as ISO strings
  const handleEventChange = (changeInfo: EventChangeArg) => {
    const { event } = changeInfo;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: event.startStr || e.start,
              end: event.endStr || e.end,
              allDay: event.allDay ?? e.allDay,
            }
          : e
      )
    );
  };

  const fcEvents: EventInput[] = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        // color-coding by status
        color:
          e.status === "pending"
            ? "orange"
            : e.status === "accepted"
            ? "green"
            : "red",
      })),
    [events]
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        editable
        events={fcEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
      />
    </div>
  );
};

export default MeetingCalendar;
