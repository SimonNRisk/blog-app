// Avoid bundling utility into client build
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
  // signs short lived json web token to be exchanged for an access token (used in Auth bearer token)
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getSheetValues(range: string) {
  const auth = getAuth(); //returns jwt from client described above
  const sheets = google.sheets({ version: "v4", auth }); //builds gs client
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range,
    valueRenderOption: "FORMATTED_VALUE",
  });
  return res.data.values ?? []; //returns 2d array of values
}

/**
 * interpret the first row as headers and return array of objects.
 * Pass a range that includes the header row (e.g., "Sheet1!A1:D").
 */
export async function getSheetObjects(range: string) {
  const values = await getSheetValues(range);
  if (values.length === 0) return [];
  //array destrucuring with rest. first element of values (1st row) stored as headers, the rest is stored in values
  const [headers, ...rows] = values;
  return rows.map((r) =>
    //builds object of kv pairs: keys come from headers, values from same index in r
    Object.fromEntries(
      headers.map((h: string, i: number) => [String(h), r[i] ?? ""])
    )
  );
}
