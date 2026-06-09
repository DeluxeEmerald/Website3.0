# One Contact Manager

> A full-stack contact management web application built with the **LAMP stack** for COP4331 — POOSD at the University of Central Florida.

![One Contact Manager](www/html/logo.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Team](#team)

---

## Overview

One Contact Manager is a web-based application that allows users to securely register, log in, and manage a personal list of contacts. Each user has their own private contact list that can be searched, sorted, paginated, added to, edited, and deleted — all through a modern, responsive UI.

---

## Features

- **User Authentication** — Register and log in with a username and password. Sessions are maintained via browser cookies.
- **Contact CRUD** — Create, read, update, and delete contacts with name, phone number, and email.
- **Live Search** — Debounced search filters contacts in real time as you type.
- **Sort by Name** — Click the Name column header to toggle A→Z / Z→A sorting.
- **Pagination** — Contacts are displayed 8 per page with numbered navigation controls.
- **Avatar Initials** — Each contact displays a color-coded avatar generated from their initials.
- **Duplicate Detection** — Warns before creating a contact with the same name or phone number as an existing one.
- **Input Validation** — Name, phone, and email are validated client-side before any API call is made.
- **Responsive Design** — Works on desktop and mobile with a glassmorphism dark theme.
- **Accessibility** — ARIA labels, live regions, semantic landmarks, and keyboard navigation throughout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | PHP 8 |
| Database | MySQL |
| Server | Apache (LAMP) |
| Icons | [Lucide Icons](https://lucide.dev/) via CDN |
| Fonts | [Google Fonts](https://fonts.google.com/) — Syne + DM Sans |

---

## Project Structure

```
/
├── index.html          # Login page
├── signup.html         # Registration page
├── Mainpage.html       # Main dashboard (contacts table)
├── Index.js            # All client-side JavaScript (auth, CRUD, UI logic)
├── Login.js            # Legacy login script (unused in current version)
├── css.css             # Global stylesheet
├── sea.png             # Background image
├── sea_new.jpg         # Alternative background
├── logo.png            # App logo (topbar)
├── logoTR.png          # Transparent logo (login page)
├── edit.png            # Legacy edit icon (replaced by Lucide)
├── trash.jpeg          # Legacy trash icon (replaced by Lucide)
└── LAMPAPI/            # PHP backend (server-side)
    ├── Login.php
    ├── Register.php
    ├── Read.php
    ├── Create.php
    ├── Update.php
    └── Delete.php
```

---

## API Endpoints

All endpoints are located at `http://cop4331-89.xyz/LAMPAPI/` and accept `POST` requests with a `Content-Type: application/json` body.

### `Login.php`
```json
Request:  { "login": "username", "password": "pass" }
Response: { "id": 1, "firstName": "Rick", "lastName": "Doe", "error": "" }
```

### `Register.php`
```json
Request:  { "firstname": "Rick", "lastname": "Doe", "login": "username", "password": "pass" }
Response: { "error": "" }
```

### `Read.php`
```json
Request:  { "contactname": "search term", "login": "username", "password": "pass" }
Response: { "contacts": [ { "name": "...", "phone": "...", "email": "..." } ], "error": "" }
```

### `Create.php`
```json
Request:  { "login": "username", "password": "pass", "contact": { "name": "...", "phone": "...", "email": "..." } }
Response: { "error": "" }
```

### `Update.php`
```json
Request:  {
            "login": "username", "password": "pass",
            "contact":    { "name": "old", "phone": "old", "email": "old" },
            "newcontact": { "name": "new", "phone": "new", "email": "new" }
          }
Response: { "error": "" }
```

### `Delete.php`
```json
Request:  { "login": "username", "password": "pass", "contact": { "name": "...", "phone": "...", "email": "..." } }
Response: { "error": "" }
```

---

## Getting Started

### Prerequisites

- A LAMP server (Linux, Apache, MySQL, PHP 8+)
- A web browser


## Usage

1. **Register** a new account on the Sign Up page.
2. **Log in** with your credentials — you'll be redirected to the dashboard.
3. **Search** contacts using the search bar (live, debounced).
4. **Sort** contacts A→Z or Z→A by clicking the Name column header.
5. **Add** a contact with the `+ Add Contact` button — validation and duplicate checks run before saving.
6. **Edit** a contact using the pencil icon — the form pre-fills with existing data.
7. **Delete** a contact using the trash icon — a confirmation prompt appears first.
8. **Sign out** using the Sign Out button in the top right.

---

## Team

Built for **COP4331 — Processes of Object-Oriented Software** at the **University of Central Florida**.

| Name | Role |
|---|---|
| Ian Hynes | Developer |
| Jaime Toro Caraballo | Front End |
| Noah Nugent | Front End |
| Ryan Acevedo | API |
| Ryan DeMaria | Admiral General |
---

## License

This project was developed as a university class project for educational purposes.
