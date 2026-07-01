import { dayjs } from "@/utils/dayjs";

import type { IsoDate } from "@/types/progress";

export function isoDate(d: dayjs.ConfigType = dayjs()): IsoDate {
  return dayjs(d).format("YYYY-MM-DD");
}

export function parseIsoDate(d: IsoDate) {
  return dayjs(d, "YYYY-MM-DD");
}

export function startOfIsoWeek(d: dayjs.ConfigType = dayjs()): IsoDate {
  return isoDate(dayjs(d).startOf("isoWeek"));
}

export function endOfIsoWeek(d: dayjs.ConfigType = dayjs()): IsoDate {
  return isoDate(dayjs(d).endOf("isoWeek"));
}

export function startOfMonth(d: dayjs.ConfigType = dayjs()): IsoDate {
  return isoDate(dayjs(d).startOf("month"));
}

export function endOfMonth(d: dayjs.ConfigType = dayjs()): IsoDate {
  return isoDate(dayjs(d).endOf("month"));
}

export function isSameIsoDate(a: IsoDate, b: IsoDate) {
  return a === b;
}

export function eachDay(start: IsoDate, end: IsoDate): IsoDate[] {
  const s = parseIsoDate(start);
  const e = parseIsoDate(end);
  const days: IsoDate[] = [];
  let cur = s;
  while (cur.isSame(e) || cur.isBefore(e)) {
    days.push(isoDate(cur));
    cur = cur.add(1, "day");
  }
  return days;
}

