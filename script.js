
const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "a_access_devices";
const HISTORY_KEY = "a_access_history";

let devices = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

// Navigation
document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    showPage(page);

    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    $("sidebar").classList.remove("open");
  });
});

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  const selected = $(page);

  if (selected) {
    selected.classList.add("active");
    $("pageTitle").textContent =
      page.charAt(0).toUpperCase() + page.slice(1);
  }
}

// Sidebar
$("menuToggle").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});

// Modal
function openModal() {
  $("deviceModal").classList.add("show");
}

function closeModal() {
  $("deviceModal").classList.remove("show");
}

$("addDeviceButton").addEventListener("click", openModal);
$("addDeviceButton2").addEventListener("click", openModal);
$("closeModal").addEventListener("click", closeModal);

// Generate ID
function generateDeviceID() {
  return "AAC-" +
    crypto.randomUUID().replaceAll("-", "")
      .slice(0, 12).toUpperCase();
}

// Save
function saveDevices() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Activity log
function addHistory(message) {
  history.unshift({
    message,
    time: new Date().toLocaleString("id-ID")
  });

  history = history.slice(0, 50);
  saveHistory();
  renderHistory();
}

// Register device
$("deviceForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("deviceName").value.trim();
  const id = $("deviceId").value.trim();
  const model = $("deviceModel").value.trim();

  if (!name || !id) {
    alert("Nama dan ID perangkat wajib diisi.");
    return;
  }

  if (devices.some(device => device.id === id)) {
    alert("ID perangkat sudah terdaftar.");
    return;
  }

  devices.push({
    name,
    id,
    model: model || "Belum diketahui",
    status: "Belum terhubung",
    registeredAt: new Date().toISOString()
  });

  saveDevices();
  addHistory("Perangkat didaftarkan: " + name);

  $("deviceForm").reset();
  closeModal();
  renderAll();

  alert("Perangkat berhasil dicatat!");
});

// Delete device
function deleteDevice(id) {
  const device = devices.find(item => item.id === id);

  if (!device) return;

  if (!confirm("Hapus perangkat " + device.name + "?")) {
    return;
  }

  devices = devices.filter(item => item.id !== id);

  saveDevices();
  addHistory("Perangkat dihapus: " + device.name);
  renderAll();
}

// Device card
function createDeviceCard(device) {
  const card = document.createElement("article");
  card.className = "device-card";

  const icon = document.createElement("div");
  icon.className = "device-icon";
  icon.textContent = "▣";

  const info = document.createElement("div");
  info.className = "device-info";

  const name = document.createElement("h3");
  name.textContent = device.name;

  const detail = document.createElement("p");
  detail.textContent =
    device.model + " • " + device.id;

  const status = document.createElement("p");
  status.className = "device-status";
  status.textContent = device.status;

  info.append(name, detail, status);

  const actions = document.createElement("div");
  actions.className = "device-actions";

  const deleteButton = document.createElement("button");
  deleteButton.className = "small-button";
  deleteButton.textContent = "Remove";

  deleteButton.addEventListener("click", () => {
    deleteDevice(device.id);
  });

  actions.append(deleteButton);
  info.append(actions);

  card.append(icon, info);

  return card;
}

// Render devices
function renderDevices() {
  const dashboardList = $("deviceList");
  const allList = $("allDevices");

  dashboardList.replaceChildren();
  allList.replaceChildren();

  if (devices.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-icon">▣</div>
      <h3>No devices registered</h3>
      <p>Register your first Android device.</p>
    `;

    dashboardList.append(empty);
    allList.append(empty.cloneNode(true));
    return;
  }

  devices.forEach(device => {
    dashboardList.append(createDeviceCard(device));
    allList.append(createDeviceCard(device));
  });
}

// Statistics
function renderStats() {
  $("totalDevices").textContent = devices.length;

  const online = devices.filter(
    device => device.status === "Online"
  ).length;

  $("onlineDevices").textContent = online;
  $("offlineDevices").textContent =
    devices.length - online;

  $("securityAlerts").textContent = "0";
}

// History
function renderHistory() {
  const recent = $("recentActivity");
  const full = $("historyList");

  recent.replaceChildren();
  full.replaceChildren();

  if (history.length === 0) {
    recent.textContent = "No activity recorded.";
    full.textContent = "No connection history.";
    return;
  }

  history.slice(0, 5).forEach(item => {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.textContent = item.message + " • " + item.time;
    recent.append(row);
  });

  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.textContent = item.message + " • " + item.time;
    full.append(row);
  });
}

// Notifications
$("notificationButton").addEventListener("click", () => {
  showPage("alerts");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.page === "alerts"
    );
  });
});

// Render everything
function renderAll() {
  renderDevices();
  renderStats();
  renderHistory();
}

// Initial load
renderAll();
