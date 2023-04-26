fetch('countries.csv')
  .then(response => response.text())
  .then(fileContent => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      comments: 'notes',
      complete: (results) => {
        const cleanedData = results.data.map((row) => {
          const newRow = {};
          for (const key in row) {
            const newKey = key.trim().replace(/[\n\r]+/g, ' ');
            newRow[newKey] = row[key];
          }
          return newRow;
        });
      },
    });
  });

// Load the CSV data using d3.csv
d3.csv('countries.csv').then(data => {
        // Print the first 5 rows of the data
        console.log("First 5 rows of countries.csv:");
        console.log(data.slice(0, 5));

    // Populate the 'countrySelect' dropdown with the list of countries from the data
    populateCountrySelect(data);

    // Populate the 'yearSelect' dropdown with the list of years from the data
    populateYearSelect(data);

    // You can add other functions to process the data or create visualizations
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

function populateYearSelect(data) {
    const yearSelect = document.getElementById('yearSelect');
    const uniqueYears = [...new Set(data.map(row => row['ISO Country code']))];

    uniqueYears.sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    console.log("Works2")
}


// Add other functions to process the data or create visualizations
