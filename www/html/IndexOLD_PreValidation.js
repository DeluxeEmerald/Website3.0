const urlBase = "http://cop4331-89.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let globalUser = "";
let globalPass = "";
let oldName = "";
let oldPhone = "";
let oldMail = "";

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

function loginReturn() { window.location.href = "Mainpage.html"; }

function Cancel() {
  oldName = ""; oldPhone = ""; oldMail = "";
  document.getElementById("newName").value  = "";
  document.getElementById("newPhone").value = "";
  document.getElementById("newMail").value  = "";
  toggleView();
}

/* ── COOKIE ── */

function saveCookie() {
  const expires = new Date(Date.now() + 20 * 60 * 1000).toUTCString();
  document.cookie = `firstName=${firstName},lastName=${lastName},Username=${globalUser},Password=${globalPass},userId=${userId};expires=${expires}`;
}

function readCookie() {
  userId = -1;
  const data = document.cookie;
  console.log("Raw cookie:", data);

  data.split(",").forEach(pair => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const k = pair.substring(0, idx).trim();
    const v = pair.substring(idx + 1).trim();
    if (k === "firstName")  firstName  = v;
    if (k === "lastName")   lastName   = v;
    if (k === "Username")   globalUser = v;
    if (k === "Password")   globalPass = v;
    if (k === "userId")     userId     = parseInt(v) || -1;
  });

  console.log("After readCookie — user:", globalUser, "pass:", globalPass, "userId:", userId);
  if (userId < 0) window.location.href = "index.html";
}

/* ── MAIN PAGE ── */

function Welcome() {
  const el = document.getElementById("User");
  if (el) el.textContent = firstName || globalUser || "there";
}

/* ── SEARCH — uses your real API payload ── */
let searchTimer = null;
function searchContact() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(_doSearch, 300);
}
function _doSearch() {
  const search = (document.getElementById("searchText")?.value || "").trim();
  document.getElementById("Message").innerHTML = "";

  const payload = JSON.stringify({ contactname: search, login: globalUser, password: globalPass });
  console.log("searchContact payload:", payload);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Read.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    try {
      const obj = JSON.parse(xhr.responseText);
      if (!obj.contacts || !Array.isArray(obj.contacts)) {
        document.getElementById("Error").innerHTML = obj.error || "";
        renderTable([]);
        return;
      }
      renderTable(obj.contacts);
    } catch (e) { console.error("Search parse error", e); }
  };

  xhr.onerror = () => document.getElementById("Error").innerHTML = "Network error";
  xhr.send(payload);
}

/* ── ADD — uses your real API payload ── */
function addContact() {
  const newName  = document.getElementById("newName").value;
  const newPhone = document.getElementById("newPhone").value;
  const newMail  = document.getElementById("newMail").value;
  document.getElementById("contactAddResult").innerHTML = "";

  const payload = JSON.stringify({ login: globalUser, password: globalPass, contact: { name: newName, phone: newPhone, email: newMail } });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Create.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    document.getElementById("Message").innerHTML = "Contact Added";
    toggleView();
    searchContact();
  };

  xhr.onerror = () => document.getElementById("Error").innerHTML = "Network error";
  xhr.send(payload);
}

/* ── EDIT (flip to form) ── */
function flipSave(name, phone, email) {
  oldName = name; oldPhone = phone; oldMail = email;
  document.getElementById("newName").value  = oldName;
  document.getElementById("newPhone").value = oldPhone;
  document.getElementById("newMail").value  = oldMail;
  document.getElementById("formTitle").textContent = "Edit Contact";
  document.getElementById("btnCreate").style.display   = "none";
  document.getElementById("btnSaveEdit").style.display = "";
  document.getElementById("tableDiv").style.display = "none";
  document.getElementById("formView").style.display  = "block";
}

/* ── UPDATE — uses your real API payload ── */
function updateContact() {
  document.getElementById("Message").innerHTML = "";
  const newName  = document.getElementById("newName").value;
  const newPhone = document.getElementById("newPhone").value;
  const newMail  = document.getElementById("newMail").value;

  const payload = JSON.stringify({
    login: globalUser, password: globalPass,
    contact:    { name: oldName,  phone: oldPhone,  email: oldMail  },
    newcontact: { name: newName,  phone: newPhone,  email: newMail  }
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Update.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    document.getElementById("Message").innerHTML = "Contact Edited";
    toggleView();
    searchContact();
  };

  xhr.onerror = () => document.getElementById("Error").innerHTML = "Network error";
  xhr.send(payload);
}

/* ── DELETE — uses your real API payload ── */
function removeContact(name, phone, email) {
  document.getElementById("Message").innerHTML = "";
  if (!confirm("Delete this contact?")) return;

  const payload = JSON.stringify({ login: globalUser, password: globalPass, contact: { name, phone, email } });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${urlBase}/Delete.${extension}`, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4 || this.status !== 200) return;
    document.getElementById("Message").innerHTML = "Contact Removed";
    searchContact();
  };

  xhr.onerror = () => document.getElementById("Error").innerHTML = "Network error";
  xhr.send(payload);
}

/* ── TOGGLE TABLE / FORM ── */
function toggleView() {
  const tableView = document.getElementById("tableDiv");
  const formView  = document.getElementById("formView");
  document.getElementById("newName").value  = "";
  document.getElementById("newPhone").value = "";
  document.getElementById("newMail").value  = "";

  if (tableView.style.display === "none") {
    // returning to table
    tableView.style.display = "block";
    formView.style.display  = "none";
  } else {
    // opening Add Contact form — reset to add mode
    document.getElementById("formTitle").textContent = "Add Contact";
    document.getElementById("btnCreate").style.display   = "";
    document.getElementById("btnSaveEdit").style.display = "none";
    tableView.style.display = "none";
    formView.style.display  = "block";
  }
}

/* ── TABLE RENDERER — Lucide icons, no image files ── */
function renderTable(contacts) {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  if (!contacts || contacts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="icon">📭</div>
            <p>No contacts found. Add one above!</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = contacts.map(c => {
    const name  = c.name  || c.Name  || "—";
    const phone = c.phone || c.Phone || "—";
    const email = c.email || c.Email || "—";
    return `
      <tr>
        <td><strong>${escHtml(name)}</strong></td>
        <td>${escHtml(phone)}</td>
        <td>${escHtml(email)}</td>
        <td class="Pic">
          <button class="icon-btn" aria-label="Edit contact"
                  onclick="flipSave('${escAttr(name)}','${escAttr(phone)}','${escAttr(email)}')">
            <i data-lucide="pencil"></i>
          </button>
        </td>
        <td class="Pic">
          <button class="icon-btn icon-btn-danger" aria-label="Delete contact"
                  onclick="removeContact('${escAttr(name)}','${escAttr(phone)}','${escAttr(email)}')">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>`;
  }).join("");

  if (typeof lucide !== "undefined") lucide.createIcons();
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

function escAttr(str) {
  return String(str).replace(/'/g, "\\'");
}
