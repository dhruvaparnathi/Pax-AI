# Pax AI 🕊️

> A state-of-the-art, real-time AI-powered search and Q&A engine designed to cut through the noise of the web and deliver clean, structured, and factual answers.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=render&logoColor=white)](https://paxai.onrender.com)
🌐 **Live URL**: [https://paxai.onrender.com](https://paxai.onrender.com)

---

**Pax AI** combines semantic web search with advanced language models to offer a smooth, peaceful, and lightning-fast knowledge discovery experience.

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

Before running the application, you need to configure the environment variables for both development and production.

### 1. Local Development Setup
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

### 2. Production Setup (Render)

For deployment on **Render**, configure the following environment variables in your Render Web Service settings:

| Variable | Description | Value / Format |
| :--- | :--- | :--- |
| `NODE_ENV` | Mode of the Node environment | `production` |
| `CLIENT_URL` | Live origin of the frontend client | `https://paxai.onrender.com` |
| `MONGODB_URI` | Production database connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/pax-ai` *(MongoDB Atlas)* |
| `JWT_SECRET` | Secure key for signing JWTs | `[Use a strong random secret key]` |
| `GEMINI_API_KEY` | Google Gemini API Key | `[Your API Key]` |
| `MISTRAL_API_KEY` | Mistral AI API Key | `[Your API Key]` |
| `TAVILY_API_KEY` | Tavily Search API Key | `[Your API Key]` |
| `ELEVENLABS_API_KEY` | ElevenLabs Text-to-Speech API Key | `[Your API Key]` |
| `BREVO_API_KEY` | Brevo SMTP Service API Key | `[Your API Key]` |
| `BREVO_USER` | Verified Brevo sender email address | `[Your sender email]` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key for secure uploads | `[Your private key]` |

> [!NOTE]
> By default, frontend API and Socket.io requests are dynamically routed based on the current origin (`window.location.origin`). No frontend-specific environment variables need to be set in production when hosted together.

---

## 🏃 Getting Started (Local Development)

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

## 🌐 Production Deployment on Render

This project is configured as a monorepo setup where the Express backend serves the React frontend assets statically from the `Backend/public` directory.

### Render Web Service Setup

Follow these steps to deploy this project to Render:

1. **Create a new Web Service**: Link it to your repository.
2. **Environment**: Select `Node` as the runtime.
3. **Build Command**: Set this command to install dependencies, build the frontend, and copy the assets to the backend's public directory:
   ```bash
   # Install & build Frontend
   npm install --prefix Frontend && npm run build --prefix Frontend

   # Copy built Frontend bundle to Backend's public folder
   mkdir -p Backend/public
   cp -r Frontend/dist/* Backend/public/

   # Install Backend dependencies
   npm install --prefix Backend
   ```
4. **Start Command**: Run the Express server:
   ```bash
   npm start --prefix Backend
   ```
5. **Environment Variables**: Add all the production environment variables listed in the production setup table above.

---

## 🔒 Security & Validation
*   Passwords are encrypted using `bcryptjs`.
*   All inputs are schema-validated using `Zod` and `express-validator` to prevent SQL/NoSQL injection and cross-site scripting (XSS).
*   Cookies are stored with `httpOnly`, `secure`, and `sameSite: strict` settings to safeguard against cross-site request forgery (CSRF) and session hijacking.
