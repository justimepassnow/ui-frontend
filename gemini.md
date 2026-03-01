# Project Overview

This is a React-based frontend application designed for event coordinators. The primary purpose of this tool is to provide a user-friendly form for submitting event and participant data. Upon submission, the frontend communicates with an n8n-powered backend which handles the automatic generation and distribution of certificates to event participants.

The frontend focuses on a smooth user experience, leveraging the **Anime.js** library for high-quality animations and transitions.

# Setup Instructions

To get the development environment running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ui-frontend
    ```

2.  **Install dependencies:**
    Ensure you have [Node.js](https://nodejs.org/) installed, then run:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and specify the n8n webhook URL:
    ```env
    REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-endpoint
    ```

4.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

# Usage Examples

### Coordinator Form Submission
1. Open the application in your browser.
2. Fill in the event details (e.g., Event Name, Date).
3. Upload or enter participant details (e.g., Names, Email addresses).
4. Click the "Generate Certificates" button.
5. A confirmation message will appear once the data is successfully sent to the n8n backend.

# Contribution Guidelines

This frontend is part of a larger system. The post-submission logic (certificate creation, email delivery, etc.) is handled by a separate backend team via n8n workflows.

### Handover Instructions
- **API Integration:** All form data is sent as a JSON payload to the endpoint defined in `REACT_APP_N8N_WEBHOOK_URL`.
- **Validation:** Ensure that frontend validation aligns with the requirements of the n8n workflow.
- **Animations:** When adding new UI elements, use `animejs` to maintain consistency with the existing design language.
- **Reporting Issues:** If there are changes needed in the data structure expected by the backend, please coordinate with the backend team before modifying the submission logic.
