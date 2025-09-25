const pendingRequests = document.querySelector('#pending-requests')
const resolvedRequests = document.querySelector('#resolved-requests')
const logout = document.querySelector('#logout')
pendingRequests.classList.add('fixed-content')
const summaryChartEl = document.querySelector("#summaryChart");
const statusTally = { pending: 0, reviewed: 0, resolved: 0 };

function resetTally() {
  statusTally.pending = 0;
  statusTally.reviewed = 0;
  statusTally.resolved = 0;
}

function renderSummaryChart() {
  if (!summaryChartEl) return;

  const labels = ["Pending", "Reviewed", "Resolved"];
  const values = [statusTally.pending, statusTally.reviewed, statusTally.resolved];

  if (window.Plotly) {
    const trace = { x: labels, y: values, type: "bar" };
    const layout = {
      // title: "Request Status Summary",
      margin: { t: 40, r: 20, b: 60, l: 40 },
      yaxis: { rangemode: "tozero", dtick: 1 },
    };
    Plotly.react("summaryChart", [trace], layout, { responsive: true });
  } else {
    summaryChartEl.innerHTML = `
      <small class="text-muted">Chart unavailable.</small>
      <div>Pending: <b>${values[0]}</b></div>
      <div>Reviewed: <b>${values[1]}</b></div>
      <div>Resolved: <b>${values[2]}</b></div>`;
  }
}

async function getRequests() {
    let user_role
    let borough
    try {
        const options = {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
            }
        }
        const response = await fetch('http://localhost:3000/user/account', options)
        const data = await response.json()
        user_role = data.user_role
        borough = data.borough
    } catch {
        console.error("Error fetching user information:", error);
    }
    try{
        const options = {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
            }
        }
        
        resetTally();
        
        if (user_role == 'resident'){
            const response = await fetch('http://localhost:3000/request/user', options)
            const data = await response.json()
            if(response.status = 200){
                data.map((i) => {
                    create_elements(i)
            })
            renderSummaryChart()
            }
        }
        else if (user_role == 'council'){
            const response = await fetch('http://localhost:3000/request/borough', options)
            const data = await response.json()
            if(response.status = 200){
                data.map((i) => {
                    create_elements(i)
            })
            renderSummaryChart()
        }
        }
    }
    catch (error) {
        console.error("Error fetching requests:", error);
    }
}

function create_elements(req) {
  const s = (req.status || "").toLowerCase();
  if (s === "pending") statusTally.pending++;
  else if (s === "reviewed") statusTally.reviewed++;
  else if (s === "resolved") statusTally.resolved++;

  if (req.status == "pending") {
    const parent_div = document.createElement("div");
    parent_div.classList.add("card", "mb-3");
    parent_div.addEventListener("click", () => editRequest(req.request_id));

    const div = document.createElement("div");
    div.classList.add(
      "card-body",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    const request = document.createElement("div");

    const title = document.createElement("h6");
    title.classList.add("mb-1");
    title.textContent = req.title;

    const smallText = document.createElement("small");
    smallText.classList.add("text-muted");
    smallText.textContent = `Ref: PND-${req.request_id}`;

    const tagRow = document.createElement("div");
    tagRow.classList.add("d-flex", "gap-2", "mb-1");

    const type = document.createElement("span");
    if (req.type == "service") {
      type.classList.add(
        "badge",
        "bg-danger-subtle",
        "text-danger",
        "border",
        "border-danger"
      );
    } else {
      type.classList.add(
        "badge",
        "bg-primary-subtle",
        "text-primary",
        "border",
        "border-primary"
      );
    }
    type.textContent = req.type.toUpperCase();
    tagRow.appendChild(type);

    request.appendChild(title);
    request.appendChild(tagRow);
    request.appendChild(smallText);

    div.appendChild(request);
    parent_div.appendChild(div);
    pendingRequests.appendChild(parent_div);
  } else if (
    req.status === "resolved" ||
    req.status === "reviewed" ||
    req.status === "unresolved"
  ) {
    const parent = document.createElement("div");
    parent.classList.add("card", "mb-3");
    parent.addEventListener("click", () => viewedRequests(req));

    const body = document.createElement("div");
    body.classList.add(
      "card-body",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    const left = document.createElement("div");

    // TITLE
    const title = document.createElement("h6");
    title.classList.add("mb-1");
    title.textContent = req.title;

    // REQUEST TYPE BADGE
    const tagRow = document.createElement("div");
    tagRow.classList.add("d-flex", "gap-2", "mb-1");

    const type = document.createElement("span");
    if (req.type === "service") {
      type.classList.add(
        "badge",
        "bg-danger-subtle",
        "text-danger",
        "border",
        "border-danger"
      );
    } else {
      type.classList.add(
        "badge",
        "bg-primary-subtle",
        "text-primary",
        "border",
        "border-primary"
      );
    }
    type.textContent = req.type.toUpperCase();

    tagRow.appendChild(type);

    const ref = document.createElement("small");
    ref.classList.add("text-muted");
    ref.textContent = `Ref: RSL-${req.request_id}`;

    left.appendChild(title);
    left.appendChild(tagRow);
    left.appendChild(ref);

    // STATUS BADGE
    const status = document.createElement("span");
    if (req.status === "resolved") {
      status.classList.add(
        "badge",
        "bg-success-subtle",
        "text-success",
        "border",
        "border-success"
      );
      status.textContent = "RESOLVED";
    } else if (req.status === "unresolved") {
      status.classList.add(
        "badge",
        "bg-info-subtle",
        "text-info",
        "border",
        "border-info"
      );
      status.textContent = "UNRESOLVED";
    } else {
      status.classList.add(
        "badge",
        "bg-info-subtle",
        "text-info",
        "border",
        "border-info"
      );
      status.textContent = req.status.toUpperCase();
    }

    body.appendChild(left);
    body.appendChild(status);
    parent.appendChild(body);
    resolvedRequests.appendChild(parent);
  }
}

async function editRequest(e) {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  };
  const response = await fetch("http://localhost:3000/user/account", options);
  const data = await response.json();
  user_role = data.user_role;
  if (user_role == "resident") {
    window.location.assign(`viewEditRequest.html?id=${e}`);
  } else if (user_role == "council") {
    window.location.assign(`viewRequest.html?id=${e}`);
  }
}

async function loadBorough() {
  const boroughDisplay = document.getElementById("user-borough");
  if (!boroughDisplay) return;

  try {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch("http://localhost:3000/user/account", options);
    if (!response.ok) throw new Error("Failed to fetch user details");
    const user = await response.json();
    boroughDisplay.textContent =
      user && user.borough ? user.borough : "Not set";
  } catch (error) {
    console.error("Error loading user details:", error);
    boroughDisplay.textContent = "Not set";
  }
}

async function viewedRequests(e) {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  };
  const response = await fetch("http://localhost:3000/user/account", options);
  const data = await response.json();
  user_role = data.user_role;
  localStorage.setItem("request_id", e.request_id);

  if (user_role == "resident" && e.status == "pending") {
    window.location.assign(`viewEditRequest.html?id=${e.request_id}`);
  } else if (
    user_role == "resident" &&
    (e.status == "reviewed" || e.status == "resolved")
  ) {
    window.location.assign(`viewReviewedResident.html?id=${e.request_id}`);
  } else if (
    user_role == "council" &&
    (e.status == "pending" || e.status == "reviewed")
  ) {
    window.location.assign(`viewRequest.html?id=${e.request_id}`);
  } else {
    window.location.assign(`viewResolvedCouncil.html?id=${e.request_id}`);
  }
}

getRequests();
loadBorough();

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.assign("index.html");
});
