document.addEventListener("DOMContentLoaded", init);

async function init() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // Try to load borough only if the element exists
  let borough = null;
  const boroughEl = document.getElementById("user-borough");

  if (boroughEl) {
    try {
      const res = await fetch("http://localhost:3000/user/account", {
        headers: { Accept: "application/json", Authorization: token },
      });
      if (res.ok) {
        const user = await res.json();
        borough = user?.borough || null;
        boroughEl.textContent = borough || "Not set";
      } else {
        boroughEl.textContent = "Not set";
      }
    } catch (err) {
      console.error("Failed to load user account:", err);
      boroughEl.textContent = "Not set";
    }
  }

  // Static resource links (prepend borough search if available)
  const RESOURCES = [
    {
      title: "London Councils — News",
      desc:
        "Updates and reports from the cross-party body for London’s 32 boroughs and the City of London.",
      href: "https://www.londoncouncils.gov.uk/news",
    },
    {
      title: "Greater London Authority — Press Releases",
      desc: "City Hall announcements, research, and policy updates.",
      href: "https://www.london.gov.uk/press-releases",
    },
    {
      title: "Office for Local Government (Oflog) — Data Explorer",
      desc:
        "Compare council performance metrics (waste, housing, finance, social care).",
      href: "https://oflog.data.gov.uk/",
    },
    {
      title: "DLUHC — Local Government Announcements",
      desc: "Central government updates for councils.",
      href:
        "https://www.gov.uk/government/announcements?departments%5B%5D=department-for-levelling-up-housing-and-communities",
    },
    {
      title: "ONS — Local Statistics Guide",
      desc:
        "How to find official local area statistics and dashboards from the ONS.",
      href: "https://www.ons.gov.uk/help/localstatistics",
    },
  ];

  if (borough) {
    RESOURCES.unshift({
      title: `${borough} Council — News (search)`,
      desc: "Latest news/results for your borough.",
      href: `https://www.google.com/search?q=${encodeURIComponent(
        borough + " Council news"
      )}`,
    });
  }

  renderResourceCards(RESOURCES);
}

function renderResourceCards(items) {
  const wrap = document.getElementById("news-cards");
  if (!wrap) return;
  wrap.innerHTML = "";

  items.forEach((r) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="border rounded-3 p-3 h-100 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="mb-2">
            <i class="bi bi-link-45deg me-2"></i>${escapeHtml(r.title)}
          </h6>
          <span class="badge bg-secondary-subtle text-secondary border border-secondary">External</span>
        </div>
        <p class="text-muted small mb-3">${escapeHtml(r.desc)}</p>
        <div class="mt-auto text-center">
          <a class="btn btn-sm btn-primary" href="${r.href}" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-box-arrow-up-right me-1"></i> Open
          </a>
        </div>
      </div>`;
    wrap.appendChild(col);
  });
}

function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Logout
document.getElementById("logout")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.assign("index.html");
});
