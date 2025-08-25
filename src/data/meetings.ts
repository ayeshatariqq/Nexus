import { Meeting } from "../types";

// Prefer localStorage so calendar + dashboards stay in sync across components/tabs
const LS_KEY = "events";

function readAll(): Meeting[] {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? (JSON.parse(raw) as Meeting[]) : [];
}

function writeAll(list: Meeting[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function addMeeting(meeting: Meeting) {
  const list = readAll();
  list.push(meeting);
  writeAll(list);
}

export function getAllMeetings(): Meeting[] {
  return readAll();
}

export function getMeetingsForEntrepreneur(entrepreneurId: string) {
  return readAll().filter(m => m.entrepreneurId === entrepreneurId);
}

export function getMeetingsForInvestor(investorId: string) {
  return readAll().filter(m => m.investorId === investorId);
}

export function updateMeeting(id: string, patch: Partial<Meeting>) {
  const list = readAll().map(m => (m.id === id ? { ...m, ...patch } : m));
  writeAll(list);
}

export function deleteMeeting(id: string) {
  writeAll(readAll().filter(m => m.id !== id));
}
