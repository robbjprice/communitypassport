const CAMPAIGN = {
  slug: "social-sundays",
  title: "Social Sundays",
  community: "Marda Loop",
  date: "June 2026",
};

const STORAGE = {
  participant: "communityPassportParticipant",
  stamps: "communityPassportStamps",
  selected: "communityPassportSelectedBusinesses",
  emails: "communityPassportEmailHistory",
  admins: "communityPassportAdminUsers",
  adminLoggedIn: "communityPassportAdminLoggedIn",
};

let businesses = getJSON("communityPassportBusinesses", [
  { id: "blush-lane", name: "Blush Lane Organic Market", type: "Grocery", address: "2044 33 Avenue SW", lat: 51.0242, lng: -114.1104 },
  { id: "phil-sebastian", name: "Phil & Sebastian", type: "Coffee", address: "2043 33 Avenue SW", lat: 51.0245, lng: -114.1101 },
  { id: "annabelles-kitchen", name: "Annabelle’s Kitchen", type: "Restaurant", address: "3574 Garrison Gate SW", lat: 51.0219, lng: -114.1169 },
  { id: "belmont-diner", name: "Belmont Diner", type: "Restaurant", address: "2008 33 Avenue SW", lat: 51.0243, lng: -114.1092 },
  { id: "big-fish-open-range", name: "Big Fish & Open Range", type: "Restaurant", address: "1112 Edmonton Trail NE", lat: 51.0238, lng: -114.1121 },
  { id: "cobs-bread", name: "COBS Bread", type: "Bakery", address: "2032 33 Avenue SW", lat: 51.0243, lng: -114.1098 },
  { id: "village-ice-cream", name: "Village Ice Cream", type: "Dessert", address: "2406 34 Avenue SW", lat: 51.0232, lng: -114.1149 },
  { id: "mercato", name: "Mercato West", type: "Restaurant", address: "873 85 Street SW", lat: 51.0225, lng: -114.1182 },
  { id: "marda-loop-brewing", name: "Marda Loop Brewing", type: "Brewery", address: "3523 18 Street SW", lat: 51.0228, lng: -114.1076 },
  { id: "distilled-beauty", name: "Distilled Beauty Bar", type: "Beauty", address: "Marda Loop", lat: 51.0237, lng: -114.115 },
  { id: "marda-loop-barber", name: "Marda Loop Barber", type: "Services", address: "Marda Loop", lat: 51.025, lng: -114.113 },
  { id: "orange-theory", name: "Orangetheory Fitness", type: "Fitness", address: "Marda Loop", lat: 51.022, lng: -114.109 },
  { id: "shoppers-marda", name: "Shoppers Drug Mart", type: "Pharmacy", address: "Marda Loop", lat: 51.023, lng: -114.111 },
  { id: "safeway-marda", name: "Safeway Marda Loop", type: "Grocery", address: "Marda Loop", lat: 51.026, lng: -114.112 },
  { id: "starbucks-marda", name: "Starbucks Marda Loop", type: "Coffee", address: "Marda Loop", lat: 51.025, lng: -114.110 },
  { id: "globefish", name: "Globefish Sushi", type: "Restaurant", address: "Marda Loop", lat: 51.0218, lng: -114.1138 },
  { id: "towa-sushi", name: "Towa Sushi", type: "Restaurant", address: "Marda Loop", lat: 51.0228, lng: -114.118 },
  { id: "my-favourite-ice-cream", name: "My Favourite Ice Cream Shoppe", type: "Dessert", address: "Marda Loop", lat: 51.0239, lng: -114.106 },
  { id: "sandy-beach-dental", name: "Sandy Beach Dental", type: "Health", address: "Marda Loop", lat: 51.0224, lng: -114.1065 },
  { id: "marda-loop-vet", name: "Marda Loop Veterinary Centre", type: "Pets", address: "Marda Loop", lat: 51.0249, lng: -114.116 },
  { id: "marda-loop-medical", name: "Marda Loop Medical Clinic", type: "Health", address: "Marda Loop", lat: 51.0241, lng: -114.1142 },
  { id: "marda-loop-pharmacy", name: "Marda Loop Pharmacy", type: "Pharmacy", address: "Marda Loop", lat: 51.0238, lng: -114.1129 },
  { id: "good-earth", name: "Good Earth Coffeehouse", type: "Coffee", address: "Marda Loop", lat: 51.0247, lng: -114.1116 },
  { id: "fresh-kitchen", name: "Fresh Kitchen", type: "Restaurant", address: "Marda Loop", lat: 51.0229, lng: -114.1158 },
  { id: "pet-planet", name: "Pet Planet", type: "Pets", address: "Marda Loop", lat: 51.0246, lng: -114.1162 },
  { id: "the-source", name: "The Source", type: "Retail", address: "Marda Loop", lat: 51.024, lng: -114.1094 },
  { id: "marda-loop-chiro", name: "Marda Loop Chiropractic", type: "Health", address: "Marda Loop", lat: 51.0235, lng: -114.117 },
  { id: "marda-loop-optical", name: "Marda Loop Optometry", type: "Health", address: "Marda Loop", lat: 51.0227, lng: -114.1165 },
  { id: "lululemon-local", name: "Local Activewear Studio", type: "Fitness", address: "Marda Loop", lat: 51.0221, lng: -114.1119 },
  { id: "marda-loop-yoga", name: "Marda Loop Yoga", type: "Fitness", address: "Marda Loop", lat: 51.0219, lng: -114.1099 },
  { id: "urban-cellars", name: "Urban Cellars", type: "Retail", address: "Marda Loop", lat: 51.0236, lng: -114.1087 },
  { id: "marda-loop-florist", name: "Marda Loop Florist", type: "Retail", address: "Marda Loop", lat: 51.0248, lng: -114.1089 },
  { id: "boutique-west", name: "Boutique West", type: "Retail", address: "Marda Loop", lat: 51.0254, lng: -114.1118 },
  { id: "prairie-dog-brewing", name: "Prairie Dog Brewing Market", type: "Restaurant", address: "Marda Loop", lat: 51.0231, lng: -114.1185 },
  { id: "marda-loop-books", name: "Marda Loop Books", type: "Retail", address: "Marda Loop", lat: 51.0217, lng: -114.1125 },
  { id: "the-sweat-lab", name: "The Sweat Lab", type: "Fitness", address: "Marda Loop", lat: 51.0209, lng: -114.1136 },
  { id: "marda-hair-studio", name: "Marda Hair Studio", type: "Beauty", address: "Marda Loop", lat: 51.0215, lng: -114.1153 },
  { id: "modern-nails", name: "Modern Nails Marda Loop", type: "Beauty", address: "Marda Loop", lat: 51.0252, lng: -114.1151 },
  { id: "local-laundry", name: "Local Laundry", type: "Retail", address: "Marda Loop", lat: 51.0206, lng: -114.1107 },
  { id: "marda-loop-pilates", name: "Marda Loop Pilates", type: "Fitness", address: "Marda Loop", lat: 51.0262, lng: -114.1136 },
]);

const defaultSelected = [
  "blush-lane",
  "phil-sebastian",
  "annabelles-kitchen",
  "belmont-diner",
  "big-fish-open-range",
  "cobs-bread",
];
const demoParticipants = [
  { name: "Ava Chen", email: "ava@example.com", postalCode: "T2T 1A1", stamps: 6 },
  { name: "Liam Johnson", email: "liam@example.com", postalCode: "T2T 2B2", stamps: 5 },
  { name: "Sofia Patel", email: "sofia@example.com", postalCode: "T3E 1C3", stamps: 4 },
  { name: "Noah Williams", email: "noah@example.com", postalCode: "T2V 3K4", stamps: 3 },
  { name: "Mia Brown", email: "mia@example.com", postalCode: "T2N 4P8", stamps: 2 },
  { name: "Ethan Lee", email: "ethan@example.com", postalCode: "T3H 5L2", stamps: 1 },
  { name: "Olivia Martin", email: "olivia@example.com", postalCode: "T4B 0A2", stamps: 5 },
  { name: "Lucas Wilson", email: "lucas@example.com", postalCode: "T4C 1M2", stamps: 3 },
  { name: "Emma Garcia", email: "emma@example.com", postalCode: "T1S 1A4", stamps: 6 },
  { name: "Jack Thompson", email: "jack@example.com", postalCode: "T0M 0W0", stamps: 2 },
  { name: "Harper Scott", email: "harper@example.com", postalCode: "T2G 0A1", stamps: 4 },
  { name: "Benjamin Clark", email: "ben@example.com", postalCode: "T2P 3N4", stamps: 1 },
];
const postalAreas = {
  T2T: "Marda Loop / Altadore / South Calgary",
  T3E: "Glendale / Westgate / Signal Hill area",
  T2V: "Chinook Park / Haysboro / South Calgary",
  T2N: "Kensington / Hillhurst / University area",
  T3H: "West Springs / Aspen Woods / Signal Hill",
  T4B: "Airdrie",
  T4C: "Cochrane",
  T1S: "Okotoks",
  T0M: "Rural / surrounding communities",
  T2G: "Beltline / Victoria Park / East Village area",
  T2P: "Downtown Calgary",
};
const rewardTiers = [
  { count: 1, title: "Weekly Prize Entry", description: "Collect 1 stamp to earn a weekly prize entry." },
  { count: 3, title: "Bonus Prize Entry", description: "Collect 3 stamps to unlock an extra prize entry." },
  { count: 5, title: "Grand Prize Entry", description: "Collect 5 stamps to qualify for the grand prize draw." },
  { count: "all", title: "$1,000 Marda Loop Shopping Spree", description: "Complete your full passport to qualify for the $1,000 Marda Loop shopping spree." },
];

let participant = getJSON(STORAGE.participant, null);
let stamps = getJSON(STORAGE.stamps, []);
let selectedBusinessIds = getJSON(STORAGE.selected, defaultSelected);
let emailHistory = getJSON(STORAGE.emails, []);
let adminUsers = getJSON(STORAGE.admins, [
  { name: "Robb Price", email: "admin@theloopsocial.ca", role: "master" },
]);
let adminLoggedIn = getJSON(STORAGE.adminLoggedIn, false);

function $(id) {
  return document.getElementById(id);
}

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function selectedBusinesses() {
  return businesses.filter((business) => selectedBusinessIds.includes(business.id));
}

function stampsForCampaign() {
  return stamps.filter((stamp) => stamp.campaign === CAMPAIGN.slug);
}

function stampExists(businessId) {
  return stamps.some((stamp) => stamp.campaign === CAMPAIGN.slug && stamp.businessId === businessId);
}

function showTab(tabId) {
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));

  const page = $(tabId);
  if (page) page.classList.add("active");

  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach((tab) => tab.classList.add("active"));
}

function requireParticipant(callback) {
  if (participant) {
    callback();
    return;
  }

  const modal = $("registrationModal");
  if (modal) modal.classList.remove("hidden");

  window.pendingAfterRegister = callback;
}

function registerParticipant() {
  const name = $("regName")?.value.trim();
  const email = $("regEmail")?.value.trim();
  const postal = $("regPostal")?.value.trim();
  const consentAccepted = document.getElementById("consentCheckbox").checked;

if (!consentAccepted) {
  alert("Please review and accept the participation consent to continue.");
  return;
}

  if (!name || !email || !postal) {
    alert("Please enter your name, email, and postal code.");
    return;
  }

  participant = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    email,
    postalCode: postal,
    campaign: CAMPAIGN.slug,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };

  setJSON(STORAGE.participant, participant);

  const modal = $("registrationModal");
  if (modal) modal.classList.add("hidden");

  if (typeof window.pendingAfterRegister === "function") {
    window.pendingAfterRegister();
    window.pendingAfterRegister = null;
  }

  renderAll();
}

function collectStamp(businessId) {
  const business = businesses.find((item) => item.id === businessId);

  if (!business) {
    setScanMessage("Business not found. Please check the QR code.", "error");
    showTab("passport");
    return;
  }

  requireParticipant(() => {
    if (stampExists(businessId)) {
      setScanMessage(`Already collected: ${business.name}`, "duplicate");
    } else {
      stamps.push({
        campaign: CAMPAIGN.slug,
        participantId: participant.id,
        participantName: participant.name,
        email: participant.email,
        postalCode: participant.postalCode,
        businessId,
        businessName: business.name,
        businessType: business.type,
        scannedAt: new Date().toISOString(),
        scanSource: "qr-or-demo",
        userAgent: navigator.userAgent,
      });

      participant.lastSeenAt = new Date().toISOString();

      setJSON(STORAGE.stamps, stamps);
      setJSON(STORAGE.participant, participant);

      setScanMessage(`Stamp collected at ${business.name}!`, "success");
    }

    showTab("passport");
    renderAll();
  });
}

function setScanMessage(message, status = "default") {
  const scanResult = $("scanResult");
  if (!scanResult) return;

  scanResult.textContent = message;
  scanResult.dataset.status = status;
}

function mapUrlForBusiness(business) {
  const fullAddress = business.address === "Marda Loop"
    ? `${business.name}, Marda Loop, Calgary, AB`
    : `${business.name}, ${business.address}, Calgary, AB`;

  const query = encodeURIComponent(fullAddress);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return `https://maps.apple.com/?q=${query}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function openBusinessMap(business) {
  window.open(mapUrlForBusiness(business), "_blank", "noopener,noreferrer");
}
function openDemoCameraThenCollect(businessId) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment";
  input.style.display = "none";

  document.body.appendChild(input);

  let collected = false;

  function finishDemoScan() {
    if (collected) return;
    collected = true;

    setTimeout(() => {
      collectStamp(businessId);
      input.remove();
    }, 400);
  }

  input.addEventListener("change", finishDemoScan);

  window.addEventListener("focus", finishDemoScan, { once: true });

  input.click();
}
function renderPassport() {
  const selected = selectedBusinesses();

  const collected = stampsForCampaign().filter((stamp) =>
    selectedBusinessIds.includes(stamp.businessId)
  );

  const count = collected.length;
  const total = selected.length || 1;

  if ($("participantName")) {
    $("participantName").textContent = participant ? participant.name : "Guest participant";
  }

  if ($("participantMeta")) {
    $("participantMeta").textContent = participant
      ? `${participant.email} · ${participant.postalCode}`
      : "Register once, then scan QR codes to collect stamps.";
  }

  if ($("progressCount")) $("progressCount").textContent = `${count}/${selected.length}`;
  if ($("progressFill")) $("progressFill").style.width = `${Math.round((count / total) * 100)}%`;

  const stampGrid = $("stampGrid");

  if (stampGrid) {
    stampGrid.innerHTML = "";

    selected.forEach((business) => {
      const collectedHere = stampExists(business.id);
      const stampCard = document.createElement("div");

      stampCard.className = `stamp ${collectedHere ? "collected" : "pending"}`;

      stampCard.innerHTML = `
        <div class="stamp-top">
          <div class="stamp-business">
            <strong>${business.name}</strong>
            <span>${business.address}</span>
          </div>

          ${
            collectedHere
              ? `
                <div class="stamp-status collected-status">
                 <div class="stamp-check">✓</div>
<small>Collected</small>
                </div>
              `
              : `
                <button class="stamp-status pending-status" type="button" aria-label="Scan QR code for ${business.name}">
  <div class="stamp-qr">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
  <small>Scan QR to Collect</small>
</button>
              `
          }
        </div>

        <div class="stamp-bottom">
          <button class="map-hint" type="button">Tap for map</button>
        </div>
      `;

      const mapButton = stampCard.querySelector(".map-hint");
      mapButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        openBusinessMap(business);
      });

      const scanButton = stampCard.querySelector(".pending-status");
scanButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  openDemoCameraThenCollect(business.id);
});

      stampGrid.appendChild(stampCard);
    });
  }

  const rewardList = $("rewardList");

  if (rewardList) {
    rewardList.innerHTML = "";

    rewardTiers.forEach((tier) => {
      const needed = tier.count === "all" ? selected.length : tier.count;
      const unlocked = count >= needed;

      const reward = document.createElement("div");
      reward.className = `reward ${unlocked ? "unlocked" : ""}`;

      const progressText = `${Math.min(count, needed)}/${needed} completed`;
const progressPercent = Math.min(100, Math.round((count / needed) * 100));

reward.innerHTML = `
  <div>
    <strong>${tier.title}</strong>
    <span>${tier.description}</span>
  </div>

  <div class="reward-progress">
    <div class="reward-progress-top">
      <small>${unlocked ? "Unlocked" : progressText}</small>
    </div>
    <div class="reward-progress-track">
      <div class="reward-progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  </div>
`;

      rewardList.appendChild(reward);
    });
  }
}

function renderScanButtons() {
  const scanButtons = $("scanButtons");
  if (!scanButtons) return;

  scanButtons.innerHTML = "";

  selectedBusinesses().forEach((business) => {
    const button = document.createElement("button");
    button.className = "secondary-btn";
    button.textContent = business.name;
    button.addEventListener("click", () => collectStamp(business.id));
    scanButtons.appendChild(button);
  });
}
function businessIdFromName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function saveBusinesses() {
  setJSON("communityPassportBusinesses", businesses);
}

function addBusiness() {
  const name = $("newBusinessName")?.value.trim();
  const type = $("newBusinessType")?.value.trim();
  const address = $("newBusinessAddress")?.value.trim();

  if (!name || !type || !address) {
    alert("Please enter business name, category, and address.");
    return;
  }

  const id = businessIdFromName(name);

  if (businesses.some((business) => business.id === id)) {
    alert("That business already exists.");
    return;
  }

  businesses.push({
    id,
    name,
    type,
    address,
    lat: 51.023,
    lng: -114.112,
  });

  selectedBusinessIds.push(id);
  selectedBusinessIds = [...new Set(selectedBusinessIds)];

  saveBusinesses();

  setJSON(STORAGE.selected, selectedBusinessIds);

  $("newBusinessName").value = "";
  $("newBusinessType").value = "";
  $("newBusinessAddress").value = "";

  renderAll();
}

function downloadBusinessTemplate() {
  const rows = [
    ["name", "type", "address"],
    ["Example Cafe", "Coffee", "1234 33 Avenue SW"],
    ["Example Boutique", "Retail", "Marda Loop"],
  ];

  exportCSV("business-upload-template.csv", rows);
}

function uploadBusinessCsv(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const text = reader.result;

    const lines = text.split(/\r?\n/).filter(Boolean);

    const rows = lines.slice(1);

    rows.forEach((line) => {
      const [name, type, address] = line
        .split(",")
        .map((item) => item?.trim());

      if (!name || !type || !address) return;

      const id = businessIdFromName(name);

      if (!businesses.some((business) => business.id === id)) {
        businesses.push({
          id,
          name,
          type,
          address,
          lat: 51.023,
          lng: -114.112,
        });

        selectedBusinessIds.push(id);
      }
    });

    selectedBusinessIds = [...new Set(selectedBusinessIds)];

    saveBusinesses();

    setJSON(STORAGE.selected, selectedBusinessIds);

    event.target.value = "";

    renderAll();
  };

  reader.readAsText(file);
}
function renderAdmin() {
  const adminPage = $("admin");

  if (adminPage) {
    adminPage.style.display = adminLoggedIn ? "" : "none";
  }

  if ($("directoryCount")) $("directoryCount").textContent = businesses.length;
  if ($("selectedCount")) $("selectedCount").textContent = selectedBusinessIds.length;
  if ($("participantCount")) $("participantCount").textContent = participant ? 1 : 0;
  if ($("stampCount")) $("stampCount").textContent = stampsForCampaign().length;

  renderBusinessDirectory();

renderQrList();

renderMap();

renderEmailHistory();

renderAdminUsers();

renderPrizeQualifications();

renderPostalHeatMap();

}
function renderPrizeQualifications() {
  const container = $("prizeQualificationList");
  if (!container) return;

  const tiers = [
    { title: "Weekly Prize Entry", needed: 1 },
    { title: "Bonus Prize Entry", needed: 3 },
    { title: "Grand Prize Entry", needed: 5 },
    { title: "$1,000 Marda Loop Shopping Spree", needed: selectedBusinessIds.length },
  ];

  container.innerHTML = "";

  tiers.forEach((tier) => {
    const qualified = demoParticipants.filter((person) => person.stamps >= tier.needed);

    const block = document.createElement("div");
    block.className = "qualification-tier";

    block.innerHTML = `
      <h4>${tier.title} · ${qualified.length} qualified</h4>
      ${
        qualified.length
          ? qualified.map((person) => `
              <div class="qualified-person">
                <strong>${person.name}</strong>
                <span>${person.email}</span>
                <span>${person.postalCode} · ${person.stamps}/${selectedBusinessIds.length} stamps</span>
              </div>
            `).join("")
          : `<p class="muted">No participants have qualified yet.</p>`
      }
    `;

    container.appendChild(block);
  });
}

function renderPostalHeatMap() {
  const container = $("postalHeatMap");
  if (!container) return;

  const counts = {};

  demoParticipants.forEach((person) => {
    const prefix = person.postalCode.split(" ")[0].toUpperCase();
    counts[prefix] = (counts[prefix] || 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((entry) => entry[1]), 1);

  container.innerHTML = entries.map(([prefix, count]) => {
    const width = Math.round((count / max) * 100);

    const area = postalAreas[prefix] || "Calgary / surrounding area";

return `
  <div class="postal-row">
    <div>
      <div class="postal-prefix">${prefix}</div>
      <div class="postal-area">${area}</div>
    </div>

    <div class="postal-bar-track">
      <div class="postal-bar-fill" style="width: ${width}%"></div>
    </div>

    <div class="postal-count">${count}</div>
  </div>
`;
  }).join("");
}
function renderBusinessDirectory() {
  const list = $("businessDirectory");
  if (!list) return;

  const query = $("businessSearch") ? $("businessSearch").value.toLowerCase() : "";

  list.innerHTML = "";

  businesses
    .filter((business) =>
      `${business.name} ${business.type} ${business.address}`.toLowerCase().includes(query)
    )
    .forEach((business) => {
      const row = document.createElement("label");
      row.className = "business-row";

      row.innerHTML = `
        <input type="checkbox" ${selectedBusinessIds.includes(business.id) ? "checked" : ""} />
        <span>
          <strong>${business.name}</strong>
          <small>${business.type} · ${business.address}</small>
        </span>
      `;

      row.querySelector("input").addEventListener("change", (event) => {
        if (event.target.checked) {
          selectedBusinessIds.push(business.id);
        } else {
          selectedBusinessIds = selectedBusinessIds.filter((id) => id !== business.id);
        }

        selectedBusinessIds = [...new Set(selectedBusinessIds)];
        setJSON(STORAGE.selected, selectedBusinessIds);
        renderAll();
      });

      list.appendChild(row);
    });
}

function baseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function qrUrl(businessId) {
  return `${baseUrl()}?campaign=${CAMPAIGN.slug}&business=${businessId}`;
}

function renderQrList() {
  const qrList = $("qrList");
  if (!qrList) return;

  qrList.innerHTML = "";

  selectedBusinesses().forEach((business) => {
    const row = document.createElement("div");
    row.className = "qr-row";

    row.innerHTML = `
      <div>
        <strong>${business.name}</strong>
        <small>${qrUrl(business.id)}</small>
      </div>
      <button type="button">Copy URL</button>
    `;

    row.querySelector("button").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(qrUrl(business.id));
        row.querySelector("button").textContent = "Copied!";

        setTimeout(() => {
          row.querySelector("button").textContent = "Copy URL";
        }, 1200);
      } catch {
        alert("Copy failed. You can manually copy the URL shown.");
      }
    });

    qrList.appendChild(row);
  });
}

function renderMap() {
  const map = $("fauxMap");
  if (!map) return;

  map.innerHTML = "";

  selectedBusinesses().forEach((business, index) => {
    const x = 15 + ((business.lng + 114.12) / 0.02) * 70;
    const y = 80 - ((business.lat - 51.02) / 0.008) * 60;

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = `${Math.max(8, Math.min(92, x))}%`;
    pin.style.top = `${Math.max(10, Math.min(88, y))}%`;
    pin.title = business.name;
    pin.innerHTML = `${index + 1}`;

    map.appendChild(pin);
  });
}

function sendEmail() {
  const subject = $("emailSubject")?.value.trim();
  const body = $("emailBody")?.value.trim();

  if (!subject || !body) {
    alert("Add a subject and message.");
    return;
  }

  emailHistory.unshift({
    subject,
    body,
    recipientCount: participant ? 1 : 0,
    sentAt: new Date().toLocaleString(),
  });

  setJSON(STORAGE.emails, emailHistory);

  $("emailSubject").value = "";
  $("emailBody").value = "";

  renderEmailHistory();
}

function renderEmailHistory() {
  const history = $("emailHistory");
  if (!history) return;

  history.innerHTML = "";

  if (!emailHistory.length) {
    history.innerHTML = `<p class="muted">No emails sent yet.</p>`;
    return;
  }

  emailHistory.forEach((email) => {
    const row = document.createElement("div");
    row.className = "email-row";

    row.innerHTML = `
      <strong>${email.subject}</strong>
      <small>${email.sentAt} · ${email.recipientCount} recipient${email.recipientCount === 1 ? "" : "s"}</small>
    `;

    history.appendChild(row);
  });
}

function renderAdminUsers() {
  const adminList = $("adminUserList");
  if (!adminList) return;

  adminList.innerHTML = "";

  if (!adminUsers.length) {
    adminList.innerHTML = `<p class="muted">No admin users added yet.</p>`;
    return;
  }

  adminUsers.forEach((admin, index) => {
    const row = document.createElement("div");
    row.className = "admin-user-row";

    row.innerHTML = `
      <div>
        <strong>${admin.name}</strong>
        <small>${admin.email} · ${formatRole(admin.role)}</small>
      </div>
      <button type="button" data-admin-index="${index}">Remove</button>
    `;

    row.querySelector("button").addEventListener("click", () => {
      if (!confirm(`Remove ${admin.name} as an admin user?`)) return;

      adminUsers.splice(index, 1);
      setJSON(STORAGE.admins, adminUsers);
      renderAdminUsers();
    });

    adminList.appendChild(row);
  });
}

function addAdminUser() {
  const name = $("adminName")?.value.trim();
  const email = $("adminEmail")?.value.trim();
  const role = $("adminRole")?.value || "viewer";

  if (!name || !email) {
    alert("Add an admin name and email.");
    return;
  }

  adminUsers.push({ name, email, role });
  setJSON(STORAGE.admins, adminUsers);

  $("adminName").value = "";
  $("adminEmail").value = "";
  $("adminRole").value = "master";

  renderAdminUsers();
}

function formatRole(role) {
  if (role === "master") return "Master Admin";
  if (role === "event") return "Event Admin";
  return "Viewer / Export Only";
}

function exportCSV(filename, rows) {
  const csv = rows
    .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

function exportQrCsv() {
  const rows = [["Business", "Type", "Address", "QR URL"]];

  selectedBusinesses().forEach((business) => {
    rows.push([business.name, business.type, business.address, qrUrl(business.id)]);
  });

  exportCSV("social-sundays-qr-urls.csv", rows);
}

function exportDataCsv() {
  const rows = [["Participant", "Email", "Postal Code", "Business", "Business Type", "Scanned At"]];

  stampsForCampaign().forEach((stamp) => {
    rows.push([
      stamp.participantName,
      stamp.email,
      stamp.postalCode,
      stamp.businessName,
      stamp.businessType || "",
      stamp.scannedAt,
    ]);
  });

  exportCSV("social-sundays-participant-stamps.csv", rows);
}

function resetDemo() {
  if (!confirm("Reset demo participant and stamps on this device?")) return;

  localStorage.removeItem(STORAGE.participant);
  localStorage.removeItem(STORAGE.stamps);

  participant = null;
  stamps = [];

  setScanMessage("Demo reset. Scan a QR code or use the test buttons to start again.");
  renderAll();
}

function openAdminLogin() {
  const modal = $("adminLoginModal");
  if (modal) modal.classList.remove("hidden");
}

function closeAdminLogin() {
  const modal = $("adminLoginModal");
  if (modal) modal.classList.add("hidden");

  const password = $("adminPassword");
  if (password) password.value = "";
}

function adminLogin() {
  const password = $("adminPassword")?.value || "";

  if (password !== "loopadmin") {
    alert("Wrong password. Demo password is loopadmin.");
    return;
  }

  adminLoggedIn = true;
  setJSON(STORAGE.adminLoggedIn, true);

  closeAdminLogin();
  showTab("admin");
  renderAll();
}

function adminLogout() {
  adminLoggedIn = false;
  setJSON(STORAGE.adminLoggedIn, false);
  showTab("passport");
  renderAll();
}

function handleUrlScan() {
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get("campaign");
  const business = params.get("business");

  if (business && (!campaign || campaign === CAMPAIGN.slug)) {
    collectStamp(business);
  }
}

function wireEvents() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tab === "admin" && !adminLoggedIn) {
        openAdminLogin();
        return;
        
      }

      showTab(button.dataset.tab);
    });
  });

  $("registerBtn")?.addEventListener("click", registerParticipant);
  $("resetParticipantBtn")?.addEventListener("click", resetDemo);

  $("businessSearch")?.addEventListener("input", renderBusinessDirectory);
$("addBusinessBtn")?.addEventListener("click", addBusiness);

$("downloadBusinessTemplateBtn")?.addEventListener(
  "click",
  downloadBusinessTemplate
);

$("businessCsvUpload")?.addEventListener(
  "change",
  uploadBusinessCsv
);
  $("selectAllBtn")?.addEventListener("click", () => {
    selectedBusinessIds = businesses.map((business) => business.id);
    setJSON(STORAGE.selected, selectedBusinessIds);
    renderAll();
  });

  $("clearAllBtn")?.addEventListener("click", () => {
    selectedBusinessIds = [];
    setJSON(STORAGE.selected, selectedBusinessIds);
    renderAll();
  });

  $("exportQrBtn")?.addEventListener("click", exportQrCsv);
  $("exportDataBtn")?.addEventListener("click", exportDataCsv);
  $("sendEmailBtn")?.addEventListener("click", sendEmail);

  $("adminButton")?.addEventListener("click", openAdminLogin);
  $("adminLoginBtn")?.addEventListener("click", adminLogin);
  $("adminCancelBtn")?.addEventListener("click", closeAdminLogin);
  $("adminLogoutBtn")?.addEventListener("click", adminLogout);
  $("addAdminBtn")?.addEventListener("click", addAdminUser);

  $("adminPassword")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") adminLogin();
  });
}

function renderAll() {
  renderPassport();
  renderScanButtons();
  renderAdmin();
}

wireEvents();
renderAll();
handleUrlScan();
