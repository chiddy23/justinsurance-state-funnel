/**
 * JustInsurance — "Apply to Partner" form handler (justinsuranceco.com/partners)
 *
 * Emails justin@ + support@ (as it does now) AND logs every submission to a
 * "Partner Applications" Google Sheet — auto-created on first run, then reused.
 *
 * HOW TO INSTALL
 * 1. Open the Apps Script project behind your /partners webhook
 *    (the deployment whose URL ends in .../AKfycby...wu4AB.../exec).
 * 2. Replace the existing doPost with everything below (or paste alongside and
 *    delete the old doPost). Save.
 * 3. Re-deploy: Deploy ▸ Manage deployments ▸ (pencil/edit) ▸ Version: "New
 *    version" ▸ Deploy.  The /exec URL stays the SAME — no site change needed.
 * 4. First save/run will prompt you to authorize Sheets + Gmail + Properties —
 *    approve it. The new "Partner Applications" sheet will appear in the script
 *    owner's Google Drive after the first submission (you can move it to any
 *    folder; its ID is remembered).
 *
 * If you'd rather keep your EXACT current email wording, you only need the three
 * helpers getSheet_/logToSheet_ and a single `logToSheet_(data);` call inside
 * your existing doPost — the rest is optional.
 */

// NOTE: support inbox is the yourinsurancelicense.com address (the site DISPLAYS
// support@justinsuranceco.com, but the monitored inbox is the .com migration one).
var NOTIFY_EMAILS = 'justin@justinsuranceco.com,support@yourinsurancelicense.com';
var SHEET_NAME = 'Partner Applications';
var HEADERS = ['Timestamp', 'Full Name', 'Email', 'Phone', 'Agents / Month', 'Heard From', 'Message'];

function doPost(e) {
  var data = parseBody_(e);

  // Log first; never let a logging error block the email notification.
  try { logToSheet_(data); } catch (err) {}
  try { notifyTeam_(data); } catch (err) {}

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody_(e) {
  var d = {};
  try {
    if (e && e.postData && e.postData.contents) d = JSON.parse(e.postData.contents);
  } catch (err) { d = {}; }
  if ((!d || !Object.keys(d).length) && e && e.parameter) d = e.parameter; // form-encoded fallback
  return d || {};
}

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PARTNER_SHEET_ID');
  var ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (err) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_NAME);
    props.setProperty('PARTNER_SHEET_ID', ss.getId());
  }
  var sh = ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function logToSheet_(d) {
  getSheet_().appendRow([
    new Date(),
    d.fullName || '',
    d.email || '',
    d.phone || '',
    d.agentsPerMonth || '',
    d.heardFrom || '',
    d.about || ''
  ]);
}

function notifyTeam_(d) {
  var subject = 'New Partner Application — ' + (d.fullName || 'Unknown');
  var body =
    'New Agency Partnership application from justinsuranceco.com/partners:\n\n' +
    'Name:              ' + (d.fullName || '') + '\n' +
    'Email:             ' + (d.email || '') + '\n' +
    'Phone:             ' + (d.phone || '') + '\n' +
    'Agents per month:  ' + (d.agentsPerMonth || '') + '\n' +
    'Heard from:        ' + (d.heardFrom || '') + '\n' +
    'Message:           ' + (d.about || '') + '\n\n' +
    'Also logged to the "Partner Applications" Google Sheet.';
  MailApp.sendEmail({ to: NOTIFY_EMAILS, subject: subject, body: body });
}
