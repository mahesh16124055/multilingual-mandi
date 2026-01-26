# 🌐 Netlify + Render Deployment Guide

## 🎯 **Deployment Architecture**
- **Frontend**: Netlify (Static hosting with serverless functions)
- **Backend**: Render (Node.js hosting)
- **Database**: Supabase (PostgreSQL)

---

## 🚀 **Step 1: Deploy Backend to Render**

### **1.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### **1.2 Deploy Backend Service**
1. **New Web Service**: Click "New" → "Web Service"
2. **Connect Repository**: Select `multilingual-mandi`
3. **Configure Service**:
   - **Name**: `multilingual-mandi-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (for testing) or Starter ($7/month)

### **1.3 Set Environment Variables in Render**
In Render dashboard, go to Environment and add:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
CLIENT_URL=https://your-netlify-site.netlify.app
JWT_SECRET=your_super_secure_jwt_secret_key_here
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

### **1.4 Get Backend URL**
After deployment, copy your Render URL (e.g., `https://multilingual-mandi-backend.onrender.com`)

---

## 🌐 **Step 2: Deploy Frontend to Netlify**

### **2.1 Create Netlify Account**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Connect your GitHub account

### **2.2 Deploy Site**
1. **New Site**: Click "New site from Git"
2. **Choose Repository**: Select `multilingual-mandi`
3. **Configure Build**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/.next`
   - **Node version**: 18

### **2.3 Set Environment Variables in Netlify**
In Netlify dashboard, go to Site settings → Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=https://multilingual-mandi-backend.onrender.com
NEXT_PUBLIC_APP_ENV=production
```

### **2.4 Update Backend CORS**
Update your Render backend environment variables:
```env
CLIENT_URL=https://your-actual-netlify-url.netlify.app
CORS_ORIGIN=https://your-actual-netlify-url.netlify.app
```

---

## 🗄️ **Step 3: Set Up Supabase Database**

### **3.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region (closest to your users)
4. Set strong password

### **3.2 Run Database Schema**
1. Go to SQL Editor in Supabase
2. Copy content from `database/schema.sql`
3. Execute the SQL

### **3.3 Get Supabase Credentials**
1. Go to Settings → API
2. Copy:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

---

## 🔧 **Step 4: Configure Custom Domain (Optional)**

### **4.1 Buy Domain**
- Namecheap, GoDaddy, or Google Domains (~$12/year)

### **4.2 Configure Netlify Domain**
1. Netlify Dashboard → Domain settings
2. Add custom domain
3. Update DNS records at your domain provider

### **4.3 Configure Render Domain**
1. Render Dashboard → Settings → Custom Domains
2. Add subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

---

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Build Fails on Netlify**
```bash
# Check Node version
Node version: 18
Build command: npm run build
Base directory: client
```

**2. CORS Errors**
- Ensure CLIENT_URL in Render matches your Netlify URL exactly
- Include both HTTP and HTTPS versions if needed

**3. Environment Variables Not Loading**
- Check spelling and case sensitivity
- Restart deployments after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

**4. Socket.io Connection Issues**
- Ensure WebSocket support is enabled
- Check firewall settings
- Verify backend URL is correct

### **Performance Optimization**

**1. Enable Netlify Features**
- Asset optimization
- Form handling
- Edge functions

**2. Render Optimization**
- Use Starter plan for better performance
- Enable health checks
- Set up monitoring

---

## 💰 **Pricing**

### **Free Tier (Good for Testing)**
- **Netlify**: Free (100GB bandwidth, 300 build minutes)
- **Render**: Free (512MB RAM, sleeps after 15min inactivity)
- **Supabase**: Free (500MB database, 50MB storage)
- **Total**: $0/month

### **Production Tier (Recommended)**
- **Netlify Pro**: $19/month (1TB bandwidth, 25,000 build minutes)
- **Render Starter**: $7/month (512MB RAM, always on)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Total**: $51/month

---

## ✅ **Deployment Checklist**

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Supabase database created and schema imported
- [ ] All environment variables configured
- [ ] CORS settings updated
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] All features tested in production

---

## 🎉 **Success!**

Your Multilingual Mandi will be live at:
- **Frontend**: `https://your-site.netlify.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: Supabase cloud

**Ready to transform Indian agriculture! 🇮🇳🌾**