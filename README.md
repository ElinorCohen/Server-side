# 💰 Cost Manager RESTful Web Services

This is a **server-side application** for tracking and managing personal expenses by category and date.

Built using:
- 🟢 **Node.js** + **Express.js**
- 🛢️ **MongoDB Atlas** (cloud-hosted NoSQL database)
- 🧠 Implements **Computed Design Pattern**
- 📦 Organized for scalability, RESTful API access, and integration

---

## 🚀 Features
- 📌 Add new costs by user, category, and date
- 📈 Generate reports on spending (e.g., totals by category)
- 📬 REST API architecture
- 🔗 MongoDB persistence
- 🧩 Modular and extensible design

---

## 🗄️ Database & Core Functions

All MongoDB-related functionality is implemented in `database/creation_and_connection.js`:

- 🔗 Connects to **MongoDB Atlas** using credentials stored in the `.env` file.
- 📦 Defines three collections using Mongoose schemas:
  - **User**: Stores basic user data (ID, name, birthday)
  - **Cost**: Stores expense records linked to users
  - **Report**: Stores monthly summaries grouped by category

### 📌 Core Functions

- `AddCost(...)`:  
  Adds a new cost for a user, validates the date, and updates the related monthly report if it exists.

- `CreateReport(...)`:  
  Generates a new monthly report for a user if one doesn't already exist.  
  If no relevant expenses exist, the report is not created.

- `CreateUser(...)`:  
  Creates a new user **only if they don't already exist**.  
  > ⚠️ This function is **not exported** and has **no API route**.  
  > To add users, you must call `CreateUser(id, first_name, last_name, birthday)` **directly in the code**.

By default, the code automatically creates the following test user at runtime:

```js
CreateUser(123123, 'Moshe', 'Israeli', 'January, 10th, 1990');
```
You can modify or remove this behavior in the file `creation_and_connection.js`.

---

## 📁 Project Structure
```bash
Server-side/
├── .idea/                         # IDE config (WebStorm/IntelliJ)
│   ├── runConfigurations/        # Saved run/debug settings
│   └── *.iml / *.xml             # Project metadata
│
├── bin/
│   └── www                       # Server launcher
│
├── database/
│   └── creation_and_connection.js  # MongoDB creation & connection setup
│
├── public/
│   └── stylesheets/
│       └── style.css            # Basic frontend styles (only for feedback from server)
│
├── routes/
│   ├── about.js                 # GET /about - static info route
│   ├── addcost.js               # POST /addcost - add expense
│   └── report.js                # GET /report - get monthly report
│
├── .gitignore                   # Files/folders excluded from version control
├── README.md                    # Project documentation
├── app.js                       # Express app setup and middleware
├── package.json                 # Project metadata and dependencies
├── package-lock.json            # Exact dependency versions
```

---

## 🔌 Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/ElinorCohen/Server-side.git
cd Server-side
npm install
```

2. **Set up MongoDB:**

   Create a `.env` file in the root directory with:
   ```env
   MONGO_URI=your-mongodb-atlas-uri
   PORT=3000
   ```
   > ⚠️ Make sure `.env` is included in `.gitignore` to keep credentials secure.

3. **Start the server:**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000` (or the port in your `.env`)

---

## 📬 API Overview

| Method | Endpoint   | Description                    |
| ------ | ---------- | ------------------------------ |
| GET    | `/about`   | Static route with project info |
| POST   | `/addcost` | Add a new cost record          |
| GET    | `/report`  | Generate or retrieve report    |

---

### 📌 Example: `POST /addcost`
```json
{
  "user_id": 123123,
  "year": 2025,
  "month": 7,
  "day": 20,
  "description": "Dinner at cafe",
  "category": "food",
  "sum": 80
}
```
> Tools like Postman can execute it

---

### 📌 Example: `GET /report`
**Endpoint:**
```http
GET /report?user_id=123123&month=7&year=2025
```
✔️ Sample Response:
```json
{
  "food": [
    {
      "day": 20,
      "description": "Dinner at cafe",
      "sum": 80
    }
  ],
  "health": [],
  "housing": [],
  "sport": [],
  "education": [],
  "transportation": [],
  "other": []
}
```
> Each category returns an array of matching costs.
> Empty arrays mean no expenses in that category for the given month.

---

## 🧪 Testing

Manual testing supported via:
- Postman
- curl (CLI)
- Browser (for static routes)

---

## 👩‍💻 Authors
- Shay Solomon
- Daniel Semerjian
- Elinor Cohen
