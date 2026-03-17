/* =======================
   GLOBAL VARIABLES
======================= */
let charts = [];
const LAST_ANALYSIS_KEY = "lastAnalysisResult";

/* =======================
   SIGNUP FUNCTION
======================= */
function signup() {
  const pwd = document.getElementById("password").value;
  const cpwd = document.getElementById("confirmPassword").value;

  if (pwd !== cpwd) {
    alert("Passwords do not match");
    return;
  }

  alert("Successfully signed up!");
  window.location.href = "index.html";
}

/* =======================
   LOGIN FUNCTION
======================= */
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email && password) {
    alert("Successfully logged in!");
    window.location.href = "dashboard.html";
  } else {
    alert("Please enter email and password");
  }
}

/* =======================
   ANALYZE EXCEL FILE
======================= */
async function analyze() {

  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an Excel file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend error ${response.status}: ${text}`);
    }

    const result = await response.json();

    console.log("Backend results:", result);

    try {
      sessionStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(result));
    } catch (_e) {
      // If storage is unavailable, proceed without persistence
    }

    generateChartsFromBackend(result);
    updateSummaryFromCharts();

  } catch (error) {

    console.error("Error connecting to backend:", error);
    alert("Error analyzing file");

  }
}

/* =======================
   GENERATE CHARTS
======================= */
function generateCharts(data) {
  clearChartsOnly();

  const count = (key) =>
    data.reduce((acc, obj) => {
      acc[obj[key]] = (acc[obj[key]] || 0) + 1;
      return acc;
    }, {});

  // Line chart for Age
  charts.push(
    createLineChart("ageChart", count("Age"), "Age Distribution")
  );

  // Bar chart for Gender
  charts.push(
    createBarChart("genderChart", count("Gender"), "Gender Distribution")
  );

  // Bar chart for Location
  charts.push(
    createBarChart("locationChart", count("Location"), "Location Distribution")
  );

  // Pie chart for Season
  charts.push(
    createPieChart("seasonChart", count("Season"), "Seasonal Trends")
  );
}

// new backend chart generation code

function generateChartsFromBackend(data) {

  clearChartsOnly();

  if(data.Gender){
    charts.push(
      createBarChart("genderChart", data.Gender, "Gender Distribution")
    );
  }

  if(data.Location){
    charts.push(
      createBarChart("locationChart", data.Location, "Location Distribution")
    );
  }

  if(data.Season){
    charts.push(
      createPieChart("seasonChart", data.Season, "Seasonal Trends")
    );
  }

  if(data.Age){
    charts.push(
      createLineChart("ageChart", data.Age, "Age Distribution")
    );
  }

}

/* =======================
   CHART TYPES & STYLING
   - Visualization only; IDs and data logic unchanged
======================= */
const chartPalette = {
  primary: "#2b6cb0",
  secondary: "#4fd1c5",
  accent: "#805AD5",
  warning: "#F6AD55",
  success: "#48BB78",
  gray: "#A0AEC0"
};

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 900,
    easing: "easeInOutCubic"
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#2d3748",
        font: {
          family: "Poppins, Arial, sans-serif",
          size: 11
        },
        usePointStyle: true,
        padding: 12
      }
    },
    tooltip: {
      backgroundColor: "rgba(26, 32, 44, 0.9)",
      titleColor: "#f7fafc",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(255,255,255,0.12)",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      displayColors: true
    }
  }
};

function createBarChart(id, values, title) {
  const ctx = document.getElementById(id);
  const labels = Object.keys(values);
  const dataValues = Object.values(values);

  // Use horizontal layout for location chart only
  const isLocation = id === "locationChart";

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: dataValues,
        backgroundColor: labels.map(function (_l, i) {
          const colors = [
            chartPalette.primary,
            chartPalette.secondary,
            chartPalette.accent,
            chartPalette.success,
            chartPalette.warning
          ];
          return colors[i % colors.length];
        }),
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: chartPalette.secondary
      }]
    },
    options: {
      ...baseChartOptions,
      indexAxis: isLocation ? "y" : "x",
      scales: {
        x: {
          grid: {
            color: "rgba(226, 232, 240, 0.7)",
            borderDash: [4, 4]
          },
          ticks: {
            color: "#4a5568",
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: "rgba(226, 232, 240, 0.7)",
            borderDash: [4, 4]
          },
          ticks: {
            color: "#4a5568",
            font: {
              size: 11
            },
            precision: 0
          },
          beginAtZero: true
        }
      }
    }
  });
}

function createPieChart(id, values, title) {
  const ctx = document.getElementById(id);
  const labels = Object.keys(values);
  const dataValues = Object.values(values);

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: dataValues,
        backgroundColor: labels.map(function (_l, i) {
          const colors = [
            chartPalette.primary,
            chartPalette.secondary,
            chartPalette.accent,
            chartPalette.success,
            chartPalette.warning
          ];
          return colors[i % colors.length];
        }),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      ...baseChartOptions,
      cutout: "60%"
    }
  });
}

function createLineChart(id, values, title) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  const labels = Object.keys(values);
  const dataValues = Object.values(values);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(79, 209, 197, 0.45)");
  gradient.addColorStop(1, "rgba(79, 209, 197, 0.02)");

  return new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: dataValues,
        fill: true,
        tension: 0.4,
        borderColor: chartPalette.secondary,
        backgroundColor: gradient,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: chartPalette.secondary,
        pointBorderWidth: 2
      }]
    },
    options: {
      ...baseChartOptions,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#4a5568",
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: "rgba(226, 232, 240, 0.7)",
            borderDash: [4, 4]
          },
          ticks: {
            color: "#4a5568",
            font: {
              size: 11
            },
            precision: 0
          },
          beginAtZero: true
        }
      }
    }
  });
}

/* =======================
   CLEAR DASHBOARD
======================= */
function clearDashboard() {
  document.getElementById("excelFile").value = "";
  clearChartsOnly();
  updateSummaryFromCharts();
  try {
    sessionStorage.removeItem(LAST_ANALYSIS_KEY);
  } catch (_e) {
    // ignore
  }
}

/* =======================
   CLEAR CHARTS ONLY
======================= */
function clearChartsOnly() {
  charts.forEach(chart => chart.destroy());
  charts = [];
}

function logout() {
  const confirmLogout = confirm("Do you want to logout?");
  if (confirmLogout) {
    window.location.href = "index.html"; // redirect to login page
  }
  // if cancel, stay on same page
}

/* =======================
   SUMMARY STATISTICS (DASHBOARD)
   - Update ONLY after charts are generated (no timers)
======================= */
function getEl(id) {
  return document.getElementById(id);
}

function findChartByCanvasId(targetId) {
  if (!Array.isArray(charts)) return null;
  return (
    charts.find(function (c) {
      return c && c.canvas && c.canvas.id === targetId;
    }) || null
  );
}

function updateSummaryFromCharts() {
  var totalEl = getEl("summaryTotalStudents");
  var genderEl = getEl("summaryGenderRatio");
  var locEl = getEl("summaryLocations");
  var seasonEl = getEl("summarySeason");

  // Not on dashboard page (or DOM not ready yet)
  if (!totalEl || !genderEl || !locEl || !seasonEl) {
    return;
  }

  if (!charts || charts.length === 0) {
    totalEl.textContent = "-";
    genderEl.textContent = "-";
    locEl.textContent = "-";
    seasonEl.textContent = "-";
    return;
  }

  // Total + gender breakdown from gender chart
  var genderChart = findChartByCanvasId("genderChart");
  if (genderChart && genderChart.data && genderChart.data.datasets && genderChart.data.datasets[0]) {
    var labels = genderChart.data.labels || [];
    var values = genderChart.data.datasets[0].data || [];
    var total = values.reduce(function (sum, v) {
      return sum + (Number(v) || 0);
    }, 0);

    var maleCount = 0;
    var femaleCount = 0;

    labels.forEach(function (label, idx) {
      var v = Number(values[idx]) || 0;
      var lower = String(label || "").toLowerCase();
      if (lower.indexOf("male") !== -1 && lower.indexOf("fe") === -1) {
        maleCount += v;
      } else if (lower.indexOf("female") !== -1 || lower === "f") {
        femaleCount += v;
      }
    });

    totalEl.textContent = total > 0 ? total : "-";
    genderEl.textContent = (maleCount || femaleCount) ? (maleCount + " / " + femaleCount) : "-";
  } else {
    totalEl.textContent = "-";
    genderEl.textContent = "-";
  }

  // Unique locations
  var locChart = findChartByCanvasId("locationChart");
  if (locChart && locChart.data && Array.isArray(locChart.data.labels)) {
    var uniqueCount = locChart.data.labels.length;
    locEl.textContent = uniqueCount > 0 ? uniqueCount : "-";
  } else {
    locEl.textContent = "-";
  }

  // Most popular season
  var seasonChart = findChartByCanvasId("seasonChart");
  if (seasonChart && seasonChart.data && seasonChart.data.datasets && seasonChart.data.datasets[0]) {
    var sLabels = seasonChart.data.labels || [];
    var sValues = seasonChart.data.datasets[0].data || [];
    var maxVal = -1;
    var maxLabel = "";
    sValues.forEach(function (v, idx) {
      var num = Number(v) || 0;
      if (num > maxVal) {
        maxVal = num;
        maxLabel = sLabels[idx] || "";
      }
    });
    seasonEl.textContent = maxVal > 0 && maxLabel ? maxLabel : "-";
  } else {
    seasonEl.textContent = "-";
  }
}

// Restore charts after an accidental Live Server reload (e.g., dataset file saved)
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var raw = null;
    try {
      raw = sessionStorage.getItem(LAST_ANALYSIS_KEY);
    } catch (_e) {
      raw = null;
    }
    if (!raw) return;

    try {
      var parsed = JSON.parse(raw);
      generateChartsFromBackend(parsed);
      updateSummaryFromCharts();
    } catch (e) {
      // If corrupted, clear it so it doesn't keep failing
      try {
        sessionStorage.removeItem(LAST_ANALYSIS_KEY);
      } catch (_e2) {}
    }
  });
}

/* =======================
   EXPORT / DOWNLOAD REPORT
   - Uses existing charts + summary DOM
======================= */
function downloadReport() {
  if (!Array.isArray(charts) || charts.length === 0) {
    alert("Please analyze data before downloading the report.");
    return;
  }

  var totalEl = document.getElementById("summaryTotalStudents");
  var genderEl = document.getElementById("summaryGenderRatio");
  var locEl = document.getElementById("summaryLocations");
  var seasonEl = document.getElementById("summarySeason");

  var total = totalEl ? totalEl.textContent : "-";
  var gender = genderEl ? genderEl.textContent : "-";
  var locations = locEl ? locEl.textContent : "-";
  var season = seasonEl ? seasonEl.textContent : "-";

  var now = new Date();
  var stamp = now.toISOString().replace(/[:.]/g, "-");

  // Generate ONLY ONE PDF report (summary + ALL charts)
  try {
    var jsPDFNamespace = window.jspdf || window.jsPDF;
    if (!jsPDFNamespace) {
      alert("PDF export library not loaded. Please refresh and try again.");
      return;
    }
    var jsPDFCtor = jsPDFNamespace.jsPDF || jsPDFNamespace;
    var doc = new jsPDFCtor("p", "pt", "a4");

    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    var marginX = 40;
    var y = 40;

    doc.setFontSize(16);
    doc.text("Analytics Summary Report", 40, y);
    y += 24;

    doc.setFontSize(11);
    doc.text("Generated: " + now.toLocaleString(), 40, y);
    y += 22;

    doc.text("Total Students: " + total, 40, y); y += 16;
    doc.text("Male / Female: " + gender, 40, y); y += 16;
    doc.text("Unique Locations: " + locations, 40, y); y += 16;
    doc.text("Most Popular Season: " + season, 40, y); y += 24;

    // Add ALL charts, one per section, with paging as needed
    var maxImageWidth = pageWidth - marginX * 2;
    var imageHeight = 260;

    charts.forEach(function (chart) {
      if (!chart || !chart.canvas) return;

      var imgData;
      try {
        imgData = chart.toBase64Image("image/png", 1);
      } catch (e) {
        return;
      }
      if (!imgData) return;

      if (y + imageHeight + 40 > pageHeight) {
        doc.addPage();
        y = 40;
      }

      doc.addImage(imgData, "PNG", marginX, y, maxImageWidth, imageHeight);
      y += imageHeight + 20;
    });

    doc.save("analytics-report-" + stamp + ".pdf");
  } catch (e) {
    console.error("PDF generation failed:", e);
    alert("Could not generate PDF report.");
  }
}
