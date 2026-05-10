function doPost(e) {
  try {
    // Determine how the data was sent
    let data;
    if (e.postData && e.postData.contents) {
      // Data sent via JSON POST body
      data = JSON.parse(e.postData.contents);
    } else {
      // Data sent via URL parameters or form encoded
      data = e.parameter;
    }

    // Prepare the spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Nama Lengkap", "NISN", "Jenis Kelamin", "Tanggal Lahir"]);
      sheet.getRange("A1:E1").setFontWeight("bold");
    }

    // Append the incoming data as a new row
    sheet.appendRow([
      new Date(), // Timestamp
      data.namaLengkap || "",
      data.nisn || "",
      data.jenisKelamin || "",
      data.tanggalLahir || ""
    ]);

    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data successfully saved" 
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    const result = [];
    // Assuming row 1 is header
    for (let i = 1; i < data.length; i++) {
      result.push({
        namaLengkap: data[i][1],
        nisn: data[i][2],
        jenisKelamin: data[i][3],
        tanggalLahir: data[i][4]
      });
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
