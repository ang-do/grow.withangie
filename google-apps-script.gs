/**
 * Deploy this bound to the "Job Magnet leads" spreadsheet:
 * https://docs.google.com/spreadsheets/d/1pHUqV4Isgp80787Vgznk2fwaGVTQ6JaRX5Zk_Z6hqCI/edit
 *
 * Setup:
 * 1. Open the spreadsheet -> Extensions -> Apps Script.
 * 2. Delete any placeholder code and paste this file's contents in.
 * 3. Save, then Deploy -> New deployment -> type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Click Deploy, authorize the requested permissions, and copy the
 *    resulting web app URL (ends in /exec).
 * 5. Send that URL back so it can be wired into the site's checkout and
 *    Career Partnership forms.
 *
 * Writes two tabs, creating them (with headers) on first use:
 * - "Checkout Emails"     <- Get Access / Get Full Access opt-in
 * - "Career Partnership"  <- Payment Success application form
 */
function doPost(e) {
  var params = (e && e.parameter) || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var isApplication = params.formType === 'career_partnership';
  var sheetName = isApplication ? 'Career Partnership' : 'Checkout Emails';
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = isApplication
      ? ['Timestamp', 'Language', 'Location', 'Position', 'Job search duration', 'Email']
      : ['Timestamp', 'Language', 'Page', 'Email', 'Agreed to terms'];
    sheet.appendRow(headers);
  }

  var row = isApplication
    ? [new Date(), params.lang || '', params.location || '', params.position || '', params.duration || '', params.email || '']
    : [new Date(), params.lang || '', params.page || '', params.email || '', params.agreed || ''];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
