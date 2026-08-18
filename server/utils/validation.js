import mongoose from "mongoose";

export function isNonEmptyString(value, maxLength = 200) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function hasValidOptionalNumbers(data, fields) {
  return fields.every((field) => data[field] === undefined || isNonNegativeNumber(data[field]));
}

export function isValidDate(value) {
  return (
    value === undefined ||
    (typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) &&
      !Number.isNaN(Date.parse(value)))
  );
}

export function isValidDateOnly(value) {
  if (value === undefined) return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isValidObjectId(value) {
  return mongoose.isObjectIdOrHexString(value);
}
