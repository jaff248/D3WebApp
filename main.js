// Set the dimensions of the canvas
var margin = { top: 20, right: 20, bottom: 70, left: 40 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

//Mapping for HTML
var metricMapping = {
  gdp: "GDP  ($ USD billions PPP)",
  gdp_per_capita: "GDP per capita in $ (PPP)",
  health_expenditure: "health expenditure  % of GDP",
  health_expenditure_per_person: "health expenditure  per person",
  military_spending: "Military Spending as % of GDP",
  unemployment: "unemployment (%)",
};

// Create the svg canvas
var svg = d3
  .select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the x and y scales
var xScale = d3.scaleBand().range([0, width]).padding(0.1);
var yScale = d3.scaleLinear().range([height, 0]);

// Set the x and y axis
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

//Labels
// Add labels for x-axis, y-axis, and title
var xAxisLabel = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom / 2)
  .style("text-anchor", "middle")
  .attr("class", "axis-label");

var yAxisLabel = svg
  .append("text")
  .attr("x", -height / 2)
  .attr("y", -margin.left / 1.5)
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("class", "axis-label");

var titleLabel = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", -margin.top / 2)
  .style("text-anchor", "middle")
  .attr("class", "title-label");

let cleanedData;
let baselineLine;

//Load coutnries
d3.csv("countries.csv").then((data) => {
  yScale.domain([0, 100]);
  // Clean the data
  cleanedData = data.map((row) => {
    var newRow = {};
    for (var key in row) {
      var newKey = key.trim().replace(/[\n\r]+/g, " ");
      newRow[newKey] = row[key];
    }
    return newRow;
  });

  // Call the populate functions to create the dropdowns
  populateCountrySelect(cleanedData);
  populateYearSelect(cleanedData);
  populateMetricSelect(cleanedData);

  // Get the selected country and metric from the dropdowns
  var selectedCountry = document.getElementById("countrySelect");
  var selectedYear = document.getElementById("yearSelect");
  console.log(selectedCountry);
  var selectedMetricDropdown = document.getElementById("metricSelect");
  var selectedMetric = metricMapping[selectedMetricDropdown.value];

  // Filter the data by the selected country
  var filteredData = cleanedData.filter(
    (row) => row.indicator === selectedCountry
  );
  console.log(filteredData);

  // Set the domain for the x and y scales based on the selected metric
  xScale.domain(filteredData.map((row) => row.year));
  yScale.domain([0, d3.max(filteredData, (row) => +row[selectedMetric])]);

  // Create the x and y axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").attr("class", "y-axis").call(yAxis);

  // Create the bars
  svg
    .selectAll("rect")
    .data(filteredData)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d[selectedMetric]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d[selectedMetric]))
    .attr("fill", "steelblue");

  updateLabels();
  addBaselineLine(selectedCountry, selectedMetric);
});

function populateCountrySelect(data) {
  var countrySelect = document.getElementById("countrySelect");
  var uniqueCountries = [...new Set(data.map((row) => row.indicator))];

  uniqueCountries.forEach((country) => {
    var option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  // Add event listener to update the chart when the country is changed
  countrySelect.addEventListener("change", updateChart);
}

function populateYearSelect(data) {
  // ADDS YEARS BASED ON THE METRIC CHOSEN
  // initial call AND event listener
  var yearSelect = document.getElementById("yearSelect");
  var selectedMetric = document.getElementById("metricSelect").value;
  console.log(selectedMetric);
  if (selectedMetric == "gdp" || selectedMetric == "gdp_per_capita") {
    const parent = document.getElementById("yearSelect");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var option = document.createElement("option");
    option.value = "2018";
    option.textContent = "2018";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2019";
    option.textContent = "2019";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2020";
    option.textContent = "2020";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2021";
    option.textContent = "2021";
    yearSelect.appendChild(option);
  } else if (selectedMetric == "health_expenditure") {
    const parent = document.getElementById("yearSelect");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var option = document.createElement("option");
    option.value = "2014";
    option.textContent = "2014";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2015";
    option.textContent = "2015";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2016";
    option.textContent = "2016";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2017";
    option.textContent = "2017";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2018";
    option.textContent = "2018";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2019";
    option.textContent = "2019";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2020";
    option.textContent = "2020";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2021";
    option.textContent = "2021";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2021 or latest";
    option.textContent = "2021 or latest";
    yearSelect.appendChild(option);
  } else if (selectedMetric == "health_expenditure_per_person") {
    const parent = document.getElementById("yearSelect");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var option = document.createElement("option");
    option.value = "2015";
    option.textContent = "2015";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2018";
    option.textContent = "2018";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2019";
    option.textContent = "2019";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2020";
    option.textContent = "2020";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2017 (latest year)";
    option.textContent = "2017 (latest year)";
    yearSelect.appendChild(option);
  } else if (selectedMetric == "military_spending") {
    const parent = document.getElementById("yearSelect");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var option = document.createElement("option");
    option.value = "2021";
    option.textContent = "2021";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2019";
    option.textContent = "2019";
    yearSelect.appendChild(option);
  } else if (selectedMetric == "unemployment") {
    const parent = document.getElementById("yearSelect");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var option = document.createElement("option");
    option.value = "2018";
    option.textContent = "2018";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2021";
    option.textContent = "2021";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "latest year";
    option.textContent = "latest year";
    yearSelect.appendChild(option);
    var option = document.createElement("option");
    option.value = "2020";
    option.textContent = "2020";
    yearSelect.appendChild(option);
  }
  // Add event listener to update the chart when the country is changed
  yearSelect.addEventListener("change", updateChart);
}

function populateMetricSelect(data) {
  metricSelect = document.getElementById("metricSelect");
  var allowedMetrics = [
    "gdp",
    "gdp_per_capita",
    "health_expenditure",
    "health_expenditure_per_person",
    "military_spending",
    "unemployment",
  ];
  var metrics = Object.keys(data[0]).filter((key) =>
    allowedMetrics.includes(key)
  );

  metrics.forEach((metric) => {
    var option = document.createElement("option");
    option.value = metric;
    option.textContent = metric;
    metricSelect.appendChild(option);
  });

  // Add event listener to update the chart when the metric is changed
  metricSelect.addEventListener("change", updateChart);
}
function updateChart() {
  // Get the selected country and metric from the dropdowns
  var selectedCountry = document.getElementById("countrySelect").value;
  var selectedMetric = document.getElementById("metricSelect").value;
  populateYearSelect(cleanedData);
  var selectedYear = document.getElementById("yearSelect").value;

  if (!selectedMetric) {
    return;
  }

  // Filter the data by the selected country
  var filteredData = cleanedData.filter(
    (row) => row.indicator === selectedCountry
  );

  // Set the domain for the x and y scales based on the selected metric
  xScale.domain(filteredData.map((row) => row.year));
  yScale.domain([0, d3.extent(filteredData, (row) => +row[selectedMetric])[1]]);

  // Update the x and y axis
  svg.select(".x-axis").transition().duration(500).call(xAxis);
  svg.select(".y-axis").transition().duration(500).call(yAxis);

  // Update the bars
  var bars = svg.selectAll("rect").data(filteredData);
  bars
    .enter()
    .append("rect")
    .merge(bars)
    .transition()
    .duration(500)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d[selectedMetric]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d[selectedMetric]))
    .attr("fill", "steelblue");

  // Remove old bars
  bars.exit().remove();

  // Update the labels
  updateLabels();

  // Add or update the baseline line
  console.log(JSON.stringify(cleanedData, null, 2));
  addBaselineLine(selectedCountry, selectedMetric);
}

function updateLabels() {
  var selectedMetric = document.getElementById("metricSelect").value;
  var metricLabel = {
    gdp: "GDP ($ USD billions PPP)",
    gdp_per_capita: "GDP per capita in $ (PPP)",
    health_expenditure: "Health expenditure % of GDP",
    health_expenditure_per_person: "Health expenditure per person",
    military_spending: "Military Spending as % of GDP",
    unemployment: "Unemployment",
  };

  xAxisLabel.text("Countries");
  yAxisLabel.text(metricLabel[selectedMetric]);
  titleLabel.text(`Comparison of ${metricLabel[selectedMetric]}`);
}

function addBaselineLine(country, metric) {
  if (metric != "GDP  ($ USD billions PPP)") {
    metric = metricMapping[metric];
  }

  // Find the baseline value for the selected country and metric
  //console.log(JSON.stringify(cleanedData, null, 2));
  // console.log("Here is the country and metric printed: " + country + "and the metric " + metric +"");
  const baselineRow = cleanedData.find((row) => row.indicator == country);
  const baselineValue = baselineRow ? baselineRow[metric] : 0;

  // Remove any existing baseline line
  if (baselineLine) {
    baselineLine.remove();
  }

  // Add a new horizontal red dotted line for the baseline value
  baselineLine = svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", yScale(baselineValue))
    .attr("x2", width)
    .attr("y2", yScale(baselineValue))
    .attr("stroke", "red")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", 1);
  console.log("baseline: " + baselineValue);
}
