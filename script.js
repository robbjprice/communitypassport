const businesses = [
  { id: "blush-lane", name: "Blush Lane" },
  { id: "phil-seb", name: "Phil & Sebastian" },
  { id: "annabelles", name: "Annabelle’s Kitchen" },
  { id: "belmont", name: "Belmont Diner" },
  { id: "big-fish", name: "Big Fish" },
  { id: "cobs", name: "COBS Bread" }
];

let stamps = JSON.parse(localStorage.getItem("stamps") || "[]");

function save() {
  localStorage.setItem("stamps", JSON.stringify(stamps));
}

function render() {
  const container = document.getElementById("stamps");
  container.innerHTML = "";

  businesses.forEach(b => {
    const div = document.createElement("div");
    div.className = "stamp";

    if (stamps.includes(b.id)) {
      div.classList.add("collected");
    }

    div.innerHTML = b.name;
    container.appendChild(div);
  });

  document.getElementById("progress").innerText =
    `${stamps.length} / ${businesses.length} stamps`;
}

function handleScan() {
  const params = new URLSearchParams(window.location.search);
  const business = params.get("business");

  if (!business) return;

  if (stamps.includes(business)) {
    document.getElementById("scanResult").innerText =
      "Already collected";
  } else {
    stamps.push(business);
    save();
    document.getElementById("scanResult").innerText =
      "Stamp collected!";
  }

  render();
}

function exportCSV() {
  let csv = "Business,Collected\n";

  businesses.forEach(b => {
    csv += `${b.name},${stamps.includes(b.id)}\n`;
  });

  const blob = new Blob([csv]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();
}

render();
handleScan();
