# Job Scheduler

This is a simple job scheduler application with a React frontend and a Node.js backend. The application allows you to create, view, and run jobs. When a job is run, the backend sends a webhook to a pre-configured URL.

## Architecture

The application is divided into two main parts:

*   **Frontend:** A React application built with Vite that provides a user interface for managing jobs. It uses Redux for state management and communicates with the backend via a REST API.
*   **Backend:** A Node.js application built with Express that exposes a REST API for managing jobs. It uses Knex.js for database migrations and queries, and Axios for sending webhooks.

### Database Schema

The application uses a SQL database (SQLite by default) with two tables:

*   **jobs:** Stores information about the jobs.
    *   `id`: The primary key.
    *   `title`: The title of the job.
    *   `description`: A description of the job.
    *   `created_at`: The timestamp when the job was created.
*   **webhook_logs:** Stores logs of the webhooks sent.
    *   `id`: The primary key.
    *   `job_id`: The ID of the job that triggered the webhook.
    *   `url`: The URL the webhook was sent to.
    *   `status`: The HTTP status code of the webhook response.
    *   `response`: The response body of the webhook.
    *   `created_at`: The timestamp when the log was created.

## Setup Instructions

### Backend

1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the `.env.example` file:
    ```bash
    cp .env.example .env
    ```
4.  Update the `.env` file with your database configuration and a webhook URL.
5.  Run the database migrations:
    ```bash
    npm run migrate
    ```
6.  Start the development server:
    ```bash
    npm run dev
    ```

### Frontend

1.  Navigate to the `Frontent` directory:
    ```bash
    cd Frontent
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add the following, pointing to your backend's URL:
    ```
    VITE_API_URL=http://localhost:3000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## API Usage

The backend exposes the following API endpoints:

*   **POST /jobs:** Creates a new job.
    *   **Request Body:**
        ```json
        {
          "title": "My Job",
          "description": "This is a test job."
        }
        ```
*   **GET /jobs:** Returns a list of all jobs.
*   **POST /run-job/:id:** Runs a specific job. This will trigger a webhook to the configured URL.

## Webhook Behavior

When a job is run using the **POST /run-job/:id** endpoint, the backend will send a POST request to the `WEBHOOK_URL` configured in the backend's `.env` file. The webhook payload will be a JSON object with the following structure:

```json
{
  "job_id": 1,
  "title": "My Job",
  "description": "This is a test job."
}
```

The backend will log the webhook's URL, status, and response in the `webhook_logs` table.