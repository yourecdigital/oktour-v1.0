# Nginx Infrastructure

This directory contains the Nginx configuration and setup scripts for the tour application.

## 📁 Directory Structure

```
infra/nginx/
├── nginx.conf                    # Main Nginx configuration
├── sites-available/
│   └── tour.conf                # Site-specific configuration
├── scripts/
│   ├── certbot-init.sh          # SSL certificate setup
│   └── security-setup.sh        # Security configuration
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. **Install Nginx**
```bash
sudo apt update
sudo apt install nginx
```

### 2. **Copy Configuration Files**
```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp sites-available/tour.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tour.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 3. **Setup SSL Certificates**
```bash
sudo chmod +x scripts/certbot-init.sh
sudo ./scripts/certbot-init.sh
```

### 4. **Configure Security**
```bash
sudo chmod +x scripts/security-setup.sh
sudo ./scripts/security-setup.sh
```

### 5. **Test and Reload**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## ⚙️ Configuration Details

### **nginx.conf**
- **HTTP/3 support** (commented out, requires nginx with HTTP/3)
- **Gzip and Brotli compression**
- **Caching zones** for proxy and fastcgi
- **Rate limiting** for different endpoints
- **Security headers** and SSL configuration
- **Performance optimizations**

### **sites-available/tour.conf**
- **Reverse proxy** to web:3000, api:5000, admin:3001
- **SSL termination** with Let's Encrypt
- **CORS headers** for API
- **Static asset caching**
- **Security headers**
- **Rate limiting** per endpoint

## 🔒 Security Features

### **UFW Firewall**
- Default deny incoming
- Allow HTTP (80), HTTPS (443)
- Allow application ports (3000, 3001, 5000)
- Rate limiting for SSH

### **Fail2ban**
- **SSH protection** (3 attempts, 1 hour ban)
- **Nginx protection** against:
  - HTTP auth attacks
  - Rate limit violations
  - Bot searches
  - SQL injection
  - XSS attacks
  - User enumeration
  - DOS attacks
  - Scanner attacks

### **Custom Filters**
- Nginx DOS detection
- Scanner detection
- User enumeration protection
- XSS protection
- SQL injection protection

## 📊 Monitoring

### **Security Status**
```bash
sudo /usr/local/bin/security-status.sh
```

### **Fail2ban Status**
```bash
sudo fail2ban-client status
```

### **UFW Status**
```bash
sudo ufw status verbose
```

### **Log Files**
- Nginx access: `/var/log/nginx/access.log`
- Nginx error: `/var/log/nginx/error.log`
- Fail2ban: `/var/log/fail2ban.log`
- UFW: `/var/log/ufw.log`
- Security monitor: `/var/log/security-monitor.log`

## 🔧 SSL Certificate Management

### **Initial Setup**
```bash
# Staging (test certificates)
sudo STAGING=true ./scripts/certbot-init.sh

# Production (real certificates)
sudo STAGING=false ./scripts/certbot-init.sh
```

### **Auto-Renewal**
Certificates are automatically renewed via cron job:
```bash
# Check renewal status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Nginx Configuration Test Fails**
   ```bash
   sudo nginx -t
   sudo nginx -T  # Show full configuration
   ```

2. **SSL Certificate Issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --force-renewal
   ```

3. **Fail2ban Not Working**
   ```bash
   sudo systemctl status fail2ban
   sudo fail2ban-client status
   sudo tail -f /var/log/fail2ban.log
   ```

4. **UFW Blocking Connections**
   ```bash
   sudo ufw status numbered
   sudo ufw delete [rule_number]
   ```

### **Debug Commands**

```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx configuration
sudo nginx -t

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check fail2ban jails
sudo fail2ban-client status [jail_name]

# Check UFW rules
sudo ufw status numbered

# Monitor logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/fail2ban.log
```

## 📈 Performance Tuning

### **Nginx Optimizations**
- Worker processes: `auto`
- Worker connections: `4096`
- Keepalive timeout: `65s`
- Gzip compression: `level 6`
- Brotli compression: `level 6`
- Proxy caching enabled
- Static asset caching: `1 year`

### **Security Optimizations**
- Rate limiting per endpoint
- Connection limiting per IP
- Security headers
- SSL/TLS optimization
- Fail2ban protection
- UFW firewall

## 🔄 Maintenance

### **Regular Tasks**
- Monitor security logs
- Check certificate expiration
- Update fail2ban rules
- Review UFW rules
- Monitor system resources

### **Automated Tasks**
- SSL certificate renewal
- Log rotation
- Security monitoring
- Fail2ban status checks

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Fail2ban Documentation](https://www.fail2ban.org/wiki/index.php/Main_Page)
- [UFW Documentation](https://help.ubuntu.com/community/UFW)

---

**⚠️ Important**: Always test configurations in a staging environment before applying to production.
