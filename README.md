
# Namma Event Preview
Homepage (index.html)
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/fab5bf5c-95fd-4b66-b16a-f34484179d36" />

Venue Listing (/venues/index.html)
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/e18d654d-ec32-447f-9272-147f0b786ddb" />

Booking Form (/book/index.html)
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/1e80645a-30ba-4f58-b686-99742f80c8e1" />

Vendor tab
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/88579c2b-cded-46d9-b950-0a29baa0ed11" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/7aa36dba-48f1-4dbb-a813-a2120ed092ee" />

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
  
