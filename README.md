# ResumeV2 – Features Overview

This project is a full-stack portfolio, blog, and admin dashboard platform built with Next.js, MongoDB, and a modern UI stack. It is designed for creators, freelancers, and professionals who want a powerful, AI-enhanced content and project management system.

---

## Key Features

### ✨ AI-Powered Content Creation
- **AI Blog Generation:** Generate high-quality blog posts from a topic, outline, or even a pasted article link, using Gemini AI.
- **AI Markdown Formatting:** Instantly format blog content into clean, readable markdown.
- **AI Suggestions:** Get AI-powered suggestions for blog titles, categories, keywords, and descriptions.

### 📝 Blog & Content Management
- **Rich Markdown Support:** Write and edit blogs in markdown with live preview.
- **Draft/Publish Toggle:** Easily switch blog posts between draft and published status.
- **Pagination & Filtering:** Paginated blog lists with category, keyword, and search filters.
- **SEO & Accessibility:** Built-in SEO best practices and accessible UI components.

### 📸 Media Integration
- **Pexels Image Search:** Search and select high-quality images from Pexels for blog banners, with real-time search and pagination.
- **Image Optimization:** Automatic image optimization for fast loading and responsive display.

### 🛠️ Admin Dashboard
- **Blog Management:** Edit, delete, and manage all blog posts from a single dashboard.
- **User & Subscriber Management:** Manage users, roles, and newsletter subscribers.
- **Status Controls:** Toggle blog post status directly from the dashboard.
- **Analytics & Stats:** View blog, message, and subscriber stats at a glance.

### 🔗 LinkedIn & Social Tools
- **LinkedIn Post Generator:** AI-powered LinkedIn post suggestions and analytics.
- **Post Scheduling & Reminders:** Tools to help plan and optimize social content.

### 🔒 Authentication & Security
- **Role-Based Access:** Secure admin features with NextAuth.js and role-based permissions.
- **Robust Validation:** All forms and API endpoints include strong validation and clear error messages.

### ⚡ Modern UI & Experience
- **Responsive Design:** Fully responsive, mobile-friendly layout.
- **Dark Mode:** Consistent dark theme with accessible color contrast.
- **Framer Motion Animations:** Smooth transitions and interactive UI elements.
- **Toast Notifications:** User feedback with styled, backgrounded toasts for all actions.

---

## Project Structure

- **/src/pages** – All Next.js pages (blog, admin, API routes, etc.)
- **/src/components** – Reusable UI and admin components
- **/src/models** – Mongoose models for MongoDB
- **/src/lib** – Utility libraries (AI, image, mail, etc.)
- **/public** – Static assets and images

---

## Notable Integrations

- **Next.js** – React framework for SSR and SSG
- **MongoDB** – Database for blogs, users, and subscribers
- **NextAuth.js** – Authentication and role management
- **Gemini AI** – Content generation and formatting
- **Pexels API** – Image search and selection
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Animations and transitions

---

## Usage

This project is intended for developers and creators who want a feature-rich, AI-powered portfolio and blog platform. It is ready for deployment and customization.

For environment setup, deployment, and advanced configuration, see the codebase and `.env.example`.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
