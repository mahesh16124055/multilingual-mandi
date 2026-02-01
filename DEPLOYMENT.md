# Deployment Guide - Multilingual Mandi

This guide covers various deployment options for the Multilingual Mandi application.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended for Frontend)

**Prerequisites:**
- GitHub account
- Vercel account
- Supabase project

**Steps:**
1. Fork/clone the repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

**Environment Variables for Vercel:**
> [!IMPORTANT]
> Since `.env` files are not committed to Git for security, you MUST manually add these variables in your Vercel project settings.
> Go to: **Settings** > **Environment Variables**

Add the following keys:
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Backend Configuration
NEXT_PUBLIC_SOCKET_URL=your_backend_url

# AI Service Keys (Server-side only)
HUGGINGFACE_API_KEY=your_hf_key
GEMINI_API_KEY=your_gemini_key
```

### 2. Railway (Full-Stack)

**Steps:**
1. Connect GitHub repository to Railway
2. Create two services: frontend and backend
3. Set environment variables
4. Deploy with automatic builds

### 3. AWS Amplify

**Prerequisites:**
- AWS account
- AWS CLI configured

**Steps:**
1. Install Amplify CLI: `npm install -g @aws-amplify/cli`
2. Initialize: `amplify init`
3. Add hosting: `amplify add hosting`
4. Deploy: `amplify publish`

## 🐳 Docker Deployment

### Local Docker Setup

1. **Clone repository:**
```bash
git clone <repository-url>
cd multilingual-mandi
```

2. **Create environment files:**
```bash
cp client/.env.local.example client/.env.local
cp server/.env.example server/.env
```

3. **Update environment variables in both files**

4. **Build and run:**
```bash
docker-compose up --build
```

### Production Docker

1. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy with SSL:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Deployment

### Google Cloud Platform

1. **Enable required APIs:**
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

2. **Deploy frontend:**
```bash
cd client
gcloud run deploy multilingual-mandi-client \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. **Deploy backend:**
```bash
cd server
gcloud run deploy multilingual-mandi-server \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Container Instances

1. **Create resource group:**
```bash
az group create --name multilingual-mandi --location eastus
```

2. **Deploy containers:**
```bash
az container create \
  --resource-group multilingual-mandi \
  --name mandi-app \
  --image your-registry/multilingual-mandi:latest \
  --dns-name-label multilingual-mandi \
  --ports 80
```

### DigitalOcean App Platform

1. **Create app spec file (app.yaml):**
```yaml
name: multilingual-mandi
services:
- name: client
  source_dir: /client
  github:
    repo: your-username/multilingual-mandi
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  
- name: server
  source_dir: /server
  github:
    repo: your-username/multilingual-mandi
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

2. **Deploy:**
```bash
doctl apps create --spec app.yaml
```

## 🗄️ Database Setup

### Supabase (Recommended)

1. **Create new project at supabase.com**
2. **Run SQL schema:**
   - Copy contents of `database/schema.sql`
   - Paste in Supabase SQL editor
   - Execute

3. **Configure RLS policies**
4. **Get connection details**

### Self-hosted PostgreSQL

1. **Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

2. **Create database:**
```sql
CREATE DATABASE multilingual_mandi;
CREATE USER mandi_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE multilingual_mandi TO mandi_user;
```

3. **Run migrations:**
```bash
psql -U mandi_user -d multilingual_mandi -f database/schema.sql
```

## 🔧 Environment Configuration

### Production Environment Variables

**Client (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_ENV=production
```

**Server (.env):**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
HUGGINGFACE_API_KEY=your_hf_key
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your_jwt_secret
```

## 🔒 Security Considerations

### SSL/TLS Setup

1. **Let's Encrypt (Free):**
```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com
```

2. **Cloudflare (Recommended):**
   - Add domain to Cloudflare
   - Enable SSL/TLS encryption
   - Set security level to "Medium" or higher

### Environment Security

1. **Use secrets management:**
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager

2. **Enable CORS properly:**
```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}
```

3. **Rate limiting:**
```javascript
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

## 📊 Monitoring & Analytics

### Application Monitoring

1. **Sentry for error tracking:**
```bash
npm install @sentry/nextjs @sentry/node
```

2. **Configure Sentry:**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### Performance Monitoring

1. **Vercel Analytics (if using Vercel)**
2. **Google Analytics:**
```javascript
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

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci
          
      - name: Run tests
        run: |
          cd client && npm test
          cd ../server && npm test
          
      - name: Build application
        run: |
          cd client && npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS errors:**
   - Check CLIENT_URL in server environment
   - Verify CORS configuration

2. **Database connection issues:**
   - Verify Supabase URL and keys
   - Check RLS policies

3. **Translation not working:**
   - Verify Hugging Face API key
   - Check network connectivity

4. **Socket.io connection fails:**
   - Ensure WebSocket support
   - Check firewall settings

### Performance Optimization

1. **Enable caching:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate'
          }
        ]
      }
    ]
  }
}
```

2. **Optimize images:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load balancer setup**
2. **Multiple server instances**
3. **Database read replicas**
4. **CDN for static assets**

### Vertical Scaling

1. **Increase server resources**
2. **Database performance tuning**
3. **Redis caching layer**

---

For additional support, please refer to the main README.md or create an issue in the repository.