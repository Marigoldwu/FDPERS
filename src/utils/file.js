export function exportToCSV(jsonData, fileName) {
  // Convert JSON to CSV
  let csvData = '';
  const headerRow = Object.keys(jsonData[0]).join(',');
  csvData += headerRow + '\r\n';
  for (let i = 0; i < jsonData.length; i++) {
    const values = Object.values(jsonData[i]).map((val) => `"${val}"`);
    csvData += values.join(',') + '\r\n';
  }

  // Download CSV file
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName + '.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
