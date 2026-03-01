# Product Requirements Document (PRD): Certificate Automation Frontend

## 1. Project Overview
A React-based frontend application designed for event coordinators to automate the generation and distribution of event certificates. The frontend provides a sleek, highly animated user interface (powered by **Anime.js**) to collect event details, templates, and participant data. Because the n8n backend is currently unbuilt, the frontend will utilize mock asynchronous functions to simulate network latency, allowing the integration team to easily swap in real API calls later. The design heavily features a playful, bouncy animation style combined with paper and mail metaphors.

---

## 2. Core Requirements (What to Do)

### 2.1 UI Architecture & State Management
- **State Management:** Strictly use the **React Context API** to manage the global form state. This provides a clean separation of concerns and allows the backend integration team to access form payloads without dealing with prop-drilling or learning complex state libraries.
- **Component Structure:** Build modular components (e.g., `EventInput`, `TemplateUpload`, `ParticipantUpload`, `ActionButtons`) so the integration team can easily locate and modify specific UI elements.

### 2.2 Form Structure & Inputs
The form must include the following fields with their respective behaviors:

- **Event Name:** Standard text input field.
- **Certificate Template Section:**
    - **UI:** Implement a bouncy toggle switch to select between "Provide Link" and "Upload File".
    - **Link Mode:** Input field for a Google Sheets link. Basic regex validation to ensure the string resembles a URL (e.g., starts with `http`/`https`).
    - **Upload Mode:** File dropzone/input restricted strictly to `.ppt` and `.pptx` formats.
    - **Sub-fields:** Must clearly distinguish between the required **Participant Template** and an optional **Winner's Template**.
- **Participant List Section:**
    - **UI:** Implement a toggle switch to select between "Provide Link" (Google Sheets) and "Upload File" (Excel format: `.xls`, `.xlsx`).
- **Live Preview Window:** A dedicated UI area that acts as a placeholder for the generated preview image.

### 2.3 Animation System (Anime.js)
The UI must be "frontend-heavy" with high-quality animations using **Anime.js**, focusing on a playful/bouncy theme and paper/mail metaphors.

- **Form Interactions:** Inputs, buttons, and toggles should have slight bouncy, elastic scaling effects when focused, hovered, or clicked.
- **Loading State (Generate Preview Button):** When clicked, trigger a complex, continuous buffering animation within the Live Preview window. Utilize a playful paper folding metaphor (e.g., an envelope assembling itself or origami folding) to simulate backend processing.
- **Success State (Mass Distribute Button):** When clicked and the simulated promise resolves, trigger a celebratory confirmation animation. Use a mail metaphor—e.g., the form folding into a paper airplane and flying off the screen, followed by a bouncy "Success!" checkmark.

### 2.4 Design System & Theming (Manila & Origami)
To ensure the color theme is easily changeable, all colors must be defined as **CSS Custom Properties (Variables)** in a global stylesheet (e.g., `:root` in `theme.css`). Avoid hardcoding hex codes into individual components.

- **Typography:** Use a rounded, friendly sans-serif font like **Nunito**, **Quicksand**, or **Poppins** to complement the bouncy animations.
- **CSS Variables (Default Theme):**
    - `--bg-color`: Soft Light Gray (`#F3F4F6`) – The background "desk".
    - `--surface-color`: Manila Yellow (`#FDE68A`) – Used for drag-and-drop zones and inputs to mimic physical folders.
    - `--primary-action`: Energetic Indigo (`#4F46E5`) – The main "Mass Distribute" button and active states.
    - `--accent-color`: Coral Pink (`#FB7185`) – Used for loading animations, paper airplanes, and bouncy toggle switches.
    - `--text-primary`: Charcoal (`#2B2D42`) – For high-contrast readability.

### 2.5 Integration Handoff Readiness
- **Mock API Callbacks:** Create a dedicated file (e.g., `api/mockBackend.js`) containing stubbed async functions for `generatePreview(formData)` and `massDistribute(formData)`.
- **Simulated Latency:** Use JavaScript Promises with `setTimeout` (e.g., 2-3 seconds) to mimic network requests. This ensures your loading animations trigger correctly and shows the integration team exactly where to insert their API calls.

---

## 3. Scope Boundaries (What Not to Do)
- **Do not implement real backend logic:** Do not attempt to parse the `.pptx` or Excel files in the browser. The frontend's only job is to capture the files/links and append them to a `FormData` object.
- **Do not generate the preview locally:** Do not use canvas or client-side libraries to render the certificate. The n8n backend will handle rendering. Only handle the loading state and display a mock image URL returned by the stubbed API.
- **Do not use complex state management:** Strictly avoid Redux, Zustand, or MobX. Stick to simple **React Context API**.
- **Do not couple animations with API logic:** Keep your **Anime.js** animation triggers separate from the data-fetching logic. The integration team should be able to alter the API endpoint without breaking the visual effects.
- **Do not hardcode colors:** Always reference the CSS variables so the theme can be completely overhauled by changing just a few lines in the global stylesheet.

---

## 4. Technical References
To ensure standard industry practices are met, refer to the official documentation for the primary technologies:

- **React Context API:** [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- **CSS Variables for Theming:** [MDN Web Docs: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- **Anime.js:** [Anime.js Official Documentation](https://animejs.com/documentation/)
- **Handling File Uploads:** [MDN Web Docs: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)

