#!/bin/bash

# Certbot SSL Certificate Setup Script
# This script sets up Let's Encrypt SSL certificates for the tour application
# It starts with staging certificates first, then moves to production

set -e

# Configuration
DOMAIN="${DOMAIN:-tour.yourdomain.com}"
EMAIL="${EMAIL:-admin@yourdomain.com}"
STAGING="${STAGING:-true}"
NGINX_CONF="/etc/nginx/sites-available/tour.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/tour.conf"
CERTBOT_WEBROOT="/var/www/certbot"
NGINX_LOG="/var/log/nginx/error.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
        exit 1
    fi
}

# Install required packages
install_packages() {
    log "Installing required packages..."
    
    apt-get update
    apt-get install -y \
        nginx \
        certbot \
        python3-certbot-nginx \
        curl \
        wget \
        unzip \
        software-properties-common
    
    log "Packages installed successfully"
}

# Create webroot directory
create_webroot() {
    log "Creating certbot webroot directory..."
    
    mkdir -p "$CERTBOT_WEBROOT"
    chown -R www-data:www-data "$CERTBOT_WEBROOT"
    chmod -R 755 "$CERTBOT_WEBROOT"
    
    log "Webroot directory created: $CERTBOT_WEBROOT"
}

# Create temporary nginx config for certificate generation
create_temp_nginx_config() {
    log "Creating temporary nginx configuration..."
    
    cat > /etc/nginx/sites-available/tour-temp.conf << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root $CERTBOT_WEBROOT;
        try_files \$uri =404;
    }
    
    # Temporary redirect for testing
    location / {
        return 200 "Temporary server for SSL certificate generation";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable temporary config
    ln -sf /etc/nginx/sites-available/tour-temp.conf /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    nginx -t
    
    # Reload nginx
    systemctl reload nginx
    
    log "Temporary nginx configuration created and enabled"
}

# Obtain SSL certificate
obtain_certificate() {
    log "Obtaining SSL certificate for $DOMAIN..."
    
    if [[ "$STAGING" == "true" ]]; then
        log "Using Let's Encrypt STAGING environment (test certificates)"
        CERTBOT_FLAGS="--staging"
    else
        log "Using Let's Encrypt PRODUCTION environment (real certificates)"
        CERTBOT_FLAGS=""
    fi
    
    # Obtain certificate
    certbot certonly \
        --webroot \
        --webroot-path="$CERTBOT_WEBROOT" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --domains "$DOMAIN,www.$DOMAIN" \
        $CERTBOT_FLAGS \
        --non-interactive \
        --verbose
    
    if [[ $? -eq 0 ]]; then
        log "SSL certificate obtained successfully"
    else
        error "Failed to obtain SSL certificate"
        exit 1
    fi
}

# Update nginx configuration with SSL
update_nginx_ssl() {
    log "Updating nginx configuration with SSL..."
    
    # Remove temporary config
    rm -f /etc/nginx/sites-enabled/tour-temp.conf
    
    # Update the main config with actual domain
    sed -i "s/tour\.yourdomain\.com/$DOMAIN/g" "$NGINX_CONF"
    
    # Enable the main config
    ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
    
    # Test nginx configuration
    nginx -t
    
    if [[ $? -eq 0 ]]; then
        log "Nginx configuration updated successfully"
    else
        error "Nginx configuration test failed"
        exit 1
    fi
}

# Setup certificate auto-renewal
setup_auto_renewal() {
    log "Setting up certificate auto-renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/certbot-renew.sh << 'EOF'
#!/bin/bash

# Certificate renewal script
/usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"

# Log renewal
echo "$(date): Certificate renewal check completed" >> /var/log/certbot-renewal.log
EOF
    
    chmod +x /usr/local/bin/certbot-renew.sh
    
    # Add to crontab (run twice daily)
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/certbot-renew.sh") | crontab -
    (crontab -l 2>/dev/null; echo "0 0 * * * /usr/local/bin/certbot-renew.sh") | crontab -
    
    log "Auto-renewal setup completed"
}

# Test SSL configuration
test_ssl() {
    log "Testing SSL configuration..."
    
    # Wait a moment for nginx to reload
    sleep 5
    
    # Test HTTP to HTTPS redirect
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN")
    if [[ "$HTTP_STATUS" == "301" ]]; then
        log "HTTP to HTTPS redirect working"
    else
        warn "HTTP to HTTPS redirect may not be working (status: $HTTP_STATUS)"
    fi
    
    # Test HTTPS
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
    if [[ "$HTTPS_STATUS" == "200" ]]; then
        log "HTTPS connection working"
    else
        warn "HTTPS connection may not be working (status: $HTTPS_STATUS)"
    fi
    
    # Test SSL certificate
    SSL_INFO=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates)
    if [[ $? -eq 0 ]]; then
        log "SSL certificate is valid"
        echo "$SSL_INFO"
    else
        warn "SSL certificate validation failed"
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    
    # Remove temporary nginx config if it exists
    rm -f /etc/nginx/sites-available/tour-temp.conf
    rm -f /etc/nginx/sites-enabled/tour-temp.conf
    
    # Reload nginx
    systemctl reload nginx
    
    log "Cleanup completed"
}

# Main execution
main() {
    log "Starting SSL certificate setup for $DOMAIN"
    log "Email: $EMAIL"
    log "Staging mode: $STAGING"
    
    # Check prerequisites
    check_root
    
    # Install packages
    install_packages
    
    # Create webroot
    create_webroot
    
    # Create temporary nginx config
    create_temp_nginx_config
    
    # Obtain certificate
    obtain_certificate
    
    # Update nginx with SSL
    update_nginx_ssl
    
    # Setup auto-renewal
    setup_auto_renewal
    
    # Test configuration
    test_ssl
    
    # Cleanup
    cleanup
    
    log "SSL certificate setup completed successfully!"
    
    if [[ "$STAGING" == "true" ]]; then
        warn "STAGING certificates were generated. To get production certificates, run:"
        warn "STAGING=false $0"
    else
        log "Production SSL certificates are now active for $DOMAIN"
    fi
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@"
