d3.csv('countries.csv').then(data => {
  // Clean the data
  const cleanedData = data.map((row) => {
      const newRow = {};
      for (const key in row) {
          const newKey = key.trim().replace(/[\n\r]+/g, ' ');
          newRow[newKey] = row[key];
      }
      return newRow;
  });

  // Print the first 5 rows of the cleaned data
  console.log("First 5 rows of cleaned countries.csv:");
  console.log(cleanedData.slice(0, 5));

  // Populate the 'countrySelect' dropdown with the list of countries from the cleaned data
  populateCountrySelect(cleanedData);

  // Populate the 'yearSelect' dropdown with the list of years from the cleaned data
  populateYearSelect(cleanedData);

  // You can add other functions to process the cleaned data or create visualizations
  console.log("Works3")
});


function populateCountrySelect(data) {
    const countrySelect = document.getElementById('countrySelect');
    const uniqueCountries = [...new Set(data.map(row => row.indicator))];

    uniqueCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    console.log("Works")
}
// Add other functions to process the data or create visualizations