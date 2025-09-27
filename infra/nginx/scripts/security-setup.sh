#!/bin/bash

# Security Setup Script for Nginx
# This script sets up fail2ban and UFW firewall for the tour application
# Designed to work without Docker containers

set -e

# Configuration
NGINX_LOG="/var/log/nginx/access.log"
NGINX_ERROR_LOG="/var/log/nginx/error.log"
FAIL2BAN_LOG="/var/log/fail2ban.log"
UFW_LOG="/var/log/ufw.log"

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
    log "Installing security packages..."
    
    apt-get update
    apt-get install -y \
        fail2ban \
        ufw \
        iptables-persistent \
        logrotate \
        rsyslog \
        htop \
        netstat-nat \
        tcpdump \
        nmap \
        whois
    
    log "Security packages installed successfully"
}

# Configure UFW firewall
setup_ufw() {
    log "Configuring UFW firewall..."
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (be careful with this!)
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Allow specific ports for the application
    ufw allow 3000/tcp comment 'Web App'
    ufw allow 3001/tcp comment 'Admin App'
    ufw allow 5000/tcp comment 'API'
    ufw allow 3306/tcp comment 'MariaDB'
    ufw allow 6379/tcp comment 'Redis'
    ufw allow 9000/tcp comment 'MinIO'
    ufw allow 9001/tcp comment 'MinIO Console'
    
    # Rate limiting for SSH
    ufw limit 22/tcp comment 'SSH rate limit'
    
    # Enable UFW
    ufw --force enable
    
    # Show status
    ufw status verbose
    
    log "UFW firewall configured and enabled"
}

# Configure fail2ban
setup_fail2ban() {
    log "Configuring fail2ban..."
    
    # Create fail2ban configuration
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# Default settings
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd
usedns = warn
logencoding = auto
enabled = false
filter = %(__name__)s
destemail = root@localhost
sender = root@localhost
mta = sendmail
protocol = tcp
chain = <known/chain>
port = 0:65535
fail2ban_agent = Fail2Ban/%(fail2ban_version)s

# Ignore local IPs
ignoreip = 127.0.0.1/8 ::1 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16

# Email notifications
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3
bantime = 3600
findtime = 600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
findtime = 600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600
findtime = 600

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-noscript]
enabled = true
filter = nginx-noscript
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6
bantime = 86400
findtime = 600

[nginx-badbots]
enabled = true
filter = nginx-badbots
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-noproxy]
enabled = true
filter = nginx-noproxy
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-nohome]
enabled = true
filter = nginx-nohome
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-nophp]
enabled = true
filter = nginx-nophp
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-nosql]
enabled = true
filter = nginx-nosql
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-phpmyadmin]
enabled = true
filter = nginx-phpmyadmin
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-sql]
enabled = true
filter = nginx-sql
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-xss]
enabled = true
filter = nginx-xss
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-userenum]
enabled = true
filter = nginx-userenum
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
findtime = 600

[nginx-dos]
enabled = true
filter = nginx-dos
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 50
bantime = 600
findtime = 60

[nginx-scanner]
enabled = true
filter = nginx-scanner
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 10
bantime = 3600
findtime = 600
EOF

    # Create custom filters
    create_fail2ban_filters
    
    # Start and enable fail2ban
    systemctl enable fail2ban
    systemctl start fail2ban
    
    # Show status
    fail2ban-client status
    
    log "Fail2ban configured and started"
}

# Create custom fail2ban filters
create_fail2ban_filters() {
    log "Creating custom fail2ban filters..."
    
    # Nginx DOS filter
    cat > /etc/fail2ban/filter.d/nginx-dos.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*"(GET|POST).*HTTP.*" (200|301|302) .*$
ignoreregex =
EOF

    # Nginx scanner filter
    cat > /etc/fail2ban/filter.d/nginx-scanner.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*"(GET|POST).*\.(php|asp|aspx|jsp).*HTTP.*" (404|403) .*$
ignoreregex =
EOF

    # Nginx user enumeration filter
    cat > /etc/fail2ban/filter.d/nginx-userenum.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*"(GET|POST).*wp-admin.*HTTP.*" (404|403) .*$
            ^<HOST> -.*"(GET|POST).*admin.*HTTP.*" (404|403) .*$
            ^<HOST> -.*"(GET|POST).*login.*HTTP.*" (404|403) .*$
ignoreregex =
EOF

    # Nginx XSS filter
    cat > /etc/fail2ban/filter.d/nginx-xss.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*"(GET|POST).*<script.*HTTP.*" (200|404) .*$
            ^<HOST> -.*"(GET|POST).*javascript:.*HTTP.*" (200|404) .*$
ignoreregex =
EOF

    # Nginx SQL injection filter
    cat > /etc/fail2ban/filter.d/nginx-sql.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*"(GET|POST).*union.*select.*HTTP.*" (200|404) .*$
            ^<HOST> -.*"(GET|POST).*drop.*table.*HTTP.*" (200|404) .*$
            ^<HOST> -.*"(GET|POST).*insert.*into.*HTTP.*" (200|404) .*$
ignoreregex =
EOF

    log "Custom fail2ban filters created"
}

# Configure log rotation
setup_log_rotation() {
    log "Configuring log rotation..."
    
    # Nginx log rotation
    cat > /etc/logrotate.d/nginx << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
EOF

    # Fail2ban log rotation
    cat > /etc/logrotate.d/fail2ban << 'EOF'
/var/log/fail2ban.log {
    weekly
    missingok
    rotate 4
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        /usr/bin/fail2ban-client reload > /dev/null 2>&1 || true
    endscript
}
EOF

    # UFW log rotation
    cat > /etc/logrotate.d/ufw << 'EOF'
/var/log/ufw.log {
    weekly
    missingok
    rotate 4
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

    log "Log rotation configured"
}

# Configure system monitoring
setup_monitoring() {
    log "Setting up system monitoring..."
    
    # Create monitoring script
    cat > /usr/local/bin/security-monitor.sh << 'EOF'
#!/bin/bash

# Security monitoring script
LOG_FILE="/var/log/security-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check fail2ban status
if ! systemctl is-active --quiet fail2ban; then
    echo "$DATE: WARNING - Fail2ban is not running" >> $LOG_FILE
fi

# Check UFW status
if ! ufw status | grep -q "Status: active"; then
    echo "$DATE: WARNING - UFW is not active" >> $LOG_FILE
fi

# Check for suspicious activity
SUSPICIOUS_IPS=$(fail2ban-client status | grep "Banned IP list" | wc -l)
if [ $SUSPICIOUS_IPS -gt 10 ]; then
    echo "$DATE: WARNING - High number of banned IPs: $SUSPICIOUS_IPS" >> $LOG_FILE
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$DATE: WARNING - High disk usage: $DISK_USAGE%" >> $LOG_FILE
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "$DATE: WARNING - High memory usage: $MEMORY_USAGE%" >> $LOG_FILE
fi
EOF

    chmod +x /usr/local/bin/security-monitor.sh
    
    # Add to crontab (run every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/security-monitor.sh") | crontab -
    
    log "System monitoring configured"
}

# Create security status script
create_status_script() {
    log "Creating security status script..."
    
    cat > /usr/local/bin/security-status.sh << 'EOF'
#!/bin/bash

# Security status script
echo "=== Security Status Report ==="
echo "Date: $(date)"
echo

echo "=== UFW Firewall Status ==="
ufw status verbose
echo

echo "=== Fail2ban Status ==="
fail2ban-client status
echo

echo "=== Active Connections ==="
netstat -tuln | grep LISTEN
echo

echo "=== Recent Security Events ==="
tail -20 /var/log/fail2ban.log
echo

echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo
echo "Disk Usage:"
df -h
echo

echo "=== Nginx Status ==="
systemctl status nginx --no-pager -l
EOF

    chmod +x /usr/local/bin/security-status.sh
    
    log "Security status script created"
}

# Test security configuration
test_security() {
    log "Testing security configuration..."
    
    # Test UFW
    if ufw status | grep -q "Status: active"; then
        log "UFW firewall is active"
    else
        warn "UFW firewall is not active"
    fi
    
    # Test fail2ban
    if systemctl is-active --quiet fail2ban; then
        log "Fail2ban is running"
    else
        warn "Fail2ban is not running"
    fi
    
    # Test nginx
    if systemctl is-active --quiet nginx; then
        log "Nginx is running"
    else
        warn "Nginx is not running"
    fi
    
    # Show current bans
    BANNED_IPS=$(fail2ban-client status | grep "Banned IP list" | wc -l)
    log "Currently banned IPs: $BANNED_IPS"
}

# Main execution
main() {
    log "Starting security setup for Nginx"
    
    # Check prerequisites
    check_root
    
    # Install packages
    install_packages
    
    # Setup UFW
    setup_ufw
    
    # Setup fail2ban
    setup_fail2ban
    
    # Setup log rotation
    setup_log_rotation
    
    # Setup monitoring
    setup_monitoring
    
    # Create status script
    create_status_script
    
    # Test configuration
    test_security
    
    log "Security setup completed successfully!"
    log "Run 'security-status.sh' to check security status"
    log "Run 'fail2ban-client status' to check banned IPs"
    log "Run 'ufw status' to check firewall status"
}

# Run main function
main "$@"
