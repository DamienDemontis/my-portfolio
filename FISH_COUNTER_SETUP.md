# Fish Counter Setup Guide

The fish counter feature allows visitors to give fish to the cat, with the count shared across all users globally.

## 🚀 Quick Start (Basic Version)

The basic version is already working using in-memory storage. It will work but resets on cold starts.

**Files:**
- `/api/fish-counter.ts` - Basic API endpoint (in-memory)
- `/src/services/fishCounterService.ts` - Frontend service
- `/src/components/FishCounter.tsx` - UI component

## 🎯 Production Setup (Recommended)

For persistent storage that doesn't reset, use **Vercel KV** (free tier: 256MB, 100k requests/month).

### Option 1: Vercel KV (Recommended - Free & Easy)

1. **Install Vercel KV package:**
```bash
npm install @vercel/kv
```

2. **Enable Vercel KV in your Vercel dashboard:**
   - Go to your project on Vercel
   - Navigate to Storage → Create Database → KV
   - Copy the environment variables

3. **Update the API endpoint:**
   - Rename `/api/fish-counter.ts` to `/api/fish-counter-backup.ts`
   - Rename `/api/fish-counter-kv.ts` to `/api/fish-counter.ts`

4. **Deploy to Vercel:**
```bash
vercel --prod
```

That's it! Your fish counter will now be persistent across all users globally.

### Option 2: Keep Basic Version (Testing)

If you want to test locally without KV:
- The current setup works out of the box
- Count resets when server restarts
- Good for development/testing

## 📁 File Structure

```
my-portfolio/
├── api/
│   ├── fish-counter.ts        # Basic version (in-memory)
│   └── fish-counter-kv.ts     # KV version (persistent)
├── src/
│   ├── components/
│   │   └── FishCounter.tsx    # UI component
│   └── services/
│       └── fishCounterService.ts  # API client
```

## 🎨 Features

- ✅ Cute animated UI with floating fish
- ✅ Global counter shared across all users
- ✅ Optimistic updates for instant feedback
- ✅ Fallback to localStorage if API fails
- ✅ Cooldown to prevent spam
- ✅ Fun animations and messages

## 🔧 Customization

### Change cooldown duration:
In `FishCounter.tsx`, line ~52:
```typescript
setTimeout(() => {
  setJustFed(false)
}, 800) // Change this value (milliseconds)
```

### Change button text:
In `FishCounter.tsx`, add i18n keys for multi-language support.

### Styling:
All Tailwind classes can be modified in `FishCounter.tsx`.

## 🐛 Troubleshooting

**Counter resets on every deploy:**
- Use Vercel KV (Option 1 above)

**API not found (404):**
- Make sure `api/` folder is at the root of your project
- Vercel automatically deploys files in `/api` as serverless functions

**CORS errors:**
- Already configured in the API routes
- If issues persist, check Vercel deployment logs

## 📊 Monitoring

View fish count statistics:
```bash
curl https://your-domain.vercel.app/api/fish-counter
```

## 🎉 That's it!

Your visitors can now feed the cat and see the global counter increase! 🐱🐟
