# MyResumeChecker

A full-stack web application that analyzes resumes using AI and provides detailed feedback.  
The project is built with **Python (Backend)**, **React (Frontend)**, and **Tailwind CSS** for a modern and responsive UI.

---

## 🚀 Features

- **AI-powered resume analysis** using NLP (Torch, etc.).
- **Interactive UI** built with React and Tailwind.
- **REST API backend** (Flask/Django/FastAPI – specify your backend framework).
- **Real-time feedback** and scoring.
- **Mobile responsive** and optimized.

---

## 🛠 Tech Stack

### **Frontend**

- React
- Tailwind CSS
- PostCSS

### **Backend**

- Python (Flask/FastAPI/Django)
- Torch / NLP libraries
- REST API

### **Other Tools**

- Node.js & npm
- Git & GitHub

---

## 📂 Project Structure

```

MyResumeChecker/
│
├── ai_service/ # Python backend (API + AI models)
│ ├── my_env/ # (ignored in Git) Python virtual environment
│ ├── app.py # Main backend app
│ └── requirements.txt # Python dependencies
│
├── client/ # React frontend
│ ├── src/ # React components and pages
│ ├── tailwind.config.js
│ └── package.json # Frontend dependencies
│
└── README.md

```

---

## ⚙️ Setup & Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/anjalicp22/MyResumeChecker.git
cd MyResumeChecker
```

---

### **2. Backend Setup (Python)**

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate    # On Windows
source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
```

To start the backend:

```bash
python app.py
```

---

### **3. Frontend Setup (React + Tailwind)**

```bash
cd client
npm install
npm start
```

---

## 🌟 Scripts

### **Frontend**

- `npm start` – Runs the React app.
- `npm run build` – Builds the frontend for production.

### **Backend**

- `python app.py` – Starts the Python API server.

---

## 🔒 Environment Variables

Create a `.env` file in both backend and frontend folders as needed:

```
# Example
API_KEY=your_api_key
```

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📧 Contact

**Author:** Anjali
**GitHub:** [anjalicp22](https://github.com/anjalicp22)
