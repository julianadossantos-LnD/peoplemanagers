# PMO StackAdapt — People Manager Onboarding Site v3

## Setup

### 1. Deploy to GitHub Pages
Push all files to your repo root → Settings → Pages → Deploy from main branch.

### 2. Enable Google Sign-In (for checklist persistence across devices)

**Without Google sign-in:** checklists save automatically in each user's browser via localStorage. Works great, zero setup needed.

**With Google sign-in (recommended):**

1. Go to https://console.cloud.google.com/
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Add your GitHub Pages URL to "Authorized JavaScript origins"
   e.g. `https://yourusername.github.io`
5. Copy the Client ID
6. Open `app.js` and replace:
   `const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';`
   with your actual Client ID

That's it — Google sign-in will work and checklist progress will be scoped per user email.

## Files
- `index.html` — entire site (single page app)
- `style.css` — all styles
- `app.js` — routing, auth, checklist persistence
