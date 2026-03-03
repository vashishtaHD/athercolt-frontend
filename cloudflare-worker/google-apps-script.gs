const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const SHEET_NAME = PropertiesService.getScriptProperties().getProperty('SHEET_NAME');
const WEBHOOK_TOKEN = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN');

function doPost(e) {
  try {
    const authHeader = e.postData.headers ? (e.postData.headers['Authorization'] || e.postData.headers['authorization']) : null;
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_TOKEN}`) {
      return ContentService.createTextOutput("Unauthorized").setMimeType(ContentService.MimeType.TEXT);
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
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
