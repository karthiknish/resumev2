# Karthik Nishanth's Portfolio Website

This project is a personal portfolio website built with Next.js, showcasing my skills, achievements, and projects as a full-stack developer and digital marketer.

## Features

- Modern, responsive design using TailwindCSS
- Interactive UI components with Framer Motion animations
- Integration with Google PageSpeed Insights API for website performance analysis
- Showcase of skills, projects, and achievements
- Contact form for potential clients or employers

## Technologies Used

- Next.js
- React
- TailwindCSS
- Framer Motion
- Google PageSpeed Insights API

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Google PageSpeed API key:
   ```
   NEXT_PUBLIC_GOOGLE_SPEED=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the website

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments on every push to the main branch.

## Contributing

While this is a personal portfolio project, suggestions and feedback are always welcome. Feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

# Resume Builder Application

This is a Resume Builder application built with Next.js, MongoDB, and NextAuth.js.

## Admin Setup Instructions

This application uses role-based access control to protect admin features. Follow these steps to set up admin access:

### 1. Set Environment Variables

Make sure your `.env.local` file contains the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_SECRET_KEY=your_admin_secret_key
```

The `ADMIN_SECRET_KEY` is used to authorize admin promotion requests, and should be a strong, randomly generated string.

### 2. Create a Regular User Account

First, register a normal user account through the signup page.

### 3. Promote a User to Admin

There are two ways to make a user an admin:

#### Option 1: Use the Admin Setup Page

1. Navigate to `/admin/setup-admin` in your browser
2. Enter the email of the user you want to promote
3. Enter your `ADMIN_SECRET_KEY` 
4. Click "Make Admin"

#### Option 2: Manual API Request

You can also make a direct API request:

```bash
curl -X POST http://localhost:3000/api/auth/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "adminSecret": "your_admin_secret_key"}'
```

### 4. Access Admin Dashboard

Once promoted to admin, you can access the admin dashboard at `/admin`.

## Authentication Debugging

If you're experiencing authentication issues:

1. Make sure all environment variables are correctly set
2. Check that users have a `role` field in the database
3. The Admin Dashboard logs authentication details in the console for debugging
4. Ensure that NextAuth.js is properly including the user's role in the session

## Role Field

Users in the database have a `role` field that can be either:
- `"user"` - Regular user (default)
- `"admin"` - Administrator with special privileges
