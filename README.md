# Certificate Automation Frontend

A React-based frontend application designed for event coordinators to submit event and participant data for automatic certificate generation and distribution via an n8n backend.

## Features

- **3D Isometric Landing Page:** Interactive landing page using Three.js and Anime.js.
- **Modular Form Sections:** Easy-to-use inputs for event details, templates, and participants.
- **Advanced Animations:** Smooth transitions and success sequences (e.g., paper airplane effect).
- **Mock Backend:** Integrated mock backend for local development and testing.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ui-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your n8n webhook URL:
    ```env
    VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-endpoint
    ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.

## Tech Stack

- **Framework:** React + TypeScript + Vite
- **Animations:** Anime.js
- **3D Graphics:** Three.js + React Three Fiber/Drei
- **State Management:** React Context API
