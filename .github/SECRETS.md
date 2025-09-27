# GitHub Secrets Configuration

This document outlines all the required secrets for the GitHub Actions workflows.

## Required Secrets

### 🔑 **SSH_KEY** (Required)
- **Description**: Private SSH key for server access
- **Format**: OpenSSH private key
- **How to generate**:
  ```bash
  ssh-keygen -t ed25519 -C "github-actions@yourdomain.com"
  # Copy the private key content to GitHub Secrets
  ```

### 🌐 **SERVER_IP** (Required)
- **Description**: IP address of your Ubuntu 22.04 server
- **Format**: IPv4 address (e.g., `192.168.1.100`)
- **Example**: `203.0.113.1`

### 🏠 **DOMAIN** (Required)
- **Description**: Your domain name for the application
- **Format**: Domain name without protocol
- **Example**: `tour.yourdomain.com`

## Optional Secrets (with defaults)

### 🗄️ **Database Secrets**
- **DB_HOST**: Database host (default: `localhost`)
- **DB_PORT**: Database port (default: `3306`)
- **DB_NAME**: Database name (default: `tour_db`)
- **DB_USER**: Database user (default: `tour_user`)
- **DB_PASSWORD**: Database password (required)
- **DB_ROOT_PASSWORD**: Database root password (required)

### 🔐 **Authentication Secrets**
- **JWT_SECRET**: JWT signing secret (required)
- **SSH_USER**: SSH username (default: `ubuntu`)
- **SSH_PORT**: SSH port (default: `22`)

### 📦 **MinIO Secrets**
- **MINIO_ROOT_USER**: MinIO admin user (default: `minioadmin`)
- **MINIO_ROOT_PASSWORD**: MinIO admin password (required)
- **MINIO_BUCKET**: MinIO bucket name (default: `tour-media`)

### ☁️ **AWS S3 Backup Secrets**
- **AWS_ACCESS_KEY_ID**: AWS access key for S3 backups
- **AWS_SECRET_ACCESS_KEY**: AWS secret key for S3 backups
- **AWS_REGION**: AWS region (default: `us-east-1`)
- **S3_BACKUP_BUCKET**: S3 bucket for backups

### 📧 **Email (Optional)**
- **EMAIL**: Email for Let's Encrypt SSL certificates

### 🔒 **Security (Optional)**
- **SNYK_TOKEN**: Snyk security scanning token
- **SLACK_WEBHOOK_URL**: Slack webhook for notifications

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

## Security Best Practices

### 🔐 **SSH Key Security**
- Use a dedicated SSH key for GitHub Actions
- Never commit private keys to the repository
- Use ed25519 keys for better security
- Regularly rotate SSH keys

### 🗄️ **Database Security**
- Use strong, unique passwords
- Enable SSL connections
- Restrict database access to specific IPs
- Regular security updates

### ☁️ **AWS Security**
- Use IAM roles with minimal permissions
- Enable MFA on AWS accounts
- Use separate AWS accounts for different environments
- Monitor access logs

### 🔒 **General Security**
- Regularly rotate all secrets
- Use environment-specific secrets
- Monitor secret usage
- Enable audit logging

## Environment-Specific Secrets

### 🏭 **Production**
- Use strong, unique passwords
- Enable all security features
- Use dedicated servers
- Monitor all activities

### 🧪 **Staging**
- Use separate secrets from production
- Use weaker passwords for testing
- Use shared resources
- Enable debugging

## Troubleshooting

### ❌ **Common Issues**

1. **SSH Connection Failed**
   - Check SSH key format
   - Verify server IP and port
   - Ensure SSH service is running
   - Check firewall settings

2. **Database Connection Failed**
   - Verify database credentials
   - Check database server status
   - Ensure network connectivity
   - Check database permissions

3. **S3 Backup Failed**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket exists
   - Check AWS region

4. **SSL Certificate Failed**
   - Verify domain ownership
   - Check DNS settings
   - Ensure port 80/443 is open
   - Check Let's Encrypt rate limits

### 🔧 **Debug Commands**

```bash
# Test SSH connection
ssh -i ~/.ssh/id_ed25519 ubuntu@YOUR_SERVER_IP

# Test database connection
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p

# Test S3 access
aws s3 ls s3://YOUR_BUCKET_NAME

# Test MinIO connection
mc alias set minio http://YOUR_MINIO_ENDPOINT YOUR_USER YOUR_PASSWORD
mc ls minio
```

## Support

For issues with secrets configuration:
1. Check the GitHub Actions logs
2. Verify secret names match exactly
3. Test connections manually
4. Check server logs
5. Contact system administrator

---

**⚠️ Important**: Never share or commit secrets to version control. Always use GitHub Secrets for sensitive information.
