# 🛡️ Complete Backend Setup Guide

## Overview
Your Cybersecurity Hacker Portal backend is built with Supabase (PostgreSQL) and includes:
- User authentication & profiles
- Threat detection & logging
- Attack simulations tracking
- Learning progress management
- Gamification system
- Real-time security alerts

## 🚀 Current Status
✅ Dependencies installed
✅ Development server running on http://localhost:3002
✅ Supabase client configured
✅ Database schema ready for deployment

## 📋 Required Setup Steps

### 1. Database Schema Setup
You need to execute the SQL commands in your Supabase dashboard:

**Step 1:** Go to your Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/hvaxqlqqbhmwvenizopb
- Navigate to SQL Editor

**Step 2:** Execute Main Schema
- Copy and paste the contents of `setup-database.sql`
- Click "Run" to create all tables, indexes, and policies

**Step 3:** Add Sample Data
- Copy and paste the contents of `sample-data.sql`
- Click "Run" to populate with demo data

### 2. Environment Variables
Your `.env` file is already configured with:
```
VITE_SUPABASE_URL=https://hvaxqlqqbhmwvenizopb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Database Schema

### Core Tables Created:
1. **profiles** - User profiles with gamification data
2. **threat_logs** - Security incident tracking
3. **learning_progress** - Training module completion
4. **attack_simulations** - Simulation results
5. **gamification_events** - Achievement tracking
6. **system_alerts** - AI threat detection

### Features Enabled:
- ✅ Row Level Security (RLS)
- ✅ User data isolation
- ✅ Real-time subscriptions
- ✅ Automatic timestamps
- ✅ Performance indexes

## 🎮 Gamification Features

### Scoring System:
- **cyber_score**: User points (0-∞)
- **level**: User skill level (1-100)
- **badges**: Array of earned achievements

### Available Badges:
- "First Login" - Welcome badge
- "Security Rookie" - Complete first training
- "Threat Hunter" - Detect first threat
- "Simulation Master" - Complete 5 simulations
- "Level Up" - Reach new levels

### Experience Points:
- Login: +10 points
- Complete training module: +50 points
- Complete simulation: +100 points
- Detect threat: +25 points

## 🚨 AI Threat Detection

### Alert Types:
- `port_scan` - Network scanning attempts
- `brute_force` - Password attacks
- `malware` - Malicious software
- `ddos` - Distributed denial of service
- `sql_injection` - Database attacks
- `phishing` - Social engineering
- `ransomware` - File encryption attacks
- `data_exfiltration` - Data theft attempts

### Severity Levels:
- `info` - Informational (blue)
- `warning` - Low risk (yellow)
- `error` - Medium risk (orange)
- `critical` - High risk (red)

## 🎯 Attack Simulations

### Simulation Types:
1. **Phishing** - Email security training
2. **SQL Injection** - Database security
3. **XSS** - Web application security
4. **Buffer Overflow** - Memory vulnerabilities
5. **Man-in-the-Middle** - Network security
6. **Ransomware** - Incident response

### Difficulty Levels:
- `beginner` - Basic concepts
- `intermediate` - Practical scenarios
- `advanced` - Complex challenges
- `expert` - Professional-level

## 📚 Learning Modules

### Available Modules:
- `cybersec-101` - Cybersecurity Fundamentals
- `phishing-awareness` - Email Security
- `password-security` - Authentication Best Practices
- `network-security` - Network Protection
- `incident-response` - Security Incident Handling
- `social-engineering` - Human Factor Security

## 🔧 Utility Functions

### Database Functions Created:
1. **`generate_network_activity()`** - Creates realistic sample alerts
2. **`get_threat_statistics()`** - Returns dashboard statistics
3. **`update_updated_at_column()`** - Auto-updates timestamps

### Views Created:
1. **`dashboard_stats`** - Pre-computed statistics for quick access

## 🧪 Testing the Setup

### 1. Test Database Connection:
```javascript
// In browser console after visiting http://localhost:3002
const { data, error } = await window.supabase.from('system_alerts').select('*').limit(5);
console.log('Alerts:', data);
```

### 2. Test Authentication:
- Try signing up with a new account
- Check if profile is auto-created
- Verify user permissions

### 3. Test Real-time Features:
- Open multiple browser tabs
- Make changes in Supabase dashboard
- Verify real-time updates

## 🚀 Production Deployment

### Environment Setup:
1. Set up production Supabase project
2. Update environment variables
3. Apply database schema
4. Configure custom domain
5. Set up SSL certificates

### Performance Optimization:
- Enable database connection pooling
- Configure CDN for static assets
- Set up monitoring and alerts
- Implement backup strategies

## 🔍 Monitoring & Analytics

### Key Metrics to Track:
- User registration/login rates
- Training completion rates
- Simulation success rates
- Threat detection accuracy
- System performance metrics

### Available Dashboards:
- User activity dashboard
- Security alerts dashboard
- Learning progress dashboard
- Gamification leaderboards

## 🛡️ Security Considerations

### Implemented Security:
- Row Level Security (RLS) policies
- JWT-based authentication
- SQL injection protection
- XSS protection via Content Security Policy
- HTTPS encryption (production)

### Best Practices:
- Regular security audits
- Dependency updates
- Backup strategies
- Access logging
- Incident response procedures

## 📞 Support & Troubleshooting

### Common Issues:
1. **Connection refused**: Check Supabase URL and keys
2. **RLS policy errors**: Verify user permissions
3. **Missing data**: Check if schema was applied correctly
4. **Performance issues**: Review database indexes

### Debug Commands:
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check sample data
SELECT COUNT(*) FROM system_alerts;
```

---

## ✅ Quick Verification Checklist

- [ ] Database schema applied successfully
- [ ] Sample data inserted
- [ ] Development server running
- [ ] Authentication working
- [ ] Real-time subscriptions active
- [ ] Dashboard loading correctly
- [ ] All components rendering

**Your backend is now fully configured and ready for development!**