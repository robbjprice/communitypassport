const SUPABASE_URL = "https://lpdatofxeivydxmjtbwg.supabase.co";
const SUPABASE_KEY = "sb_publishable_qhLcavWW3O0DLs4w22N9Sw_9JoEjHt2";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const successSound = new Audio("success.mp3");
async function testSupabaseConnection() {
  const { data, error } = await supabaseClient
    .from("campaigns")
    .select("*");

  console.log("SUPABASE TEST DATA:", data);
  console.log("SUPABASE TEST ERROR:", error);
}

testSupabaseConnection();
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
  rewardPopups: "communityPassportRewardPopups",
};

let businesses = [];

const defaultSelected = [];
const demoParticipants = [];
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
  {
    count: 1,
    title: "Social Starter",
    description: "Weekly prizes. Every stamp collected earns an entry into the weekly prize draws."
  },
  {
    count: 6,
    title: "Patio Hopper",
    description: "Collect 6+ stamps to qualify for a $100 Marda Loop Gift Card draw."
  },
  {
    count: 10,
    title: "Patio Pro",
    description: "Collect 10+ stamps to qualify for a $250 Marda Loop Gift Card draw."
  },
  {
    count: 15,
    title: "Summer Socialite",
    description: "Collect 15+ stamps to qualify for a $500 Marda Loop Gift Card draw."
  },
  {
    count: "all",
    title: "Mayor of Marda Loop",
    description: "Complete your entire passport to be entered to win a $1,000 Marda Loop Shopping Spree."
  }
];

let participant = getJSON(STORAGE.participant, null);
let stamps = getJSON(STORAGE.stamps, []);
let selectedBusinessIds = getJSON(STORAGE.selected, defaultSelected);
let emailHistory = getJSON(STORAGE.emails, []);
let adminUsers = getJSON(STORAGE.admins, [
  { name: "Robb Price", email: "admin@theloopsocial.ca", role: "master" },
]);
let adminLoggedIn = getJSON(STORAGE.adminLoggedIn, false);
let rewardPopups = getJSON(STORAGE.rewardPopups, []);

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

async function registerParticipant() {
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

  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Campaign lookup failed:", campaignResult.error);
    alert("Could not find this campaign in Supabase.");
    return;
  }

  const campaignId = campaignResult.data.id;

  const { data, error } = await supabaseClient
    .from("participants")
    .upsert(
      {
        campaign_id: campaignId,
        name,
        email,
        postal_code: postal,
        consent_accepted: consentAccepted,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "campaign_id,email",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Participant registration failed:", error);
    alert("Registration failed. Check the browser console.");
    return;
  }

  participant = {
    id: data.id,
    name: data.name,
    email: data.email,
    postalCode: data.postal_code,
    campaign: CAMPAIGN.slug,
    campaignId: data.campaign_id,
    createdAt: data.created_at,
    lastSeenAt: data.last_seen_at,
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
function checkRewardPopup() {
  const selected = selectedBusinesses();

  const collected = stampsForCampaign().filter((stamp) =>
    selectedBusinessIds.includes(stamp.businessId)
  );

  const count = collected.length;

  const unlockedTier = rewardTiers.find((tier) => {
    const needed = tier.count === "all" ? selected.length : tier.count;

    return (
      count >= needed &&
      !rewardPopups.includes(tier.title)
    );
  });

  if (!unlockedTier) return;

  rewardPopups.push(unlockedTier.title);
  setJSON(STORAGE.rewardPopups, rewardPopups);

  alert(
    `Congratulations! You're a ${unlockedTier.title}.\n\nYou've been entered into the draw!`
  );
}
async function collectStamp(businessId) {
  const business = businesses.find((item) => item.id === businessId);

  if (!business) {
    setScanMessage("Business not found. Please check the QR code.", "error");
    showTab("passport");
    return;
  }

  requireParticipant(async () => {
    const campaignId = participant.campaignId;

    if (!campaignId || !business.supabaseId) {
      console.error("Missing campaignId or business supabaseId", {
        campaignId,
        business,
        participant,
      });
      setScanMessage("Missing campaign or business details. Please refresh and try again.", "error");
      showTab("passport");
      return;
    }

    const { data, error } = await supabaseClient
      .from("stamps")
      .upsert(
        {
          campaign_id: campaignId,
          participant_id: participant.id,
          business_id: business.supabaseId,
          scan_source: "qr-or-demo",
          user_agent: navigator.userAgent,
        },
        {
          onConflict: "campaign_id,participant_id,business_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Stamp collection failed:", error);
      setScanMessage("Stamp collection failed. Please try again.", "error");
      showTab("passport");
      return;
    }

    if (!stampExists(businessId)) {
      stamps.push({
        id: data.id,
        campaign: CAMPAIGN.slug,
        participantId: participant.id,
        participantName: participant.name,
        email: participant.email,
        postalCode: participant.postalCode,
        businessId,
        businessName: business.name,
        businessType: business.type,
        scannedAt: data.scanned_at,
        scanSource: "qr-or-demo",
        userAgent: navigator.userAgent,
      });

      setJSON(STORAGE.stamps, stamps);
     setScanMessage(`Stamp collected at ${business.name}!`, "success");

successSound.currentTime = 0;
successSound.play().catch(() => {});

checkRewardPopup();
    } else {
      setScanMessage(`Already collected: ${business.name}`, "duplicate");
    }

    participant.lastSeenAt = new Date().toISOString();
    setJSON(STORAGE.participant, participant);

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
let activeQrScanner = null;

async function openDemoCameraThenCollect(expectedBusinessId) {
  const modal = $("qrScannerModal");
  const scannerBox = $("qrScanner");

  if (!modal || !scannerBox) {
    setScanMessage("Scanner is not available.", "error");
    return;
  }

  modal.classList.remove("hidden");
  scannerBox.innerHTML = "";

  activeQrScanner = new Html5Qrcode("qrScanner");

  try {
    await activeQrScanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      async (decodedText) => {
        let scannedBusinessId = null;

        try {
          const url = new URL(decodedText);
          const campaign = url.searchParams.get("campaign");
          const business = url.searchParams.get("business");

          if (campaign === CAMPAIGN.slug && business) {
            scannedBusinessId = business;
          }
        } catch {
          setScanMessage("That is not a valid Social Sundays QR code.", "error");
          return;
        }
        if (scannedBusinessId !== expectedBusinessId) {
  const scannerMessage = $("qrScannerMessage");

  if (scannerMessage) {
    scannerMessage.textContent = "This QR code doesn't match this business.";
    scannerMessage.dataset.status = "error";
  }

  return;
}
       collectStamp(scannedBusinessId);

setTimeout(() => {
  closeQrScanner();
}, 800);
      }
    );
  } catch (error) {
    console.error("QR scanner failed:", error);
    setScanMessage("Could not open the camera. Try using your phone camera instead.", "error");
    modal.classList.add("hidden");
  }
}

async function closeQrScanner() {
  const modal = $("qrScannerModal");

  if (activeQrScanner) {
    try {
      await activeQrScanner.stop();
      await activeQrScanner.clear();
    } catch (error) {
      console.warn("Scanner close warning:", error);
    }

    activeQrScanner = null;
  }

  if (modal) modal.classList.add("hidden");
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

  successSound.load();
  successSound.play().then(() => {
    successSound.pause();
    successSound.currentTime = 0;
  }).catch(() => {});

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

async function addBusiness() {
  const name = $("newBusinessName")?.value.trim();
  const type = $("newBusinessType")?.value.trim();

  const address1 = $("newBusinessAddress1")?.value.trim();
  const address2 = $("newBusinessAddress2")?.value.trim();
  const city = $("newBusinessCity")?.value.trim();
  const province = $("newBusinessProvince")?.value.trim();
  const postal = $("newBusinessPostal")?.value.trim();

  if (!name || !type || !address1 || !city || !province) {
    alert("Please complete all required business fields.");
    return;
  }

  const fullAddress = [
    address1,
    address2,
    city,
    province,
    postal
  ]
    .filter(Boolean)
    .join(", ");

  const slug = businessIdFromName(name);

  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Campaign lookup failed:", campaignResult.error);
    alert("Could not find this campaign in Supabase.");
    return;
  }

  const campaignId = campaignResult.data.id;

  const { error } = await supabaseClient
    .from("businesses")
    .upsert(
      {
        campaign_id: campaignId,
        slug,
        name,
        type,
        address: fullAddress,
        lat: 51.023,
        lng: -114.112,
        is_active: true,
      },
      {
        onConflict: "campaign_id,slug",
      }
    );

  if (error) {
    console.error("Manual business add failed:", error);
    alert("Business could not be saved. Check the browser console.");
    return;
  }

  $("newBusinessName").value = "";
  $("newBusinessType").value = "";
  $("newBusinessAddress1").value = "";
  $("newBusinessAddress2").value = "";
  $("newBusinessCity").value = "Calgary";
  $("newBusinessProvince").value = "AB";
  $("newBusinessPostal").value = "";

  await loadBusinessesFromSupabase();

  renderAll();

  alert(`${name} has been added.`);
}
function downloadBusinessTemplate() {
const rows = [
  ["name", "type", "address1", "address2", "city", "province", "postal"],

  ["Example Cafe", "Coffee", "1234 33 Avenue SW", "", "Calgary", "AB", "T2T 1A1"],

  ["Example Boutique", "Retail", "2000 33 Avenue SW", "Unit 4", "Calgary", "AB", "T2T 1B2"],
];

  exportCSV("business-upload-template.csv", rows);
}
async function loadBusinessesFromSupabase() {
  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Campaign lookup failed:", campaignResult.error);
    return;
  }

  const campaignId = campaignResult.data.id;

  const { data, error } = await supabaseClient
    .from("businesses")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Business load failed:", error);
    return;
  }

  businesses = data.map((business) => ({
    id: business.slug,
    supabaseId: business.id,
    name: business.name,
    type: business.type,
    address: business.address,
    lat: Number(business.lat || 51.023),
    lng: Number(business.lng || -114.112),
  }));

  selectedBusinessIds = businesses.map((business) => business.id);
  setJSON(STORAGE.selected, selectedBusinessIds);

  renderAll();
}
async function uploadBusinessCsv(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const text = reader.result;

    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines.slice(1);

    const campaignResult = await supabaseClient
      .from("campaigns")
      .select("id")
      .eq("slug", CAMPAIGN.slug)
      .single();

    if (campaignResult.error || !campaignResult.data) {
      console.error("Campaign lookup failed:", campaignResult.error);
      alert("Could not find this campaign in Supabase.");
      return;
    }

    const campaignId = campaignResult.data.id;

    const newBusinesses = rows
      .map((line) => {
        const [name, type, address1, address2, city, province, postal] = line
  .split(",")
  .map((item) => item?.trim());

if (!name || !type || !address1) return null;

const fullAddress = [
  address1,
  address2,
  city,
  province,
  postal
]
  .filter(Boolean)
  .join(", ");

        return {
  campaign_id: campaignId,
  slug: businessIdFromName(name),
  name,
  type,
  address: fullAddress,
  lat: 51.023,
  lng: -114.112,
  is_active: true,
};
      })
      .filter(Boolean);

    if (!newBusinesses.length) {
      alert("No valid businesses found in the CSV.");
      return;
    }

    const { data, error } = await supabaseClient
      .from("businesses")
      .upsert(newBusinesses, {
        onConflict: "campaign_id,slug",
      })
      .select();

    if (error) {
      console.error("Business CSV upload failed:", error);
      alert("Business upload failed. Check the browser console.");
      return;
    }

    await loadBusinessesFromSupabase();

    event.target.value = "";

    alert(`${businesses.length} businesses uploaded to Supabase.`);
    renderAll();
  };

  reader.readAsText(file);
}
async function updateAdminTotals() {
  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Admin totals campaign lookup failed:", campaignResult.error);
    return;
  }

  const campaignId = campaignResult.data.id;

  const participantsResult = await supabaseClient
    .from("participants")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId);

  const stampsResult = await supabaseClient
    .from("stamps")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId);

  if (participantsResult.error || stampsResult.error) {
    console.error("Admin totals load failed:", {
      participantsError: participantsResult.error,
      stampsError: stampsResult.error,
    });
    return;
  }

  if ($("participantCount")) $("participantCount").textContent = participantsResult.count || 0;
  if ($("stampCount")) $("stampCount").textContent = stampsResult.count || 0;
}
function renderAdmin() {
  const adminPage = $("admin");

  if (adminPage) {
    adminPage.style.display = adminLoggedIn ? "" : "none";
  }

  if ($("directoryCount")) $("directoryCount").textContent = businesses.length;
  if ($("selectedCount")) $("selectedCount").textContent = selectedBusinessIds.length;
  updateAdminTotals();

  renderBusinessDirectory();

renderQrList();

renderMap();

renderEmailHistory();

renderAdminUsers();

renderPrizeQualifications();

renderPostalHeatMap();

}
async function renderPrizeQualifications() {
  const container = $("prizeQualificationList");
  if (!container) return;

  container.innerHTML = `<p class="muted">Loading prize qualifications...</p>`;

  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Campaign lookup failed:", campaignResult.error);
    container.innerHTML = `<p class="muted">Could not load campaign.</p>`;
    return;
  }

  const campaignId = campaignResult.data.id;

  const participantsResult = await supabaseClient
    .from("participants")
    .select("id, name, email, postal_code")
    .eq("campaign_id", campaignId);

  const stampsResult = await supabaseClient
    .from("stamps")
    .select("participant_id")
    .eq("campaign_id", campaignId);

  if (participantsResult.error || stampsResult.error) {
    console.error("Prize qualification load failed:", {
      participantsError: participantsResult.error,
      stampsError: stampsResult.error,
    });

    container.innerHTML = `<p class="muted">Could not load prize qualifications.</p>`;
    return;
  }

  const stampCounts = {};

  stampsResult.data.forEach((stamp) => {
    stampCounts[stamp.participant_id] = (stampCounts[stamp.participant_id] || 0) + 1;
  });

  const people = participantsResult.data.map((person) => ({
    name: person.name || "Participant",
    email: person.email || "",
    postalCode: person.postal_code || "",
    stamps: stampCounts[person.id] || 0,
  }));

  const tiers = [
    { title: "Social Starter", needed: 1 },
    { title: "Patio Hopper", needed: 6 },
    { title: "Patio Pro", needed: 10 },
    { title: "Summer Socialite", needed: 15 },
    { title: "Mayor of Marda Loop", needed: selectedBusinessIds.length },
  ];

  container.innerHTML = "";

  tiers.forEach((tier) => {
    const qualified = people
      .filter((person) => person.stamps >= tier.needed)
      .sort((a, b) => b.stamps - a.stamps);

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

async function renderPostalHeatMap() {
  const container = $("postalHeatMap");
  if (!container) return;

  container.innerHTML = `<p class="muted">Loading postal code heat map...</p>`;

  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    container.innerHTML = `<p class="muted">Could not load campaign.</p>`;
    return;
  }

  const { data, error } = await supabaseClient
    .from("participants")
    .select("postal_code")
    .eq("campaign_id", campaignResult.data.id);

  if (error) {
    console.error("Postal heat map load failed:", error);
    container.innerHTML = `<p class="muted">Could not load postal codes.</p>`;
    return;
  }

  const counts = {};

  data.forEach((person) => {
    const postal = (person.postal_code || "").trim().toUpperCase();
    if (!postal) return;

    const prefix = postal.split(" ")[0];
    counts[prefix] = (counts[prefix] || 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    container.innerHTML = `<p class="muted">No participant postal codes yet.</p>`;
    return;
  }

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

async function exportDataCsv() {
  const rows = [["Participant", "Email", "Postal Code", "Business", "Business Type", "Scanned At"]];

  const campaignResult = await supabaseClient
    .from("campaigns")
    .select("id")
    .eq("slug", CAMPAIGN.slug)
    .single();

  if (campaignResult.error || !campaignResult.data) {
    console.error("Campaign lookup failed:", campaignResult.error);
    alert("Could not load campaign for export.");
    return;
  }

  const campaignId = campaignResult.data.id;

  const participantsResult = await supabaseClient
    .from("participants")
    .select("id, name, email, postal_code")
    .eq("campaign_id", campaignId);

  const stampsResult = await supabaseClient
    .from("stamps")
    .select("participant_id, business_id, scanned_at")
    .eq("campaign_id", campaignId);

  const businessesResult = await supabaseClient
    .from("businesses")
    .select("id, name, type")
    .eq("campaign_id", campaignId);

  if (participantsResult.error || stampsResult.error || businessesResult.error) {
    console.error("Export failed:", {
      participantsError: participantsResult.error,
      stampsError: stampsResult.error,
      businessesError: businessesResult.error,
    });

    alert("Export failed. Check the browser console.");
    return;
  }

  const participantsById = {};
  participantsResult.data.forEach((person) => {
    participantsById[person.id] = person;
  });

  const businessesById = {};
  businessesResult.data.forEach((business) => {
    businessesById[business.id] = business;
  });

  stampsResult.data.forEach((stamp) => {
    const person = participantsById[stamp.participant_id];
    const business = businessesById[stamp.business_id];

    rows.push([
      person?.name || "",
      person?.email || "",
      person?.postal_code || "",
      business?.name || "",
      business?.type || "",
      stamp.scanned_at || "",
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
  $("closeScannerBtn")?.addEventListener("click", closeQrScanner);
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

  $("footerAdminBtn")?.addEventListener("click", openAdminLogin);
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

async function initApp() {
  wireEvents();
  renderAll();
  await loadBusinessesFromSupabase();
  handleUrlScan();
}

initApp();
