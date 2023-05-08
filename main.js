// Set the dimensions of the canvas
var margin = { top: 50, right: 20, bottom: 70, left: 40 };
var width = 2600 - margin.left - margin.right;
var height = 1300 - margin.top - margin.bottom;

var default_ratio = width / height;

function set_size() {
  current_width = window.innerWidth;
  current_height = window.innerHeight;
  current_ratio = current_width / current_height;
  if (current_ratio > default_ratio) {
    h = height;
    w = width;
  } else {
    margin.left = 40;
    w = current_width;
    h = w / default_ratio;
  }
  // Set new width and height taking margin into account
  width = w - 50 - margin.right;
  height = h - margin.top - margin.bottom;
}
set_size();

//Mapping for HTML
var metricMapping = {
  gdp: "GDP  ($ USD billions PPP)",
  gdp_per_capita: "GDP per capita in $ (PPP)",
  health_expenditure: "health expenditure  % of GDP",
  health_expenditure_per_person: "health expenditure  per person",
  military_spending: "Military Spending as % of GDP",
  unemployment: "unemployment (%)",
};

var years = {
    gdp: ["2018", "2019", "2020", "2021"],
    gdp_per_capita: ["2018", "2019", "2020", "2021"],
    health_expenditure: [
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2021 or latest",
    ],
    health_expenditure_per_person: ["2015", "2018", "2019"],
    military_spending: ["2019", "2021"],
    unemployment: ["2018", "2021"],
  };



// GRAPH 1 -- BAR GRAPH
// Create the svg canvas for graph 1
var svg1 = d3
  .select("#visualization1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the x and y scales
var xScale1 = d3.scaleBand().domain([0, width]).padding(0.1);
//Linear
var yScale1 = d3.scaleLinear().range([height, 0]);

var xScale2 = d3.scaleBand().domain([0, width]).padding(0.1);
//Linear
var yScale2 = d3.scaleLinear().range([height, 0]);

// Set the x and y axis
var xAxis1 = d3.axisBottom(xScale1); // Remove outer ticks
var yAxis1 = d3.axisLeft(yScale1);

//Labels
var xAxisLabel1 = svg1
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .style("text-anchor", "middle")
  .attr("class", "axis-label");
var yAxisLabel1 = svg1
  .append("text")
  .attr("x", -height / 2)
  .attr("y", -margin.left / 1.5)
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("class", "axis-label");
var titleLabel1 = svg1
  .append("text")
  .attr("x", width / 2)
  .attr("y", -margin.top / 2)
  .style("text-anchor", "middle")
  .attr("class", "title-label");

// GRAPH 2 -- STACKED BAR GRAPH
var svg2 = d3
  .select("#visualization2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxis2 = d3.axisBottom(xScale2); // Remove outer ticks
var yAxis2 = d3.axisLeft(yScale2);
// GRAPH 2 Add labels for x-axis, y-axis, and title this is the country label, then Y label, then title for graph
var xAxisLabel2 = svg2
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .style("text-anchor", "middle")
  .attr("class", "axis-label");
var yAxisLabel2 = svg2
  .append("text")
  .attr("x", -height / 2)
  .attr("y", -margin.left / 1.5)
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .attr("class", "axis-label");
var titleLabel2 = svg2
  .append("text")
  .attr("x", width / 2)
  .attr("y", -margin.top / 2)
  .style("text-anchor", "middle")
  .attr("class", "title-label");

//Yeared Data has years, cleaned only has countrys so easier to graph
let yearedData;
let cleanedData;
let baselineLine;

// BEGIN DEFINING FUNCTIONS
//Load coutnries
d3.csv("countries.csv").then((data) => {
  // Clean the data
  console.log(JSON.stringify(data, null, 2));
  cleanedData = data.map((row) => {
    var newRow = {};
    for (var key in row) {
      var newKey = key.trim().replace(/[\n\r]+/g, " ");
      newRow[newKey] = row[key];
    }
    return newRow;
  });
  yearedData = cleanedData;
  cleanedData = cleanedData.slice(5, 178);

  // Call the populate functions to create the dropdowns
  populateCountrySelect(cleanedData);
  populateYearSelect(cleanedData);
  populateMetricSelect(cleanedData);

  // Get the selected country and metric from the dropdowns
  var selectedCountry = document.getElementById("countrySelect");
  var selectedYear = document.getElementById("yearSelect");
  //console.log(selectedCountry);
  var selectedMetricDropdown = document.getElementById("metricSelect");
  var selectedMetric = metricMapping[selectedMetricDropdown.value];
  var metricYearKey =
    metricMapping[selectedMetricDropdown.value] + " " + selectedYear.value;
  cleanedData = cleanedData.sort(function (a, b) {
    var keyA = a[metricYearKey],
      keyB = b[metricYearKey];
    if (keyA == null && keyB == null) {
      return 0;
    }
    if (keyA == null) {
      return -1;
    }
    if (keyB == null) {
      return 1;
    }
    // Compare the 2 dates
    if (keyA < keyB) return 1;
    else if (keyA > keyB) return -1;
    else {
      return 0;
    }
  });
  console.log(JSON.stringify(cleanedData, null, 2));
  //Bonk
  countries = cleanedData.map(function (d) {
    //console.log(d)
    return d.indicator;
  });

  //Y
  countrys = cleanedData.map(function (d) {
    //  console.log(d[selectedMetric]);
    return parseFloat(d[metricYearKey].replace(",", ""));
  });

  //Set domain for the x scale
  xScale1.domain(countries).range([0, width]);

  // Set the domain for the y scales based on the selected metric
  console.log(JSON.stringify(countries, null, 2));
  yScale1.domain([0, d3.max(countrys)]).range([height, 0]);

  // Create the x and y axis
  // Create the x and y axis
  svg1
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis1)
    .selectAll("text") // <- Add this line
    .style("text-anchor", "end") // <- Add this line
    .attr("dx", "-0.8em") // <- Add this line
    .attr("dy", "0.15em") // <- Add this line
    .attr("transform", "rotate(-65)"); // <- Add this line

  svg1.append("g").attr("class", "y-axis").call(yAxis1);

  // Create the bars
  var bar = svg1
    .selectAll("rect")
    .data(cleanedData)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale1(d.indicator))
    .attr("y", (d) => yScale1(d[metricYearKey]))
    .attr("width", xScale1.bandwidth())
    .attr("height", (d) => checkNaN(height - yScale1(d[metricYearKey])))
    .attr("fill", "steelblue");

  bar.append("text").text(function (d) {
    return d.indicator;
  });
    
xScale2.domain(years[selectedMetricDropdown.value]).range([0, width]);
    yScale2.domain([0, d3.max(countrys)]).range([height, 0]);
    
    svg2
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2)


  svg2.append("g").attr("class", "y-axis").call(yAxis2);

  updateLabels();
  addBaselineLine(selectedCountry, metricYearKey);
  updateChart();
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
  const yearSelect = document.getElementById("yearSelect");
  const selectedMetric = document.getElementById("metricSelect").value;
  const years = {
    gdp: [2018, 2019, 2020, 2021],
    gdp_per_capita: [2018, 2019, 2020, 2021],
    health_expenditure: [
      2014,
      2015,
      2016,
      2017,
      2018,
      2019,
      2020,
      2021,
      "2021 or latest",
    ],
    health_expenditure_per_person: [2015, 2018, 2019],
    military_spending: [2019, 2021],
    unemployment: [2018, 2021],
  };

  while (yearSelect.firstChild) {
    yearSelect.removeChild(yearSelect.firstChild);
  }

  years[selectedMetric].forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

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
  metricSelect.addEventListener("change", metricSelectEventListener);
}

function checkNaN(x) {
  if (isNaN(x)) {
    return 0;
  }

  return x;
}

function metricSelectEventListener() {
  populateYearSelect(cleanedData);
  updateChart();
}

function updateChart() {
  // Get the selected country and metric from the dropdowns
  var selectedCountry = document.getElementById("countrySelect").value;
  var selectedMetricDropdown = document.getElementById("metricSelect");
  var selectedMetric = metricMapping[selectedMetricDropdown.value];
  var selectedYear = document.getElementById("yearSelect").value;
  var metricYearKey = selectedMetric + " " + selectedYear;

  if (!selectedMetric) {
    return;
  }

  // Filter the data based on the selected metric

  var filteredData = cleanedData.map((row) => {
    var value = parseFloat(row[metricYearKey].replace(",", ""));
    if (value > 0) {
      return {
        indicator: row.indicator,
        value: value,
      };
    }
    return {
      indicator: row.indicator,
      value: 0,
    };
  });
  filteredData = filteredData.sort(function (a, b) {
    var keyA = a["value"],
      keyB = b["value"];
    if (keyA === null && keyB === null) {
      return 0;
    }
    if (keyA === null || keyB === null) {
      console.log(keyA);
      console.log(keyB);
    }
    if (keyA === null) {
      return 1;
    }
    if (keyB === null) {
      return -1;
    }
    // Compare the 2 dates
    if (keyA < keyB) return 1;
    else if (keyA > keyB) return -1;
    else {
      return 0;
    }
  });
  countries = filteredData.map(function (d) {
    return d.indicator;
  });
  console.log(JSON.stringify(filteredData, null, 2));

  xScale1.domain(countries).range([0, width]);
  // Update the yScale domain based on the new metric
  yScale1
    .domain([
      0,
      d3.max(filteredData, function (d) {
        return d.value;
      }),
    ])
    .range([height, 0]);

  // Update the x and y axis
  svg1.select(".x-axis").transition().duration(500).call(xAxis1);
  svg1.select(".y-axis").transition().duration(500).call(yAxis1);
    
xScale2.domain(years[selectedMetricDropdown.value]).range([0, width]);
    svg2.select(".x-axis").transition().duration(500).call(xAxis2);

  // Update the bars
  var bars = svg1.selectAll("rect").data(filteredData);
  bars
    .join("rect")
    .transition()

    .duration(500)
    .attr("x", (d) => xScale1(d.indicator))
    .attr("y", (d) => yScale1(d.value))
    .attr("width", xScale1.bandwidth())
    .attr("height", (d) => checkNaN(height - yScale1(d.value)))

    .duration(400)
    .attr("x", (d) => xScale(d.indicator))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => checkNaN(height - yScale(d.value)))

    .attr("fill", "steelblue");

  // Update the labels
  updateLabels();

  // Add or update the baseline line
  addBaselineLine(selectedCountry, metricYearKey);
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
  var selectedYear = document.getElementById("yearSelect").value;
  var yearLabel = {
    2014: "2014",
    2015: "2015",
    2016: "2016",
    2017: "2017",
    2018: "2018",
    2019: "2019",
    2020: "2020",
    2021: "2021",
    "2021 or latest": "2021 or latest",
  };
  xAxisLabel1.text("Countries");
  yAxisLabel1.text(metricLabel[selectedMetric]);
  titleLabel1.text(
    `Comparison of ${metricLabel[selectedMetric]} ${yearLabel[selectedYear]}`
  );
  xAxisLabel2.text("Countries");
  yAxisLabel2.text(metricLabel[selectedMetric]);
  titleLabel2.text(
    `Comparison of ${metricLabel[selectedMetric]} Over All Available Years`
  );
}

function addBaselineLine(country, metric) {
  //  if (metric != "GDP  ($ USD billions PPP)") {
  //    metric = metricMapping[metric];
  //  }

  // Find the baseline value for the selected country and metric
  //console.log(JSON.stringify(cleanedData, null, 2));
  // console.log("Here is the country and metric printed: " + country + "and the metric " + metric +"");
  const baselineRow = cleanedData.find((row) => row.indicator == country);
  console.log(metric);
  const baselineValue = baselineRow ? parseFloat(baselineRow[metric]) : 0;

  // Remove any existing baseline line
  if (baselineLine) {
    baselineLine.remove();
  }

  if (isNaN(baselineValue)) {
    baselineValue.remove();
  }

  // Add a new horizontal red dotted line for the baseline value
  baselineLine = svg1
    .append("line")
    .attr("x1", 0)
    .attr("y1", yScale1(baselineValue))
    .attr("x2", width)
    .attr("y2", yScale1(baselineValue))
    .attr("stroke", "red")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", 1);
  console.log("baseline: " + baselineValue);
}
