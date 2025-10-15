-- ===============================================
-- BACKEND TESTING SCRIPT
-- ===============================================
-- Execute this in Supabase SQL Editor to test all functionality

-- Test 1: Verify all tables exist
SELECT 'Testing table existence...' as test_name;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test 2: Check RLS policies
SELECT 'Testing RLS policies...' as test_name;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 3: Verify indexes
SELECT 'Testing indexes...' as test_name;
SELECT schemaname, tablename, indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Test 4: Check sample data
SELECT 'Testing sample data...' as test_name;
SELECT 'system_alerts' as table_name, COUNT(*) as record_count FROM system_alerts
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'threat_logs', COUNT(*) FROM threat_logs
UNION ALL
SELECT 'learning_progress', COUNT(*) FROM learning_progress
UNION ALL
SELECT 'attack_simulations', COUNT(*) FROM attack_simulations
UNION ALL
SELECT 'gamification_events', COUNT(*) FROM gamification_events;

-- Test 5: Verify functions exist
SELECT 'Testing functions...' as test_name;
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Test 6: Test threat statistics function
SELECT 'Testing threat statistics function...' as test_name;
SELECT get_threat_statistics();

-- Test 7: Check alert severity distribution
SELECT 'Testing alert severity distribution...' as test_name;
SELECT severity, COUNT(*) as count
FROM system_alerts
GROUP BY severity
ORDER BY 
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'error' THEN 3
    WHEN 'warning' THEN 4
    WHEN 'medium' THEN 5
    WHEN 'low' THEN 6
    WHEN 'info' THEN 7
  END;

-- Test 8: Check alert types
SELECT 'Testing alert types...' as test_name;
SELECT alert_type, COUNT(*) as count
FROM system_alerts
GROUP BY alert_type
ORDER BY count DESC;

-- Test 9: Test dashboard stats view
SELECT 'Testing dashboard stats view...' as test_name;
SELECT * FROM dashboard_stats;

-- Test 10: Check recent alerts (last 24 hours)
SELECT 'Testing recent alerts...' as test_name;
SELECT id, alert_type, severity, title, created_at
FROM system_alerts
WHERE created_at >= NOW() - interval '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- Test 11: Verify triggers are working
SELECT 'Testing triggers...' as test_name;
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Test 12: Test AI confidence distribution
SELECT 'Testing AI confidence distribution...' as test_name;
SELECT 
  CASE 
    WHEN ai_confidence >= 0.9 THEN 'High (0.9-1.0)'
    WHEN ai_confidence >= 0.7 THEN 'Medium (0.7-0.89)'
    WHEN ai_confidence >= 0.5 THEN 'Low (0.5-0.69)'
    ELSE 'Very Low (<0.5)'
  END as confidence_range,
  COUNT(*) as count
FROM system_alerts
WHERE ai_confidence IS NOT NULL
GROUP BY 
  CASE 
    WHEN ai_confidence >= 0.9 THEN 'High (0.9-1.0)'
    WHEN ai_confidence >= 0.7 THEN 'Medium (0.7-0.89)'
    WHEN ai_confidence >= 0.5 THEN 'Low (0.5-0.69)'
    ELSE 'Very Low (<0.5)'
  END
ORDER BY count DESC;

-- Test 13: Check status distribution
SELECT 'Testing status distribution...' as test_name;
SELECT status, COUNT(*) as count
FROM system_alerts
GROUP BY status
ORDER BY count DESC;

-- Test 14: Test network activity generation function
SELECT 'Testing network activity generation...' as test_name;
SELECT COUNT(*) as alerts_before FROM system_alerts;
SELECT generate_network_activity();
SELECT COUNT(*) as alerts_after FROM system_alerts;

-- Test 15: Verify foreign key constraints
SELECT 'Testing foreign key constraints...' as test_name;
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Test 16: Performance test - complex query
SELECT 'Testing complex query performance...' as test_name;
EXPLAIN ANALYZE
SELECT 
    sa.alert_type,
    sa.severity,
    COUNT(*) as total_alerts,
    AVG(sa.ai_confidence) as avg_confidence,
    MAX(sa.created_at) as latest_alert
FROM system_alerts sa
WHERE sa.created_at >= NOW() - interval '7 days'
GROUP BY sa.alert_type, sa.severity
HAVING COUNT(*) > 0
ORDER BY total_alerts DESC;

-- Final summary
SELECT 'BACKEND TEST SUMMARY' as summary;
SELECT 
    'Tables Created' as component,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'RLS Policies',
    COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Indexes Created',
    COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Functions Created',
    COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'public'
UNION ALL
SELECT 
    'Sample Alerts',
    COUNT(*)
FROM system_alerts;

SELECT 'Backend setup verification complete!' as status;