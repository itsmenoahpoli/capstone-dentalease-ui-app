import dayjs from "dayjs";

export function formatDateToWords(date: string) {
  return dayjs(date).format("D MMMM YYYY, h:mm A");
}
