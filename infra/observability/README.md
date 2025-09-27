# Observability Stack

This directory contains the complete observability stack for the Tour application, including monitoring, logging, tracing, and alerting.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Applications  │    │   Prometheus    │    │    Grafana      │
│                 │    │                 │    │                 │
│ • Web App       │───▶│ • Metrics       │───▶│ • Dashboards    │
│ • Admin App     │    │ • Alerts        │    │ • Visualization │
│ • API           │    │ • Rules         │    │ • Exploration   │
│ • Nginx         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │  Alertmanager   │              │
         │              │                 │              │
         │              │ • Routing       │              │
         │              │ • Grouping      │              │
         │              │ • Inhibition    │              │
         │              └─────────────────┘              │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                            ┌─────────────────┐
│      Loki       │                            │     Jaeger      │
│                 │                            │                 │
│ • Log Storage   │                            │ • Distributed   │
│ • Log Query     │                            │   Tracing       │
│ • Log Aggregation│                           │ • Performance   │
└─────────────────┘                            │   Analysis      │
         ▲                                     └─────────────────┘
         │
┌─────────────────┐
│    Promtail     │
│                 │
│ • Log Collection│
│ • Log Parsing   │
│ • Log Shipping  │
└─────────────────┘
```

## Services

### Core Monitoring
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and management

### Logging
- **Loki**: Log aggregation and storage
- **Promtail**: Log collection agent

### Tracing
- **Jaeger**: Distributed tracing

### Exporters
- **Node Exporter**: System metrics
- **cAdvisor**: Container metrics
- **Redis Exporter**: Redis metrics
- **Nginx Exporter**: Nginx metrics

## Quick Start

1. **Start the observability stack:**
   ```bash
   docker-compose -f docker-compose.observability.yml up -d
   ```

2. **Access the services:**
   - Grafana: http://localhost:3000 (admin/admin123)
   - Prometheus: http://localhost:9090
   - Alertmanager: http://localhost:9093
   - Jaeger: http://localhost:16686
   - Loki: http://localhost:3100

3. **Import dashboards:**
   - Node.js Application Metrics
   - React Application Metrics
   - Nginx Metrics
   - System Metrics

## Configuration

### Prometheus
- **Config**: `prometheus/prometheus.yml`
- **Rules**: `prometheus/rules/*.yml`
- **Scrape interval**: 15s
- **Retention**: 30 days

### Grafana
- **Datasources**: Auto-provisioned
- **Dashboards**: Auto-imported
- **Admin password**: admin123

### Alertmanager
- **Config**: `alertmanager/alertmanager.yml`
- **Routes**: By severity and alert type
- **Receivers**: Email, webhook, Slack

### Loki
- **Config**: `loki/loki.yml`
- **Storage**: Filesystem
- **Retention**: 30 days

## Alerts

### Performance Alerts
- **P99 Response Time > 500ms**: Warning
- **P95 Response Time > 200ms**: Warning
- **Error Rate > 1%**: Critical
- **4xx Error Rate > 5%**: Warning

### Capacity Alerts
- **CPU Usage > 80%**: Warning
- **Memory Usage > 90%**: Critical
- **Disk Usage > 85%**: Warning
- **Request Rate > 1000 req/s**: Warning

### Reliability Alerts
- **Service Down**: Critical
- **Database Issues**: Critical
- **Redis Issues**: Critical
- **Nginx Issues**: Critical

## Dashboards

### Node.js Application Metrics
- Request rate and response times
- Error rates and status codes
- Memory and CPU usage
- Database query performance
- Redis operations

### React Application Metrics
- Page views and load times
- JavaScript errors
- Bundle size and performance
- API call durations
- User interactions

### Nginx Metrics
- Request rate and duration
- Connection states
- Status code distribution
- Upstream response times
- Error rates

### System Metrics
- CPU, memory, and disk usage
- Network I/O
- Container metrics
- System load and processes

## Integration

### Sentry Integration
- **Frontend**: React error tracking and performance
- **Backend**: Node.js error tracking and tracing
- **Session Replay**: User interaction recording

### OpenTelemetry
- **Tracing**: Distributed request tracing
- **Metrics**: Custom application metrics
- **Logs**: Structured logging

## Maintenance

### Backup
- Prometheus data: 30-day retention
- Grafana dashboards: Version controlled
- Alert rules: Version controlled

### Updates
- Regular security updates
- Performance optimizations
- New dashboard additions

### Scaling
- Horizontal scaling with multiple Prometheus instances
- Federation for multi-region deployments
- Long-term storage with Thanos

## Troubleshooting

### Common Issues
1. **High memory usage**: Adjust retention policies
2. **Slow queries**: Optimize PromQL queries
3. **Missing metrics**: Check scrape configurations
4. **Alert noise**: Tune alert rules and thresholds

### Logs
- Check container logs: `docker-compose logs <service>`
- Check Prometheus targets: http://localhost:9090/targets
- Check Grafana logs: `docker-compose logs grafana`

### Performance
- Monitor Prometheus memory usage
- Check disk space for metrics storage
- Optimize Grafana dashboard queries
- Tune alert evaluation intervals
