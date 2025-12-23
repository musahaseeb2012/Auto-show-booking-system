# Deployment Guide

This guide provides instructions for deploying the Toronto Auto Show 2026 Booking System to various platforms.

## Quick Deploy to Railway (Recommended - FREE)

Railway provides free hosting for full-stack applications with PostgreSQL/SQLite support.

### One-Click Deploy:

1. **Push your code to GitHub** (already done ✅)

2. **Deploy to Railway:**
   - Visit: https://railway.app/
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose `musahaseeb2012/Auto-show-booking-system`
   - Select branch: `claude/auto-show-booking-system-v5VL2`
   - Railway will auto-detect the configuration and deploy

3. **Access your app:**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - The app will be live in 2-3 minutes!

### Environment Variables (Optional):
Railway will use default values, but you can customize:
- `PORT` - Auto-set by Railway
- `NODE_ENV` - Set to `production`
- `DATABASE_PATH` - Defaults to `./bookings.db`

---

## Alternative: Deploy to Render (FREE)

Render is another excellent free hosting platform.

### Deploy Steps:

1. **Visit Render:**
   - Go to: https://render.com/
   - Sign up/Login with GitHub

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `Auto-show-booking-system`
   - Branch: `claude/auto-show-booking-system-v5VL2`

3. **Configuration:**
   ```
   Name: toronto-auto-show
   Environment: Node
   Build Command: npm install && cd client && npm install && cd .. && npm run build
   Start Command: npm start
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Your app will be live at: `https://toronto-auto-show.onrender.com`

---

## Alternative: Deploy to Vercel (Frontend) + Railway (Backend)

For a split deployment:

### Backend (Railway):
Same as above

### Frontend (Vercel):
1. Visit: https://vercel.com
2. Import GitHub repository
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-railway-backend.railway.app`
5. Deploy

---

## Deploy to Heroku (FREE Tier Ended)

Heroku no longer offers a free tier, but if you have a paid account:

### Deploy Steps:

1. **Install Heroku CLI:**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create toronto-auto-show-2026
   ```

4. **Deploy:**
   ```bash
   git push heroku claude/auto-show-booking-system-v5VL2:main
   ```

5. **Open App:**
   ```bash
   heroku open
   ```

---

## Environment Variables for Production

When deploying, ensure these are set:

```bash
NODE_ENV=production
PORT=3000  # Usually auto-set by the platform
DATABASE_PATH=./bookings.db
```

---

## Build Process

The application builds in this order:
1. Install root dependencies (`npm install`)
2. Install client dependencies (`cd client && npm install`)
3. Build TypeScript server (`npm run build:server`)
4. Build React frontend (`npm run build:client`)
5. Start production server (`npm start`)

The server serves the built React app from `client/dist` and handles API routes at `/api/*`.

---

## Post-Deployment Checklist

After deployment, verify:

- ✅ App loads at the provided URL
- ✅ Ticket types are displayed
- ✅ Show dates are visible
- ✅ Booking form works
- ✅ Bookings can be created
- ✅ Email lookup works
- ✅ Booking cancellation works
- ✅ Works on Safari (desktop & mobile)
- ✅ Responsive on mobile devices

---

## Database Persistence

### Railway/Render:
- SQLite database persists in the container
- For production, consider upgrading to PostgreSQL (both platforms support it)

### To Use PostgreSQL Instead:
1. Add PostgreSQL add-on in Railway/Render
2. Update `src/server/database.ts` to use `pg` instead of `better-sqlite3`
3. Update connection string to use `process.env.DATABASE_URL`

---

## Monitoring and Logs

### Railway:
- View logs: Railway Dashboard → Your Project → Deployments → View Logs

### Render:
- View logs: Render Dashboard → Your Service → Logs tab

---

## Custom Domain

### Railway:
1. Go to project settings
2. Click "Domains"
3. Add custom domain (e.g., `booking.torontoautoshow.com`)
4. Update DNS records as instructed

### Render:
1. Go to service settings
2. Click "Custom Domain"
3. Add domain and update DNS

---

## Troubleshooting

**Build fails:**
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node version (18.x recommended)

**App crashes on start:**
- Check application logs
- Verify `start` script in package.json
- Ensure PORT is not hardcoded

**Database not persisting:**
- Railway/Render may reset filesystem on redeploy
- Consider using PostgreSQL for production
- Or use Railway's persistent volumes

**API not working:**
- Check CORS settings in `src/server/server.ts`
- Verify API routes are not conflicting with static file serving
- Check network tab in browser dev tools

---

## Free Tier Limitations

### Railway (Recommended):
- ✅ $5 free credit per month
- ✅ Enough for small to medium traffic
- ✅ Automatic HTTPS
- ✅ Easy database management

### Render:
- ✅ Free tier available
- ⚠️ Spins down after 15 minutes of inactivity
- ✅ Automatic HTTPS
- ✅ Good for demos and testing

---

## Production Recommendations

For production use:
1. **Use PostgreSQL** instead of SQLite for better concurrent access
2. **Add Redis** for session management and caching
3. **Set up monitoring** with Sentry or LogRocket
4. **Enable backups** for the database
5. **Add rate limiting** to prevent abuse
6. **Implement authentication** for admin features
7. **Use CDN** for static assets (e.g., Cloudflare)

---

## Need Help?

- Railway Docs: https://docs.railway.app/
- Render Docs: https://render.com/docs
- GitHub Issues: https://github.com/musahaseeb2012/Auto-show-booking-system/issues
