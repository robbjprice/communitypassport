const CAMPAIGN = {
  slug: "social-sundays",
  title: "Social Sundays",
  community: "Marda Loop",
  date: "June 2026"
};

const STORAGE = {
  participant: "communityPassportParticipant",
  stamps: "communityPassportStamps",
  selected: "communityPassportSelectedBusinesses",
  emails: "communityPassportEmailHistory"
};

const businesses = [
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
  { id: "marda-loop-vet", name: "Marda Loop Veterinary Centre", type: "Pets", address: "Marda Loop", lat: 51.0249, lng: -114.116 }
];

const defaultSelected = [
  "blush-lane",
  "phil-sebastian",
  "annabelles-kitchen",
  "belmont-diner",
  "big-fish-open-range",
  "cobs-bread"
];

const rewardTiers = [
  { count: 1, title: "Weekly Prize Entry" },
  { count: 3, title: "Bonus Prize Entry" },
  { count: 5, title: "Grand Prize Entry" },
  { count: "all", title: "Full Passport Badge" }
];

let participant = getJSON(STORAGE.participant, null);
let stamps = getJSON(STORAGE.stamps, []);
let selectedBusinessIds = getJSON(STORAGE.selected, defaultSelected);
let emailHistory = getJSON(STORAGE.emails, []);

function getJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function selectedBusinesses() {
  return businesses.filter(b => selectedBusinessIds.includes(b.id));
}

function stampsForCampaign() {
  return stamps.filter(s => s.campaign === CAMPAIGN.slug);
}

function stampExists(businessId) {
  return stamps.some(s => s.campaign === CAMPAIGN.slug && s.businessId === businessId);
}

function showTab(tabId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(t => t.classList.add("active"));
}

function requireParticipant(callback) {
  if (participant) {
    callback();
    return;
  }

  document.getElementById("registrationModal").classList.remove("hidden");
  window.pendingAfterRegister = callback;
}

function registerParticipant() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const postal = document.getElementById("regPostal").value.trim();

  if (!name || !email || !postal) {
    alert("Please enter name, email, and postal code.");
    return;
  }

  participant = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    email,
    postalCode: postal,
    createdAt: new Date().toISOString()
  };

  setJSON(STORAGE.participant, participant);
  document.getElementById("registrationModal").classList.add("hidden");

  if (window.pendingAfterRegister) window.pendingAfterRegister();
  renderAll();
}

function collectStamp(businessId) {
  const business = businesses.find(b => b.id === businessId);

  if (!business) {
    document.getElementById("scanResult").textContent = "Business not found.";
    return;
  }

  requireParticipant(() => {
    if (stampExists(businessId)) {
      document.getElementById("scanResult").textContent = `Already collected: ${business.name}`;
    } else {
      stamps.push({
        campaign: CAMPAIGN.slug,
        participantId: participant.id,
        participantName: participant.name,
        email: participant.email,
        postalCode: participant.postalCode,
        businessId,
        businessName: business.name,
        scannedAt: new Date().toISOString()
      });
      setJSON(STORAGE.stamps, stamps);
      document.getElementById("scanResult").textContent = `Stamp collected at ${business.name}!`;
    }

    showTab("scan");
    renderAll();
  });
}

function renderPassport() {
  const selected = selectedBusinesses();
  const collected = stampsForCampaign().filter(s => selectedBusinessIds.includes(s.businessId));
  const count = collected.length;
  const total = selected.length || 1;

  document.getElementById("participantName").textContent = participant ? participant.name : "Guest participant";
  document.getElementById("participantMeta").textContent = participant
    ? `${participant.email} · ${participant.postalCode}`
    : "Register once, then scan QR codes to collect stamps.";

  document.getElementById("progressCount").textContent = `${count}/${selected.length}`;
  document.getElementById("progressFill").style.width = `${Math.round((count / total) * 100)}%`;

  const grid = document.getElementById("stampGrid");
  grid.innerHTML = "";

  selected.forEach(b => {
    const div = document.createElement("div");
    div.className = `stamp ${stampExists(b.id) ? "collected" : ""}`;
    div.innerHTML = `
      <strong>${stampExists(b.id) ? "✓ " : ""}${b.name}</strong>
      <span>${b.type} · ${b.address}</span>
    `;
    grid.appendChild(div);
  });

  const rewards = document.getElementById("rewardList");
  rewards.innerHTML = "";

  rewardTiers.forEach(r => {
    const needed = r.count === "all" ? selected.length : r.count;
    const unlocked = count >= needed;
    const div = document.createElement("div");
    div.className = `reward ${unlocked ? "unlocked" : ""}`;
    div.innerHTML = `<strong>${r.title}</strong><span>${unlocked ? "Unlocked" : `${needed} stamp${needed === 1 ? "" : "s"}`}</span>`;
    rewards.appendChild(div);
  });
}

function renderScanButtons() {
  const box = document.getElementById("scanButtons");
  box.innerHTML = "";

  selectedBusinesses().forEach(b => {
    const btn = document.createElement("button");
    btn.className = "secondary-btn";
    btn.textContent = b.name;
    btn.onclick = () => collectStamp(b.id);
    box.appendChild(btn);
  });
}

function renderAdmin() {
  document.getElementById("directoryCount").textContent = businesses.length;
  document.getElementById("selectedCount").textContent = selectedBusinessIds.length;
  document.getElementById("participantCount").textContent = participant ? 1 : 0;
  document.getElementById("stampCount").textContent = stampsForCampaign().length;

  renderBusinessDirectory();
  renderQrList();
  renderMap();
  renderEmailHistory();
}

function renderBusinessDirectory() {
  const search = document.getElementById("businessSearch").value.toLowerCase();
  const list = document.getElementById("businessDirectory");
  list.innerHTML = "";

  businesses
    .filter(b => `${b.name} ${b.type} ${b.address}`.toLowerCase().includes(search))
    .forEach(b => {
      const row = document.createElement("label");
      row.className = "business-row";
      row.innerHTML = `
        <input type="checkbox" ${selectedBusinessIds.includes(b.id) ? "checked" : ""} />
        <div><strong>${b.name}</strong><small>${b.type} · ${b.address}</small></div>
      `;
      row.querySelector("input").onchange = e => {
        if (e.target.checked) selectedBusinessIds.push(b.id);
        else selectedBusinessIds = selectedBusinessIds.filter(id => id !== b.id);
        selectedBusinessIds = [...new Set(selectedBusinessIds)];
        setJSON(STORAGE.selected, selectedBusinessIds);
        renderAll();
      };
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
  const list = document.getElementById("qrList");
  list.innerHTML = "";

  selectedBusinesses().forEach(b => {
    const row = document.createElement("div");
    row.className = "qr-row";
    row.innerHTML = `
      <strong>${b.name}</strong>
      <div class="qr-url">${qrUrl(b.id)}</div>
      <button class="copy-btn">Copy URL</button>
    `;
    row.querySelector("button").onclick = () => navigator.clipboard.writeText(qrUrl(b.id));
    list.appendChild(row);
  });
}

function renderMap() {
  const map = document.getElementById("fauxMap");
  map.innerHTML = "";

  selectedBusinesses().forEach((b, index) => {
    const x = 15 + ((b.lng + 114.12) / 0.02) * 70;
    const y = 80 - ((b.lat - 51.02) / 0.008) * 60;

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = `${Math.max(8, Math.min(92, x))}%`;
    pin.style.top = `${Math.max(10, Math.min(88, y))}%`;
    pin.title = b.name;
    pin.innerHTML = `<span>${index + 1}</span>`;
    map.appendChild(pin);
  });
}

function sendEmail() {
  const subject = document.getElementById("emailSubject").value.trim();
  const body = document.getElementById("emailBody").value.trim();

  if (!subject || !body) {
    alert("Add a subject and message.");
    return;
  }

  emailHistory.unshift({
    subject,
    body,
    recipientCount: participant ? 1 : 0,
    sentAt: new Date().toLocaleString()
  });

  setJSON(STORAGE.emails, emailHistory);
  document.getElementById("emailSubject").value = "";
  document.getElementById("emailBody").value = "";
  renderEmailHistory();
}

function renderEmailHistory() {
  const box = document.getElementById("emailHistory");
  box.innerHTML = "";

  emailHistory.forEach(email => {
    const row = document.createElement("div");
    row.className = "email-row";
    row.innerHTML = `<strong>${email.subject}</strong><br><small>${email.sentAt} · ${email.recipientCount} recipients</small>`;
    box.appendChild(row);
  });
}

function exportCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportQrCsv() {
  const rows = [["Business", "Type", "Address", "QR URL"]];
  selectedBusinesses().forEach(b => rows.push([b.name, b.type, b.address, qrUrl(b.id)]));
  exportCSV("social-sundays-qr-urls.csv", rows);
}

function exportDataCsv() {
  const rows = [["Participant", "Email", "Postal Code", "Business", "Scanned At"]];
  stampsForCampaign().forEach(s => rows.push([s.participantName, s.email, s.postalCode, s.businessName, s.scannedAt]));
  exportCSV("social-sundays-participant-stamps.csv", rows);
}

function resetDemo() {
  if (!confirm("Reset demo participant and stamps on this device?")) return;
  localStorage.removeItem(STORAGE.participant);
  localStorage.removeItem(STORAGE.stamps);
  participant = null;
  stamps = [];
  renderAll();
}

function handleUrlScan() {
  const params = new URLSearchParams(window.location.search);
  const business = params.get("business");
  if (business) collectStamp(business);
}

function renderAll() {
  renderPassport();
  renderScanButtons();
  renderAdmin();
}

document.querySelectorAll("[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

document.getElementById("registerBtn").addEventListener("click", registerParticipant);
document.getElementById("businessSearch").addEventListener("input", renderBusinessDirectory);
document.getElementById("selectAllBtn").addEventListener("click", () => {
  selectedBusinessIds = businesses.map(b => b.id);
  setJSON(STORAGE.selected, selectedBusinessIds);
  renderAll();
});
document.getElementById("clearAllBtn").addEventListener("click", () => {
  selectedBusinessIds = [];
  setJSON(STORAGE.selected, selectedBusinessIds);
  renderAll();
});
document.getElementById("exportQrBtn").addEventListener("click", exportQrCsv);
document.getElementById("exportDataBtn").addEventListener("click", exportDataCsv);
document.getElementById("sendEmailBtn").addEventListener("click", sendEmail);
document.getElementById("resetParticipantBtn").addEventListener("click", resetDemo);

renderAll();
handleUrlScan();
