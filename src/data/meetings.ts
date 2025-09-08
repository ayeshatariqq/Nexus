import { Meeting } from "../types";

// single source of truth for localStorage key
const LS_KEY = "events";

function readAll(): Meeting[] {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? (JSON.parse(raw) as Meeting[]) : [];
}

function writeAll(list: Meeting[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function addMeeting(meeting: Meeting) {
  // ensure ISO strings for dates
  const normalized: Meeting = {
    ...meeting,
    start:
      typeof meeting.start === "string"
        ? meeting.start
        : new Date(meeting.start).toISOString(),
    end:
      !meeting.end
        ? undefined
        : typeof meeting.end === "string"
        ? meeting.end
        : new Date(meeting.end).toISOString(),
  };
  const list = readAll();
  list.push(normalized);
  writeAll(list);
}

export function getAllMeetings(): Meeting[] {
  return readAll();
}

export function getMeetingsForEntrepreneur(entrepreneurId: string) {
  return readAll().filter((m) => m.entrepreneurId === entrepreneurId);
}

export function getMeetingsForInvestor(investorId: string) {
  return readAll().filter((m) => m.investorId === investorId);
}

export function updateMeeting(id: string, patch: Partial<Meeting>) {
  const list = readAll().map((m) =>
    m.id === id ? { ...m, ...patch } : m
  );
  writeAll(list);
}

export function deleteMeeting(id: string) {
  writeAll(readAll().filter((m) => m.id !== id));
}
