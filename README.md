# 📘 Project Documentation: Prompt Forge

Welcome to the **Prompt Forge** project! This document is designed to make your onboarding process smooth and intuitive. You'll find everything you need to understand the architecture, technologies, folder structure, and API endpoints of this application. Let's get started! 🚀

---

## 📂 Directory Structure

Here’s a breakdown of the project folders and their purposes:

```
edwardbudaza-promptforge/
├── README.md                 # Overview and setup instructions
├── components.json           # Configuration for components
├── package.json              # Dependencies and scripts
├── tailwind.config.mjs       # Tailwind CSS configuration
├── convex/                   # Backend logic for Convex
│   ├── schema.js             # Convex schema definitions
│   ├── users.js              # User-related queries and mutations
│   ├── workspace.js          # Workspace-related queries and mutations
│   └── _generated/           # Convex auto-generated files
├── src/                      # Main source code
│   ├── app/                  # Application files
│   │   ├── (main)/           # Main application pages
│   │   │   ├── pricing/      # Pricing page
│   │   │   └── workspace/    # Workspace feature
│   │   └── api/              # Backend API routes
│   │       ├── ai-chat/      # AI chat endpoint
│   │       └── gen-ai-code/  # AI code generation endpoint
│   ├── components/           # React components
│   │   ├── custom/           # Feature-specific components
│   │   ├── dialogs/          # Dialog components
│   │   ├── global/           # Global UI components
│   │   └── ui/               # UI primitives like buttons
│   ├── context/              # React context for state management
│   ├── data/                 # Static data and configurations
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── styles/               # CSS and global styles
```

---

## 🛠️ Technologies Used

### **Frontend**

- **Next.js 14**: React framework for server-rendered and static web applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide Icons**: Beautiful and consistent iconography.
- **React Markdown**: For rendering Markdown content.

### **Backend**

- **Convex**: A backend-as-a-service for real-time data and queries.
- **Axios**: For HTTP requests.

### **State Management**

- **React Context**: Used for global state sharing.

---

## 🌐 API Endpoints

### **1. AI Chat**

**Route:** `/api/ai-chat`

- **Method:** POST
- **Payload:** `{ "prompt": "<user_prompt>" }`
- **Response:** `{ "result": "<ai_response>" }`

### **2. AI Code Generation**

**Route:** `/api/gen-ai-code`

- **Method:** POST
- **Payload:** `{ "prompt": "<user_prompt>" }`
- **Response:** `JSON object with generated files`

### **3. Convex Queries and Mutations**

- **Users:** CreateUser, GetUser, UpdateToken
- **Workspace:** CreateWorkspace, GetWorkspace, UpdateMessages, UpdateFiles, GetAllWorkspace

---

## ⚙️ Key Features

### **1. Workspace Management**

Users can create, view, and update workspaces. Each workspace contains chat messages and files.

### **2. AI Chat**

Interactive AI chat based on user prompts.

### **3. AI Code Generation**

Generate files and code snippets using AI for rapid development.

---

## 🚀 Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/edwardbudaza/promptforge.git
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Additional Notes

### **Coding Standards**

- Follow the established folder structure.
- Use functional components and React hooks.
- Adhere to the Tailwind CSS conventions for styling.

### **Environment Variables**

- Ensure `.env` file is set up with necessary API keys and environment variables.

---

    # Deployment used by `npx convex dev`
    CONVEX_DEPLOYMENT=

    NEXT_PUBLIC_CONVEX_URL=

    #--------------------------------------------
    # GOOGLE CONFIGURATION
    #--------------------------------------------
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=

    GEMINI_API_KEY=


    #---------------------------------------------
    # PAYPAL CONFIGURATION
    #---------------------------------------------
    NEXT_PUBLIC_PAYPAL_CLIENT_ID=

---

Feel free to ask any questions or explore the repository to learn more. Welcome to the team! 🎉
