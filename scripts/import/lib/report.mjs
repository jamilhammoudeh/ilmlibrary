/**
 * CSV / Markdown report helpers for the import pipeline.
 *
 * CSVs are written with a UTF-8 BOM so Arabic opens correctly in Excel,
 * and CRLF line endings for Excel friendliness.
 */

import { writeFileSync, readFileSync } from "fs";

const BOM = "﻿";

function csvEscape(value) {
  if (value == null) return "";
  const s = String(value).replace(/\r?\n/g, " ").trim();
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * Write a CSV file. `rows` is an array of objects keyed by header name
 * (missing keys become empty cells).
 */
export function writeCsv(path, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  writeFileSync(path, BOM + lines.join("\r\n") + "\r\n", "utf8");
}

/**
 * Minimal CSV parser (handles quoted fields, embedded commas/quotes/newlines,
 * CRLF, and a leading BOM). Returns an array of objects keyed by header row.
 */
export function parseCsvFile(path) {
  let text = readFileSync(path, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const records = [];
  let field = "";
  let record = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      record.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      field = "";
      if (record.length > 1 || record[0] !== "") records.push(record);
      record = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || record.length > 0) {
    record.push(field);
    if (record.length > 1 || record[0] !== "") records.push(record);
  }

  if (records.length === 0) return [];
  const headers = records[0].map((h) => h.trim());
  return records.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (r[i] ?? "").trim()));
    return obj;
  });
}

/** Write a markdown report file (plain UTF-8, no BOM). */
export function writeMarkdown(path, content) {
  writeFileSync(path, content.endsWith("\n") ? content : content + "\n", "utf8");
}
