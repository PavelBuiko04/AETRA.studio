/**
 * AETRA Studio — Google Sheets form handler
 *
 * Setup:
 * 1. Create a Google Sheet with headers in row 1:
 *    Timestamp | Name | Email | Project Type | Industry | Message
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into ts/data.ts → GOOGLE_SHEETS_WEB_APP_URL
 */

function doGet() {
  return ContentService.createTextOutput("AETRA form endpoint is active.").setMimeType(
    ContentService.MimeType.TEXT
  );
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.name || "",
      data.email || "",
      data.projectType || "",
      data.industry || "",
      data.message || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
