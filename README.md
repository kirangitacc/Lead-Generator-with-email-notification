# Lead Generator Project

## Overview

This project is a simple lead generation system with:
- **Frontend:** React form to collect leads (name, email, company, message)
- **Backend:** Node.js/Express API to validate and forward leads
- **Automation:** n8n workflow to process leads and send email notifications

---

## Project Structure

```
lead-generator/
├── backend/      # Express backend API
├── frontend/     # React frontend app
└── README.md
```

---

## Setup Instructions

### 1. Frontend (React)

```sh
cd frontend
npm install
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000)
- Fill out and submit the lead form.

---

### 2. Backend (Express)

```sh
cd backend
npm install
node app.js
```
- Runs on [http://localhost:5000](http://localhost:5000)
- Receives form data, validates, and forwards to n8n.

---

### 3. n8n Workflow

- Install and start n8n:
  ```sh
  npx n8n
  ```
  or use PM2 for background service:
  ```sh
  npm install -g pm2
  pm2 start n8n
  pm2 save
  pm2 startup
  ```
- Open [http://localhost:5678](http://localhost:5678)
- Create a workflow:
  1. Add a **Webhook** node (POST, copy Production URL)
  2. Add a **Send Email** node (configure SMTP/SendGrid/Mailgun)
  3. Use expressions like:
     ```
     <b>Name:</b> {{$json["body"]["name"]}}<br>
     <b>Email:</b> {{$json["body"]["email"]}}<br>
     <b>Company:</b> {{$json["body"]["company"]}}<br>
     <b>Message:</b> {{$json["body"]["message"]}}
     ```
  4. Activate the workflow.

---

## Usage

1. Start all services (frontend, backend, n8n).
2. Submit the lead form in the frontend.
3. Backend validates and forwards data to n8n.
4. n8n sends an email notification with lead details.

---

## Notes

- Update the backend webhook URL to match your n8n Webhook node Production URL.
- For email, use valid SMTP/SendGrid/Mailgun credentials.
- For production, secure your n8n webhook with authentication.

---

## License

MIT