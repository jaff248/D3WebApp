// Set the dimensions of the canvas
const margin = { top: 20, right: 20, bottom: 70, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

//Mapping for HTML
const metricMapping = {
  gdp: "GDP  ($ USD billions PPP)",
  gdp_per_capita: "GDP per capita in $ (PPP)",
  health_expenditure: "health expenditure  % of GDP",
  health_expenditure_per_person: "health expenditure  per person",
  military_spending: "Military expenditure (% of GDP)",
  unemployment: "unemployment (%)"
};

// Create the svg canvas
const svg = d3
  .select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the x and y scales
const xScale = d3.scaleBand().range([0, width]).padding(0.1);
const yScale = d3.scaleLinear().range([height, 0]);

// Set the x and y axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

//Labels
// Add labels for x-axis, y-axis, and title
const xAxisLabel = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom / 2)
  .style("text-anchor", "middle")
  .attr("class", "axis-label");

const yAxisLabel = svg
  .append("text")
  .attr("x", -height / 2)
  .attr("y", -margin.left / 1.5)
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("class", "axis-label");

const titleLabel = svg
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
    const newRow = {};
    for (const key in row) {
      const newKey = key.trim().replace(/[\n\r]+/g, " ");
      newRow[newKey] = row[key];
    }
    return newRow;
  });

  // Call the populate functions to create the dropdowns
  populateCountrySelect(cleanedData);
  populateMetricSelect(cleanedData);

  // Get the selected country and metric from the dropdowns
  const selectedCountry = document.getElementById("countrySelect").value;
  const selectedMetricDropdown = document.getElementById("metricSelect");
  const selectedMetric = metricMapping[selectedMetricDropdown.value];
  

  // Filter the data by the selected country
  const filteredData = cleanedData.filter(
    (row) => row.indicator === selectedCountry
  );

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
  const countrySelect = document.getElementById("countrySelect");
  const uniqueCountries = [...new Set(data.map((row) => row.indicator))];

  uniqueCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  // Add event listener to update the chart when the country is changed
  countrySelect.addEventListener("change", updateChart);
}

function populateMetricSelect(data) {
  const metricSelect = document.getElementById("metricSelect");
  const allowedMetrics = [
    "gdp",
    "gdp_per_capita",
    "health_expenditure",
    "health_expenditure_per_person",
    "military_spending",
    "unemployment",
  ];
  const metrics = Object.keys(data[0]).filter((key) =>
    allowedMetrics.includes(key)
  );

  metrics.forEach((metric) => {
    const option = document.createElement("option");
    option.value = metric;
    option.textContent = metric;
    metricSelect.appendChild(option);
  });

  // Add event listener to update the chart when the metric is changed
  metricSelect.addEventListener("change", updateChart);
}
function updateChart() {
  // Get the selected country and metric from the dropdowns
  const selectedCountry = document.getElementById("countrySelect").value;
  const selectedMetric = document.getElementById("metricSelect").value;

  if (!selectedMetric) {
    return;
  }

  // Filter the data by the selected country
  const filteredData = cleanedData.filter(
    (row) => row.indicator === selectedCountry
  );

  // Set the domain for the x and y scales based on the selected metric
  xScale.domain(filteredData.map((row) => row.year));
  yScale.domain([0, d3.extent(filteredData, (row) => +row[selectedMetric])[1]]);

  // Update the x and y axis
  svg.select(".x-axis").transition().duration(500).call(xAxis);
  svg.select(".y-axis").transition().duration(500).call(yAxis);

  // Update the bars
  const bars = svg.selectAll("rect").data(filteredData);

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
  addBaselineLine(selectedCountry, selectedMetric);
}

function updateLabels() {
  const selectedMetric = document.getElementById("metricSelect").value;
  const metricLabel = {
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
  if(metric!='GDP  ($ USD billions PPP)'){
    metric = metricMapping[metric]
  }
  console.log("Here we got the metric: " + metric)
  // Get the selected country's code
  const countryCode = cleanedData.find(
    (row) => row.indicator === country
  ).country_code;
    console.log(countryCode);
    console.log(metric);
  // Find the baseline value for the selected country and metric
  const baselineValue = cleanedData.find(
    (row) => row.country_code === countryCode && row.year === "2016"
  )[metric];

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
}