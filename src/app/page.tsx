import Image from "next/image";

import { getSheetObjects } from "@/lib/googleSheets";

export const revalidate = 300; // ISR: refresh every 5 minutes (optional)
export const runtime = "nodejs"; // ensure Node runtime (googleapis needs Node, not Edge)

export default async function Home() {
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "Sheet1!A1:D";
  const rows = await getSheetObjects(range);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Sheet data</h1>
      <div className="grid gap-2">
        {rows.map((row, i) => (
          <pre key={i} className="rounded border p-3">
            {JSON.stringify(row, null, 2)}
          </pre>
        ))}
      </div>
    </main>
  );
}
