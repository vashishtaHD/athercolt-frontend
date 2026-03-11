const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const SHEET_NAME_CONTACT = PropertiesService.getScriptProperties().getProperty('SHEET_NAME_CONTACT') || "Contact";
const SHEET_NAME_CAREERS = PropertiesService.getScriptProperties().getProperty('SHEET_NAME_CAREERS') || "Careers";
const WEBHOOK_TOKEN = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN');

// Run this function exactly once from the Google Apps Script editor to authorize the script!
function setup() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  console.log("Successfully authorized to open sheet: " + spreadsheet.getName());
}

function doPost(e) {
  try {
    // Google Apps Script sometimes strips Authorization headers. Check URL parameters as a fallback.
    const authHeader = e.postData.headers ? (e.postData.headers['Authorization'] || e.postData.headers['authorization']) : null;
    const urlToken = e.parameter ? e.parameter.token : null;
    
    let isValid = false;
    if (authHeader && authHeader === `Bearer ${WEBHOOK_TOKEN}`) isValid = true;
    if (urlToken && urlToken === WEBHOOK_TOKEN) isValid = true;

    if (!isValid) {
      return ContentService.createTextOutput("Unauthorized").setMimeType(ContentService.MimeType.TEXT);
    }

    const data = JSON.parse(e.postData.contents);
    
    let targetSheetName = SHEET_NAME_CONTACT;
    if (data.source === "career_application") {
      targetSheetName = SHEET_NAME_CAREERS;
    }
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(targetSheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: `Sheet tab named '${targetSheetName}' not found` }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => data[header] !== undefined ? data[header] : "");
    
    // Auto-fill a timestamp if it exists in the headers but not in the payload
    const timestampIndex = headers.findIndex(h => h.toLowerCase() === 'timestamp' || h.toLowerCase() === 'date');
    if (timestampIndex !== -1 && !row[timestampIndex]) {
        row[timestampIndex] = new Date().toISOString();
    }

    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
