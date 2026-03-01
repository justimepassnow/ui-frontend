# Certificate Automation Frontend: Implementation Roadmap

## 0. Landing Page (3D Isometric Animation)
- [ ] Create `LandingPage` component with `Three.js` Canvas.
- [ ] Implement Isometric camera view.
- [ ] Animation: Blank paper swirls and lands on the plane.
- [ ] Animation: Layers (Text, Borders) appear on the paper.
- [ ] Animation: Paper folds into an airplane.
- [ ] Animation: Airplane flies away.
- [ ] Add "Let's Get Started" scroll-trigger or CTA button.
- [ ] Implement navigation between Landing Page and Form.

## 1. Project Initialization
- [x] Initialize React app (TypeScript recommended).
- [x] Install dependencies: `npm install animejs`.
- [x] Set up project structure:
    - [x] `/src/components` - UI blocks (EventInput, ActionButtons, etc.)
    - [x] `/src/context` - FormState using React Context API.
    - [x] `/src/styles` - Global CSS and theme variables.
    - [x] `/src/api` - Mock backend functions.
- [x] Create `.env` file with `REACT_APP_N8N_WEBHOOK_URL`.

## 2. Global State & Theming
- [x] **Design System:** Implement `src/styles/theme.css` with CSS Custom Properties (`--bg-color`, `--surface-color`, etc.) and import Nunito/Poppins font.
- [x] **State Management:** Create `src/context/FormContext.tsx` to handle all form inputs and file/link states.
- [x] **Mock API:** Implement `src/api/mockBackend.ts` with `generatePreview` and `massDistribute` stubs using `setTimeout` promises.

## 3. Component Development (Form Logic)
- [x] **Event Details:** `EventInput` component for the Event Name.
- [x] **Certificate Templates:** `TemplateSection` component.
    - [x] Bouncy toggle switch (Link vs. Upload).
    - [x] Link input with URL regex validation.
    - [x] File dropzone for `.ppt` / `.pptx` (Participant and optional Winner templates).
- [x] **Participant Data:** `ParticipantSection` component.
    - [x] Toggle switch (Link vs. Upload).
    - [x] Link input or File dropzone for Excel (`.xls`, `.xlsx`).
- [x] **Actions & Preview:**
    - [x] `ActionButtons` for "Generate Preview" and "Mass Distribute".
    - [x] `LivePreview` window placeholder for the mock certificate image.

## 4. Animation System (Anime.js)
- [x] **Micro-interactions:** Add bouncy scaling effects to all interactive elements (hover/click/focus).
- [x] **3D Tilt Effects:** Implement 3D mouse-tracking tilt on form sections.
- [x] **3D Transitions:** Implement 3D flip animations for toggling between Link/Upload modes.
- [x] **Loading Sequence:** Implement the "Paper Folding/Origami" animation in the `LivePreview` window.
- [x] **Completion Sequence:** Implement the full-form "Paper Airplane" success animation (form folds and flies off-screen).

## 5. Verification & Handoff
- [ ] Ensure all form data is correctly captured in a `FormData` object.
- [ ] Verify that animations trigger correctly based on mock API states (Loading -> Success).
- [ ] Run final build and check for console errors or layout issues.
