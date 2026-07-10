# Pax AI 🕊️

**Pax AI** is a state-of-the-art, real-time AI-powered search and Q&A engine designed to cut through the noise of the web and deliver clean, structured, and factual answers. Inspired by modern search assistants, Pax AI combines semantic web search with advanced language models to offer a smooth, peaceful, and lightning-fast knowledge discovery experience.

---

## 🚀 Key Features

*   **Retrieval-Augmented Generation (RAG)**: Leverages **Tavily Search API** to fetch real-time web results and synthesizes them into coherent, cited answers.
*   **Dual-Model Intelligence**: Integrated with **Google Gemini (genai)** and **Mistral AI** via LangChain for high-quality reasoning and generation.
*   **Voice Responses**: Powered by **ElevenLabs** to convert text responses into high-fidelity, natural-sounding audio.
*   **Real-time Streaming**: Utilizes **Socket.io** for real-time streaming of tokens and instant updates.
*   **Media Support**: Integrated with **ImageKit** for storing and processing chat attachments.
*   **Secure Authentication**: Features cookie-based authentication using **JSON Web Tokens (JWT)**, input validation with **Zod / Express Validator**, and email verification via **Brevo**.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS v4 (Modern & responsive dark-mode UI)
*   **State Management**: Redux Toolkit & React Redux
*   **Routing**: React Router v8
*   **Real-time Connections**: Socket.io Client

### Backend
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (via Mongoose)
*   **AI & Search Orchestration**: LangChain, Tavily API, Google GenAI SDK, Mistral AI SDK
*   **Email Platform**: Brevo SMTP Service
*   **Image Hosting**: ImageKit SDK

---

## 📁 Directory Structure

```
Pax-AI/
├── Backend/                # Node.js & Express Server
│   ├── src/
│   │   ├── controllers/    # Authentication & Chat Controllers
│   │   ├── services/       # AI, Search, Email, & Upload Services
│   │   ├── utils/          # Verification Email Templates & Helpers
│   │   └── models/         # MongoDB Mongoose Schema definitions
│   ├── server.js           # Server Entry Point
│   └── package.json
└── Frontend/               # React 19 client
    ├── src/
    │   ├── Features/       # Modules (Auth, Chat Dashboard, Sidebar)
    │   └── app/            # App setup (Redux store, routes)
    ├── index.html          # SPA HTML template
    └── package.json
```

---

## ⚙️ Configuration & Environment Setup

Before running the application, you need to configure the environment variables for both the Backend and Frontend.

### 1. Backend Setup
Create a `.env` file inside the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Client URL
CLIENT_URL=http://localhost:5173

# Database Connection
MONGODB_URI=mongodb://localhost:27017/pax-ai

# Security & Tokens
JWT_SECRET=your_super_secret_jwt_key

# Gemini & Mistral APIs
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Search API
TAVILY_API_KEY=your_tavily_api_key

# Voice API
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Email Verification (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_USER=your_verified_brevo_sender_email

# Image Uploads (ImageKit)
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### 2. Frontend Setup
Make sure the frontend connects to the backend API. By default, API requests are routed dynamically based on environment configuration or setup.

---

## 🏃 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB running locally or in the cloud

### Steps to Run

1.  **Clone the repository** and navigate to the project directory.
2.  **Start the Backend Server**:
    ```bash
    cd Backend
    npm install
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

3.  **Start the Frontend App**:
    ```bash
    cd ../Frontend
    npm install
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

---

## 🔒 Security & Validation
*   Passwords are encrypted using `bcryptjs`.
*   All inputs are schema-validated using `Zod` and `express-validator` to prevent SQL/NoSQL injection and cross-site scripting (XSS).
*   Cookies are stored with `httpOnly`, `secure`, and `sameSite: strict` settings to safeguard against cross-site request forgery (CSRF) and session hijacking.
