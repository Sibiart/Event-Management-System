
  # Namma Event  Site

  This is a code bundle for Namma Event  Site. The original project is available at https://www.figma.com/design/xzMxfQ9eS878vVRvmCkH9j/Namma-Event--Site.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  Create a `.env.local` file in the project root with the values from Supabase Dashboard -> Connect -> Vite:

  ```text
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
  ```

  Restart Vite after changing environment variables.

    ## Supabase persistence

    Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor before using the app. The app keeps a local cache for the current UI and upserts new or changed users, bookings, notifications, venues, DJs, and vendors to Supabase.
  