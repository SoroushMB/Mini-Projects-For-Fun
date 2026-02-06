# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- MongoDB Atlas account (free tier available)
- Node.js hosting (Heroku, Railway, Render, DigitalOcean)
- OpenRouter API key

## Option 1: Deploy to Heroku

### Backend Deployment

1. **Create Heroku App**
```bash
cd backend
heroku login
heroku create your-app-name-api
```

2. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_production_secret"
heroku config:set OPENROUTER_API_KEY="your_api_key"
heroku config:set NODE_ENV="production"
```

3. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name-api
git push heroku main
```

### Frontend Deployment

1. **Update API URL**
```bash
cd frontend
# Update .env
VITE_API_URL=https://your-app-name-api.herokuapp.com/api
```

2. **Deploy to Vercel/Netlify**

**Vercel:**
```bash
npm install -g vercel
vercel login
vercel
```

**Netlify:**
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

## Option 2: Deploy to Railway

### Backend

1. **Create Railway Project**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

2. **Add MongoDB**
   - Click "New"
   - Select "MongoDB"
   - Copy connection string

3. **Set Environment Variables**
   - Go to Variables tab
   - Add all environment variables

4. **Deploy**
   - Railway auto-deploys on git push

### Frontend

1. **Deploy to Railway**
   - Add new service
   - Select repository
   - Set build command: `npm run build`
   - Set start command: `npm run preview`

## Option 3: Deploy to Render

### Backend

1. **Create Web Service**
   - Go to render.com
   - Click "New Web Service"
   - Connect repository
   - Select branch

2. **Configure Service**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

3. **Deploy**
   - Click "Create Web Service"

### Frontend

1. **Create Static Site**
   - Click "New Static Site"
   - Connect repository
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## Option 4: Self-Hosted (VPS)

### Requirements
- Ubuntu 20.04+ server
- Domain name (optional)
- Nginx
- PM2

### Setup

1. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Deploy Backend**
```bash
# Clone repository
git clone your-repo-url
cd teacher-cms-mern/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add production variables

# Start with PM2
pm2 start server.js --name teacher-cms-api
pm2 save
pm2 startup
```

3. **Deploy Frontend**
```bash
cd ../frontend
npm install
npm run build

# Copy build to nginx
sudo cp -r dist /var/www/teacher-cms
```

4. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/teacher-cms
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/teacher-cms;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/teacher-cms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to mongodb.com/atlas
   - Sign up/Login
   - Create free cluster
   - Choose provider and region

2. **Create Database User**
   - Database Access → Add New User
   - Username and password
   - Grant read/write access

3. **Whitelist IP**
   - Network Access → Add IP Address
   - Add current IP or 0.0.0.0/0 (all IPs)

4. **Get Connection String**
   - Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your password

## Environment Variables Checklist

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/teacher_cms
JWT_SECRET=your_very_secure_random_string_here
OPENROUTER_API_KEY=sk-or-v1-your-api-key
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Security Checklist

- [ ] Use strong JWT secret (32+ random characters)
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IPs
- [ ] Use HTTPS (SSL certificate)
- [ ] Set secure CORS origins
- [ ] Limit file upload sizes
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## Performance Optimization

1. **Backend**
   - Enable gzip compression
   - Use connection pooling
   - Add database indexes
   - Cache frequently accessed data
   - Use CDN for static files

2. **Frontend**
   - Minify and bundle code
   - Enable code splitting
   - Optimize images
   - Use lazy loading
   - Enable browser caching

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs teacher-cms-api
```

### Setup PM2 Plus (optional)
```bash
pm2 plus
# Follow instructions for monitoring dashboard
```

### Log Management
```bash
# View logs
pm2 logs

# Rotate logs
pm2 install pm2-logrotate
```

## Backup Strategy

### Database Backup
```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongodb_uri" --out=/backups/db_backup_$TIMESTAMP
EOF

chmod +x backup-db.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup-db.sh
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

## Rollback Plan

1. **Keep previous version**
```bash
pm2 save
cp -r current-version previous-version
```

2. **Rollback if needed**
```bash
pm2 stop teacher-cms-api
cd previous-version
pm2 start server.js --name teacher-cms-api
```

## Testing Production

1. **Health Check Endpoint**
```bash
curl https://your-api-domain.com/
```

2. **Test Authentication**
```bash
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

3. **Monitor Logs**
```bash
pm2 logs teacher-cms-api --lines 100
```

## Common Issues

### MongoDB Connection Failed
- Check connection string
- Verify IP whitelist
- Check user credentials

### CORS Errors
- Update CORS configuration in server.js
- Add frontend domain to allowed origins

### 502 Bad Gateway
- Check if backend is running: `pm2 status`
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Certificate Issues
- Renew certificate: `sudo certbot renew`
- Check certificate: `sudo certbot certificates`

## Maintenance

### Update Dependencies
```bash
npm outdated
npm update
```

### Monitor Security
```bash
npm audit
npm audit fix
```

### Database Maintenance
```bash
# Compact database
mongosh
use teacher_cms
db.runCommand({ compact: 'collection_name' })
```

## Support

For deployment issues:
- Check logs: `pm2 logs`
- Check nginx: `sudo nginx -t`
- Check MongoDB: `sudo systemctl status mongod`
- Review error messages
- Check environment variables

---

**Deployment Status**: Ready for Production
**Estimated Deploy Time**: 30-60 minutes
