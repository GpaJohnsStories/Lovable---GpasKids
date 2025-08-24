# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/37a1286c-a0bf-481b-8daa-ca6740409270

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/37a1286c-a0bf-481b-8daa-ca6740409270) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37a1286c-a0bf-481b-8daa-ca6740409270) and click on Share -> Publish.

## Deploying to GoDaddy Shared Hosting

To deploy this React app to GoDaddy shared hosting:

1. **Build the production version:**
   ```sh
   npm run build
   ```

2. **Create deployment zip:**
   - Navigate to the `dist` folder created by the build
   - Select ALL contents inside the `dist` folder (not the folder itself)
   - Create a zip file containing all these files
   - The .htaccess file will be included automatically for proper routing

3. **Upload to GoDaddy:**
   - Log into your GoDaddy cPanel
   - Go to File Manager
   - Navigate to your domain's public_html folder
   - Upload and extract the zip file
   - Your React app should now be live!

**Important:** Make sure your Supabase project allows your GoDaddy domain in CORS settings.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
