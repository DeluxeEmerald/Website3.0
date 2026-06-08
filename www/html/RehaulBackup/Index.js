const urlBase = "http://cop4331-89.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let globalUser = "";
let globalPass = "";

/* ── AUTH ── */

function Login() {
  userId = 0; firstName = ""; lastName = "";

  const login    = document.getElementById("Username").value.trim();
  const password = document.getElementById("Password").value;

  setMsg("loginResult", "");

  const payload = JSON.stringify({ login, password });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Login.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    try {
      const obj = JSON.parse(xhr.responseText);
      userId = obj.id;
      if (userId < 1) { setMsg("loginResult", obj.error || "Login failed"); return; }
      firstName  = obj.firstName;
      lastName   = obj.lastName;
      globalUser = login;
      globalPass = password;
      saveCookie();
      window.location.href = "Mainpage.html";
    } catch (e) { setMsg("loginResult", "Unexpected error"); }
  };

  xhr.onerror = () => setMsg("loginResult", "Network error");
  xhr.send(payload);
}

function register() {
  const fName    = document.getElementById("fName").value.trim();
  const lName    = document.getElementById("lName").value.trim();
  const username = document.getElementById("Username").value.trim();
  const password = document.getElementById("Password").value;

  if (!fName || !lName || !username || !password) {
    setMsg("createResult", "All fields are required."); return;
  }

  const payload = JSON.stringify({ firstname: fName, lastname: lName, login: username, password });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Register.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    try {
      const obj = JSON.parse(xhr.responseText);
      setMsg("createResult", obj.error || "");
      if (obj.error === "") {
        globalUser = username;
        globalPass = password;
        Login();
      }
    } catch (e) { setMsg("createResult", "Unexpected error"); }
  };

  xhr.onerror = () => setMsg("createResult", "Network error");
  xhr.send(payload);
}

function Logout() {
  userId = 0; firstName = ""; lastName = "";
  globalUser = ""; globalPass = "";
  document.cookie = "firstName=;lastName=;Username=;Password=;userId=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  window.location.href = "index.html";
}

function Cancel() { window.location.href = "index.html"; }

/* ── COOKIE ── */

function saveCookie() {
  const expires = new Date(Date.now() + 20 * 60 * 1000).toUTCString();
  document.cookie = `firstName=${firstName},lastName=${lastName},Username=${globalUser},Password=${globalPass},userId=${userId};expires=${expires}`;
}

function readCookie() {
  userId = -1;
  document.cookie.split(",").forEach(pair => {
    const [k, v] = pair.trim().split("=");
    if (k === "firstName")  firstName  = v || "";
    if (k === "lastName")   lastName   = v || "";
    if (k === "Username")   globalUser = v || "";
    if (k === "Password")   globalPass = v || "";
    if (k === "userId")     userId     = parseInt(v) || -1;
  });
  if (userId < 0) window.location.href = "index.html";
}

/* ── MAIN PAGE ── */

function Welcome() {
  const el = document.getElementById("User");
  if (el) el.textContent = firstName || globalUser || "there";
}

function searchContact() {
  const search = (document.getElementById("searchText")?.value || "").trim();

  const payload = JSON.stringify({ search, userId });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Read.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    try {
      const obj = JSON.parse(xhr.responseText);
      renderTable(obj.results || []);
    } catch (e) { console.error("Search parse error", e); }
  };

  xhr.onerror = () => console.error("Search network error");
  xhr.send(payload);
}

function addContact() {
  const name  = document.getElementById("newName")?.value.trim()  || "";
  const phone = document.getElementById("newPhone")?.value.trim() || "";
  const email = document.getElementById("newMail")?.value.trim()  || "";

  if (!name) { setMsg("contactAddResult", "Name is required."); return; }

  const payload = JSON.stringify({ name, phone, email, userId });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Create.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    setMsg("contactAddResult", "✓ Contact added", true);
    searchContact();
    document.getElementById("newName").value  = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newMail").value  = "";
  };

  xhr.onerror = () => setMsg("contactAddResult", "Network error");
  xhr.send(payload);
}

function deleteContact(contactId) {
  if (!confirm("Delete this contact?")) return;
  const payload = JSON.stringify({ id: contactId, userId });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Delete.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    searchContact();
  };
  xhr.send(payload);
}

function flipSave() {
  // toggle between Add and Edit modes — extend as needed
  console.log("Edit mode toggled");
}

/* ── TABLE RENDERER ── */

function renderTable(contacts) {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  if (!contacts || contacts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <div class="icon">📭</div>
            <p>No contacts found. Add one above!</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = contacts.map(c => {

    // c may be an object or a string depending on your API
    const name  = c.name  ?? c.Name  ?? (typeof c === "string" ? c : "—");
    const phone = c.phone ?? c.Phone ?? "—";
    const email = c.email ?? c.Email ?? "—";
    const id    = c.id    ?? c.ID    ?? 0;
    return `
      <tr>
        <td><strong>${escHtml(name)}</strong></td>
        <td>${escHtml(phone)}</td>
        <td>${escHtml(email)}</td>
        <td>
          <div class="td-actions">
            <button class="icon-btn" aria-label="Edit contact" onclick="editContact(${id})"><i data-lucide="pencil"></i></button>
            <button class="icon-btn" aria-label="Delete contact" onclick="deleteContact(${id})"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`;
  }).join("");
  lucide.createIcons();
}

function editContact(id) {
  // placeholder — wire up inline edit or a modal
  alert("Edit contact #" + id + " — implement your edit flow here.");
}

/* ── HELPERS ── */

function setMsg(id, text, isSuccess = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = "status-msg" + (isSuccess ? " success" : "");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
