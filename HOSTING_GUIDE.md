# 🌐 Multilingual Mandi - Complete Hosting Guide

## 🎯 **Hosting Requirements Overview**

Your Multilingual Mandi application needs:
- **Frontend Hosting**: Next.js React application (Static + SSR)
- **Backend Hosting**: Node.js Express server with Socket.io
- **Database**: PostgreSQL (via Supabase)
- **External APIs**: Hugging Face for translations
- **Domain**: Custom domain (optional but recommended)

---

## 🚀 **Quick Start Options (Recommended)**

### **Option 1: Vercel + Railway (Easiest)**
**Best for**: Beginners, quick deployment, automatic scaling
**Cost**: Free tier available, ~$5-20/month for production
**Time**: 15-30 minutes

### **Option 2: Netlify + Render (Alternative)**
**Best for**: Similar to Vercel, good free tiers
**Cost**: Free tier available, ~$7-25/month for production
**Time**: 20-40 minutes

### **Option 3: AWS/Google Cloud (Advanced)**
**Best for**: Enterprise, custom requirements, full control
**Cost**: ~$10-50/month depending on usage
**Time**: 1-3 hours

---

## 🎯 **Option 1: Vercel + Railway (RECOMMENDED)**

### **Step 1: Prepare Your Code**

1. **Create GitHub Repository**:
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit - Multilingual Mandi"
   
   # Create repository on GitHub and push
   git remote add origin https://github.com/yourusername/multilingual-mandi.git
   git push -u origin main
   ```

2. **Update Environment Files**:
   
   **Create `client/.env.production`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_APP_ENV=production
   ```

### **Step 2: Deploy Backend to Railway**

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your multilingual-mandi repository
4. **Configure Service**:
   - **Root Directory**: `/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_key
   HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
   CLIENT_URL=https://your-frontend-url.vercel.app
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   ```
6. **Deploy**: Railway will automatically deploy
7. **Get URL**: Copy your Railway app URL (e.g., `https://multilingual-mandi-production.up.railway.app`)

### **Step 3: Deploy Frontend to Vercel**

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Import Project**: Click "New Project" → Import your GitHub repository
3. **Configure Build**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. **Set Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SOCKET_URL=https://your-railway-backend-url.railway.app
   NEXT_PUBLIC_APP_ENV=production
   ```
5. **Deploy**: Vercel will build and deploy automatically
6. **Get URL**: Your app will be live at `https://your-app.vercel.app`

### **Step 4: Update CORS Settings**

Update your Railway backend environment to include your Vercel URL:
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## 🎯 **Option 2: Netlify + Render**

### **Deploy Backend to Render**

1. **Sign up**: [render.com](https://render.com)
2. **New Web Service**: Connect GitHub repository
3. **Configure**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**: Same as Railway above
5. **Deploy**: Automatic deployment

### **Deploy Frontend to Netlify**

1. **Sign up**: [netlify.com](https://netlify.com)
2. **New Site**: Connect GitHub repository
3. **Build Settings**:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/.next`
4. **Environment Variables**: Same as Vercel above
5. **Deploy**: Automatic deployment

---

## 🎯 **Option 3: AWS (Advanced)**

### **Frontend: AWS Amplify**

1. **Install AWS CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   aws configure
   ```

2. **Initialize Amplify**:
   ```bash
   cd client
   amplify init
   amplify add hosting
   amplify publish
   ```

### **Backend: AWS Elastic Beanstalk**

1. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize and Deploy**:
   ```bash
   cd server
   eb init
   eb create production
   eb deploy
   ```

---

## 🗄️ **Database Setup (Required for All Options)**

### **Supabase (Recommended - Free)**

1. **Create Account**: Go to [supabase.com](https://supabase.com)
2. **New Project**: Create a new project
3. **Run Schema**: 
   - Go to SQL Editor
   - Copy contents from `database/schema.sql`
   - Execute the SQL
4. **Get Credentials**:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: From Settings → API
   - **Service Key**: From Settings → API (keep secret!)

### **Alternative: PlanetScale (MySQL)**

1. **Create Account**: [planetscale.com](https://planetscale.com)
2. **Create Database**: New database
3. **Convert Schema**: Convert PostgreSQL schema to MySQL
4. **Get Connection String**

---

## 🌐 **Custom Domain Setup (Optional)**

### **Buy Domain**
- **Namecheap**: ~$10-15/year
- **GoDaddy**: ~$12-20/year
- **Google Domains**: ~$12/year

### **Configure DNS**

**For Vercel**:
1. Go to Vercel Dashboard → Domains
2. Add your domain
3. Update DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

**For Railway**:
1. Go to Railway Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: api (for backend)
   Value: your-app.railway.app
   ```

---

## 💰 **Hosting Costs Breakdown**

### **Free Tier (Good for Demo/Testing)**
- **Vercel**: Free (100GB bandwidth, 1000 serverless functions)
- **Railway**: $5/month (512MB RAM, 1GB disk)
- **Supabase**: Free (500MB database, 50MB file storage)
- **Domain**: ~$12/year
- **Total**: ~$60/year + $5/month = ~$120/year

### **Production Tier (Recommended)**
- **Vercel Pro**: $20/month (1TB bandwidth, unlimited functions)
- **Railway Pro**: $20/month (8GB RAM, 100GB disk)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Domain**: ~$12/year
- **Total**: ~$65/month = ~$780/year

### **Enterprise Tier**
- **AWS/Google Cloud**: $50-200/month depending on traffic
- **Custom domain + SSL**: Included
- **Total**: $600-2400/year

---

## 🔧 **Environment Variables Checklist**

### **Frontend Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_ENV=production
```

### **Backend Environment Variables**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
CLIENT_URL=https://your-frontend.vercel.app
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## 🚀 **Deployment Automation**

### **GitHub Actions (Auto-Deploy)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Multilingual Mandi

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and test client
        run: |
          cd client
          npm ci
          npm test
      
      - name: Install and test server
        run: |
          cd server
          npm ci
          npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.2.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

---

## 🔒 **Security & Performance**

### **SSL/HTTPS**
- **Vercel**: Automatic SSL certificates
- **Railway**: Automatic SSL certificates
- **Custom Domain**: Free Let's Encrypt certificates

### **Performance Optimization**
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

### **Rate Limiting**
```javascript
// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

module.exports = limiter
```

---

## 📊 **Monitoring & Analytics**

### **Error Tracking**
```bash
npm install @sentry/nextjs @sentry/node
```

### **Analytics**
```javascript
// Google Analytics 4
// pages/_app.js
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

---

## 🚨 **Troubleshooting Common Issues**

### **CORS Errors**
```javascript
// server/index.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}
app.use(cors(corsOptions))
```

### **Environment Variables Not Loading**
- Check spelling and case sensitivity
- Restart deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### **Socket.io Connection Issues**
```javascript
// client/utils/socket.js
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ['websocket', 'polling'],
  upgrade: true,
  rememberUpgrade: true
})
```

---

## ✅ **Pre-Deployment Checklist**

- [ ] GitHub repository created and code pushed
- [ ] Supabase database created and schema imported
- [ ] Environment variables prepared for both frontend and backend
- [ ] Hugging Face API key working
- [ ] All tests passing locally
- [ ] CORS origins configured correctly
- [ ] Domain purchased (if using custom domain)
- [ ] SSL certificates configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured (Google Analytics)

---

## 🎯 **Recommended Deployment Path**

### **For Demo/MVP (Free)**
1. **Supabase** (Database) - Free tier
2. **Railway** (Backend) - $5/month
3. **Vercel** (Frontend) - Free tier
4. **Total Cost**: $5/month

### **For Production (Recommended)**
1. **Supabase Pro** (Database) - $25/month
2. **Railway Pro** (Backend) - $20/month  
3. **Vercel Pro** (Frontend) - $20/month
4. **Custom Domain** - $12/year
5. **Total Cost**: $65/month + $12/year

### **For Enterprise**
1. **AWS RDS** (Database) - $50-100/month
2. **AWS ECS/Lambda** (Backend) - $30-80/month
3. **AWS CloudFront + S3** (Frontend) - $20-50/month
4. **Route 53 + Certificate Manager** - $1-5/month
5. **Total Cost**: $100-235/month

---

## 🚀 **Next Steps**

1. **Choose your hosting option** (Recommended: Vercel + Railway)
2. **Set up Supabase database**
3. **Deploy backend first** (Railway/Render)
4. **Deploy frontend** (Vercel/Netlify)
5. **Configure custom domain** (optional)
6. **Set up monitoring** (Sentry, Analytics)
7. **Test everything thoroughly**
8. **Go live!** 🎉

**Your Multilingual Mandi will be live and accessible worldwide! 🌍🇮🇳**