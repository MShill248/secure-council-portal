const API_BASE = "http://localhost:3000";
const visualiseDiv = document.querySelector("#visualise-div");

const categorySelection = document.querySelector('#requestCategory');
const criticalCondition = document.querySelector('#critical');
const severeCondition = document.querySelector('#severe');
const moderateCondition = document.querySelector('#moderate');
const minorCondition = document.querySelector('#minor');

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

categorySelection.addEventListener('change', async () => {
    const response = await fetch(`http://localhost:3000/request/category/${categorySelection.value}`)
    if (!response.ok) throw new Error("Failed to fetch requests")
    const requests = await response.json()
    const { x, y } = aggregateBoroughData(requests)
    const critical = Math.max(...y)
    for(let i = 0; i < x.length; i++) {
        const selectedBorough = document.querySelector(`#${x[i]}`.replace(/ /g, ''))
        selectedBorough.classList.remove(...selectedBorough.classList)
        if(y[i] >= 0.9 * critical) selectedBorough.classList.add('critical')
        else if(y[i] >= 0.7 * critical) selectedBorough.classList.add('severe')
        else if(y[i] >= 0.4 * critical) selectedBorough.classList.add('moderate')
        else if(y[i] >= 0.1 * critical) selectedBorough.classList.add('minor')
    }
    criticalCondition.textContent = `> ${Math.round(0.9*critical)}`
    severeCondition.textContent = `> ${Math.round(0.7*critical)}`
    moderateCondition.textContent = `> ${Math.round(0.4*critical)}`
    minorCondition.textContent = `> ${Math.round(0.1*critical)}`
})

// async function aggregateBoroughData(requestData) {
//     const aggregated = {};
//     const promises = requestData.map(async (request) => {
//         const user = await getUserData(request)
//         return user
//     })
//     const users = await Promise.all(promises);
//     for (const user of users) {
//         const { borough } = user;
//         const key = `${borough}`;
//         if (!aggregated[key]) {
//             aggregated[key] = {
//                 total: 0,
//             };
//         }
//         aggregated[key].total += 1;
//     }
//     const x = [];
//     const y = [];
//     Object.entries(aggregated).forEach(entry => {
//         x.push(entry[0]); 
//         y.push(entry[1].total);                
//     });
//     return { x, y };
// };
const aggregateBoroughData = (requestData) => {
    const aggregated = {};
    requestData.forEach(request => {
        const { borough } = request;
        const key = `${borough}`;

        if (!aggregated[key]) {
        aggregated[key] = {
            total: 0,
        };
        }

        aggregated[key].total += 1;
    });
    const x = [];
    const y = [];
    Object.entries(aggregated).forEach(entry => {
        x.push(entry[0]); 
        y.push(entry[1].total);                  
    });

    return { x, y };
};

async function getUserData(request) {
        const {user_id} = request;
        const response = await fetch(`http://localhost:3000/user/${user_id}`)
        if (!response.ok) throw new Error("Failed to fetch user details")
        return await response.json();
}