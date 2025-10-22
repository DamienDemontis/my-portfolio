# 🚀 Add Supabase Environment Variables to Vercel

## Quick Steps

1. **Go to Vercel Dashboard**
   - Open [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project: `my-portfolio`

2. **Navigate to Environment Variables**
   - Click **Settings** tab
   - Click **Environment Variables** in the sidebar

3. **Add Variables**

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://ampkqnmlugltkoxqhkjp.supabase.co`
   - Environments: Check ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcGtxbm1sdWdsdGtveHFoa2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTkxMzEsImV4cCI6MjA3NjczNTEzMX0.xpo82DDzqf_YG4S5D_buhS9z9xiiOLDy1LveeE_2ndA`
   - Environments: Check ✅ Production, ✅ Preview, ✅ Development

4. **Save**
   - Click **Save** for each variable

5. **Redeploy** (if already deployed)
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment → **Redeploy**
   - Or just push a new commit

## ✅ Done!

Your fish counter will now work in production with real-time updates! 🐱🐟

---

## 🧪 Test Locally First

Before deploying, test locally:

```bash
npm run dev
```

Then open:
- http://localhost:3000
- Scroll to "Restons Connectés" section
- Try clicking "Give a Fish"
- Open another browser window and watch the counter update in real-time!

---

## 📝 Important Notes

- ⚠️ **DO NOT** commit `.env.local` to git (it's already in `.gitignore`)
- ✅ The `anon` key is **safe** to expose in your frontend code
- ✅ Never use the `service_role` key in frontend code (keep it secret!)
- ✅ Environment variables starting with `VITE_` are accessible in browser

---

## 🔍 Verify Variables in Vercel

After adding:

1. Go to Settings → Environment Variables
2. You should see both variables listed
3. Each should show 3 environments (Production, Preview, Development)

---

## 🐛 Troubleshooting

**Variables not working after deploy:**
- Make sure you redeployed after adding variables
- Check the deployment logs for errors
- Verify variable names are EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Still not working:**
- Clear browser cache
- Try incognito/private window
- Check browser console for errors
