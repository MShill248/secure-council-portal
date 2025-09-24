const API_BASE = "http://localhost:3000";
const visualiseDiv = document.querySelector("#visualise-div");

async function fetchCategoryChartHTML() {
  const res = await fetch(`${API_BASE}/request/requestInfo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  if (!res.ok) throw new Error(`requestInfo failed: ${res.status}`);
  return res.json();
}

function generateCategoryChart(html) {
  visualiseDiv.innerHTML = html;
  const scripts = visualiseDiv.querySelectorAll("script");
  scripts.forEach((oldScript) => {
    const s = document.createElement("script");
    if (oldScript.src) s.src = oldScript.getAttribute("src");
    s.text = oldScript.textContent;
    document.body.appendChild(s);
  });
}

async function renderVisualisation() {
  try {
    const data = await fetchCategoryChartHTML();
    if (data?.success && data.visualisation?.visualisation_html) {
      generateCategoryChart(data.visualisation.visualisation_html);
    } else {
      visualiseDiv.innerHTML = `<div class="alert alert-warning">No data available.</div>`;
    }
  } catch (err) {
    console.error(err);
    visualiseDiv.innerHTML = `<div class="alert alert-danger">Failed to load chart.</div>`;
  }
}

async function renderUsersByBoroughPie() {
  try {
    const res = await fetch("http://localhost:3000/user", {
      headers: { Authorization: localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error(`GET /user failed: ${res.status}`);
    const users = await res.json();

    const tallies = new Map(); // key = canonical (lowercased), value = { label, count }
    for (const u of users || []) {
      const raw = (u.borough ?? "Unknown").toString().trim();
      const key = raw.toLowerCase();
      const entry = tallies.get(key) || { label: raw, count: 0 };
      entry.count += 1;
      if (!tallies.has(key)) tallies.set(key, entry);
      else tallies.set(key, { label: entry.label, count: entry.count });
    }

    const labels = Array.from(tallies.values()).map(v => v.label);
    const values = Array.from(tallies.values()).map(v => v.count);

  
    const trace = {
      type: "pie",
      labels,
      values,
      hole: 0.3,
      textinfo: "label+percent",
      hovertemplate: "%{label}: %{value} users<extra></extra>"
    };
    const layout = {
      margin: { t: 20, r: 20, b: 20, l: 20 },
      legend: { orientation: "h" }
    };

    Plotly.newPlot("usersBoroughPie", [trace], layout, { responsive: true });
  } catch (err) {
    console.error(err);
    const el = document.getElementById("usersBoroughPie");
    if (el) el.innerHTML = `<div class="alert alert-danger">Couldn’t load user data.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", renderUsersByBoroughPie);
document.addEventListener("DOMContentLoaded", renderVisualisation);
