import "server-only";
import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  //let because unescaping new lines later
  let key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error(
      "Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY env vars"
    );
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getSheetValues(range: string) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range,
    valueRenderOption: "UNFORMATTED_VALUE", // or 'FORMATTED_VALUE' | 'FORMULA'
  });
  return res.data.values ?? [];
}

/**
 * Convenience: interpret the first row as headers and return array of objects.
 * Pass a range that includes the header row (e.g., "Sheet1!A1:D").
 */
export async function getSheetObjects(range: string) {
  const values = await getSheetValues(range);
  if (values.length === 0) return [];
  const [headers, ...rows] = values;
  return rows.map((r) =>
    Object.fromEntries(
      headers.map((h: string, i: number) => [String(h), r[i] ?? ""])
    )
  );
}
