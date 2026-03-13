/* =======================
   GLOBAL VARIABLES
======================= */
let charts = [];

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
function analyze() {
  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an Excel file");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    generateCharts(sheetData);
  };

  reader.readAsArrayBuffer(file);
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

/* =======================
   CHART TYPES
======================= */
function createBarChart(id, values, title) {
  return new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels: Object.keys(values),
      datasets: [{
        label: title,
        data: Object.values(values)
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createPieChart(id, values, title) {
  return new Chart(document.getElementById(id), {
    type: "pie",
    data: {
      labels: Object.keys(values),
      datasets: [{
        label: title,
        data: Object.values(values)
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createLineChart(id, values, title) {
  return new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels: Object.keys(values),
      datasets: [{
        label: title,
        data: Object.values(values),
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true
    }
  });
}

/* =======================
   CLEAR DASHBOARD
======================= */
function clearDashboard() {
  document.getElementById("excelFile").value = "";
  clearChartsOnly();
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
