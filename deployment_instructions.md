# Deployment and Setup Instructions for Supabase Integration

Follow these steps to connect your frontend application to your Supabase backend and deploy the server-side functions.

---

### **Part 1: Set Up Frontend Environment Variables**

Your React application (built with Vite) needs to know your Supabase project's URL and public API key.

1.  **Create a `.env` file** in the root directory of this project. This file is used to store your secret keys securely and is typically not committed to version control.

2.  **Add the following lines** to the `.env` file, replacing the placeholder values with the credentials you provided:

    ```bash
    VITE_SUPABASE_URL="https://jirjujoqckpdegkdsros.supabase.co"
    VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcmp1am9xY2twZGVna2Rzcm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDc2NzQsImV4cCI6MjA3NDg4MzY3NH0.kfiT8fnX8x_SyyXM4zf0R2XgG1Sx6ipIehAI8GjpOys"
    ```
    The `VITE_` prefix is important, as it's how Vite exposes environment variables to your frontend code.

---

### **Part 2: Set Up Edge Function Environment Variables**

Your Edge Functions also need credentials to communicate with your database. These are set within the Supabase project dashboard.

1.  **Go to your Supabase Project Dashboard**: Navigate to `https://app.supabase.com` and select your project.
2.  **Navigate to Edge Functions**: In the left sidebar, click on the **Edge Functions** icon.
3.  **Go to Settings**: In the Edge Functions section, find and click on **Settings**.
4.  **Add New Secret**: You will need to add the following secrets:
    *   Click `Add new secret`.
    *   For the **Name**, enter `SUPABASE_URL`.
    *   For the **Value**, enter your project URL: `https://jirjujoqckpdegkdsros.supabase.co`
    *   Click `Create secret`.
    *   Repeat the process for your Anon key:
    *   **Name**: `SUPABASE_ANON_KEY`
    *   **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppcmp1am9xY2twZGVna2Rzcm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDc2NzQsImV4cCI6MjA3NDg4MzY3NH0.kfiT8fnX8x_SyyXM4zf0R2XgG1Sx6ipIehAI8GjpOys`

---

### **Part 3: Deploy the Edge Functions**

You need the [Supabase CLI](https://supabase.com/docs/guides/cli) to deploy the functions. Once you have it installed and are logged in (`supabase login`), you can deploy all the functions I created with a single command.

1.  **Open your terminal** in the root directory of this project.

2.  **Run the following command**:

    ```bash
    supabase functions deploy
    ```

    This command will find all the functions inside the `supabase/functions` directory and deploy them to your project. It will deploy:
    -   `get-real-time-data`
    -   `get-executive-summary`
    -   `get-financial-performance`
    -   `get-game-performance`
    -   `get-player-analytics`

---

After completing these steps, your dashboard application will be fully configured to fetch live data from your Supabase database. You will just need to update the remaining four dashboard components to call their respective functions, following the example I implemented in the "Real-Time Operations" dashboard.