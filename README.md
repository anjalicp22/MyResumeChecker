# **Welcome to MyResumeChecker 👋**

[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/anjalicp22/MyResumeChecker)
[![Issues](https://img.shields.io/github/issues/anjalicp22/MyResumeChecker)](https://github.com/anjalicp22/MyResumeChecker/issues)
[![Stars](https://img.shields.io/github/stars/anjalicp22/MyResumeChecker?style=social)](https://github.com/anjalicp22/MyResumeChecker)

---

## **About the Project**

**MyResumeChecker** is a full-stack web application designed to help job seekers **optimize their resumes** for specific job descriptions.

- Users can **upload resumes and job applications**, and the app compares **skills and keywords** to provide an **AI-driven match score**.
- It also allows users to **create and manage tasks**, ensuring better job search organization.
- Built with **React + Tailwind (frontend)** and a **Python FastAPI backend**, it offers a **modern UI** and **powerful AI processing** for accurate results.

---

### 🌐 **Live Deployments**

| Service         | URL                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Frontend        | [https://myresumechecker.onrender.com](https://myresumechecker.onrender.com)                             |
| FastAPI Backend | [https://myresumecheckerfastapibackend.onrender.com](https://myresumecheckerfastapibackend.onrender.com) |
| Node Service    | [https://myresumechecker-node-service.onrender.com](https://myresumechecker-node-service.onrender.com)   |

---

### **🏠 [Project Homepage](https://github.com/anjalicp22/MyResumeChecker)**

---

## **Installation**

```bash
# Backend (Python)
cd ai_service
pip install -r requirements.txt

# Frontend (React + Tailwind)
cd client
npm install
```

---

## **Usage**

```bash
# 1. Start the Backend (Python + FastAPI)
cd ai_service
my_env\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 2. Start the Node Server
cd server
node server.js

# 3. Start the Frontend (React)
cd client
npm start
```

- Backend runs on: **[http://localhost:8000](http://localhost:8000)**
- Frontend runs on: **[http://localhost:3000](http://localhost:3000)**

---

## **Run Tests**

```bash
# Backend (Python - pytest)
pytest
```

---

## 🚀 **Continuous Integration & Deployment (CI/CD)**

This project uses **GitHub Actions** for automated testing and **Render** for continuous deployment, ensuring code quality and uptime.

### 🔧 CI/CD Overview

- **Continuous Integration**

  - Automatically runs tests for:
    - `ai_service` (FastAPI backend with pytest)
    - `server` (Node.js service)
    - `client` (React frontend)
  - Enforces branch protection — all checks must pass before merging into `main`.

- **Continuous Deployment**
  - Each successful push to `main` triggers Render deploy hooks:
    - FastAPI backend → Render
    - Node server → Render
    - React frontend → Render
  - All environment variables and secrets (e.g., `MONGO_URI`, deploy tokens) are securely managed via **GitHub Secrets**.

📂 **Workflow File:** `.github/workflows/ci.yml`  
Contains build, test, and deploy automation steps for the entire stack.

---

## **Author**

👤 **Anjali C**

- **GitHub:** [@anjalicp22](https://github.com/anjalicp22)
- **LinkedIn:** [Anjali C](https://www.linkedin.com/in/anjali-c-306202215/)

---

## **🤝 Contributing**

Contributions, issues, and feature requests are welcome!
Check out the [issues page](https://github.com/anjalicp22/MyResumeChecker/issues).

---

## **Show Your Support**

If you found this project helpful, give it a ⭐️ to show your support!

---

_This README was generated and enhanced with ❤️ using [readme-md-generator](https://github.com/kefranabg/readme-md-generator)._
