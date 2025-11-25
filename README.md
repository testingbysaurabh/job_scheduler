# Job Scheduler

A simple, full-stack application for creating, managing, and running jobs. It features a React frontend and a Node.js/Express backend. When a job completes, the backend can notify a specified endpoint via a webhook.

## Features

- **Create & Manage Jobs:** Add new jobs with a name, payload, and priority.
- **Job Dashboard:** View all jobs with their status (`pending`, `running`, `completed`).
- **Filtering:** Filter the job list by status or priority.
- **Run Jobs:** Manually trigger a job to run.
- **Webhook Notifications:** On job completion, the backend sends a POST request to a configured webhook URL.
- **Webhook Logging:** All webhook attempts (success or failure) are logged in the database.

## Tech Stack

| Area    | Technology                                      |
|---------|-------------------------------------------------|
| **Frontend** | React, Vite, Redux Toolkit, Tailwind CSS        |
| **Backend** | Node.js, Express.js, Knex.js, Axios             |
| **Database**| SQLite3 (default for dev), MySQL support included|

## Project Structure

```
.
├── Backend/      # Node.js/Express backend
│   ├── src/
│   ├── migrations/
│   ├── .env        # Environment variables
│   └── package.json
└── Frontend/     # React/Vite frontend
    ├── src/
    ├── .env        # Environment variables
    └── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (usually included with Node.js)

---

## Installation & Setup

Follow these steps to get the application running on your local machine.

### 1. Backend Setup

First, set up and start the backend server.

```bash
# 1. Navigate to the Backend directory
cd Backend

# 2. Install dependencies
npm install

# 3. Create the environment file by copying the example
cp .env.example .env
```

After copying, you can open `.env` and modify the variables if needed. The default `DB_CLIENT=sqlite3` and `DB_CONNECTION=dev.sqlite3` will work out-of-the-box. If you add a `WEBHOOK_URL`, the application will send notifications to it.

```bash
# 4. Run database migrations to create the necessary tables
npm run migrate

# 5. Start the backend development server
npm run dev
```
The backend server will now be running at `http://localhost:3000`.

### 2. Frontend Setup

Next, set up and start the frontend application in a separate terminal.

```bash
# 1. Navigate to the Frontend directory
cd Frontend

# 2. Install dependencies
npm install
```

The frontend is configured to connect to the backend at `http://localhost:3000` by default. If your backend is running on a different URL, create a `.env` file in the `Frontend` directory and set the `VITE_API_URL` variable:

```
VITE_API_URL=http://your-backend-url:port
```

```bash
# 3. Start the frontend development server
npm run dev
```

The frontend will now be accessible in your web browser, usually at `http://localhost:5173`.

---

## How It Works

### Running a Job

When you click the "Run" button for a job, the following happens:
1.  The job's status is immediately updated to `running`.
2.  The backend simulates work with a 3-second delay.
3.  The status is updated to `completed` and `completedAt` is set.
4.  If `WEBHOOK_URL` is configured, a POST request is sent with the job's completion details.
5.  The result of the webhook call is logged to the `webhook_logs` table.

### API Endpoints

The backend provides the following primary API endpoints:

| Method | Endpoint      | Description                               |
|--------|---------------|-------------------------------------------|
| `POST` | `/jobs`       | Creates a new job.                        |
| `GET`  | `/jobs`       | Lists all jobs. Supports query params `status` and `priority`. |
| `GET`  | `/jobs/:id`   | Retrieves a single job by its ID.         |
| `POST` | `/run-job/:id`| Executes a job and triggers the webhook.  |

### Testing

To run the backend tests:
```bash
cd Backend
npm test
```
