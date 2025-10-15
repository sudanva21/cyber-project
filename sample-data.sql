-- ===============================================
-- SAMPLE DATA FOR CYBERSECURITY HACKER PORTAL
-- ===============================================
-- Execute this AFTER the main schema setup

-- Insert sample system alerts for demonstration
INSERT INTO public.system_alerts (alert_type, severity, title, description, source_ip, ai_confidence, status) VALUES
    ('port_scan', 'warning', 'Port Scan Detected', 'Multiple port connection attempts detected from suspicious IP', '192.168.1.100', 0.85, 'new'),
    ('brute_force', 'error', 'Brute Force Attack', 'Multiple failed login attempts from single IP address', '10.0.0.50', 0.92, 'investigating'),
    ('malware', 'critical', 'Malware Signature Detected', 'Known malware signature found in network traffic', '172.16.0.25', 0.98, 'new'),
    ('ddos', 'critical', 'DDoS Attack Detected', 'Unusual traffic volume detected from multiple sources', '203.0.113.10', 0.89, 'resolved'),
    ('sql_injection', 'error', 'SQL Injection Attempt', 'Malicious SQL queries detected in web traffic', '198.51.100.15', 0.94, 'new'),
    ('phishing', 'warning', 'Phishing Email Detected', 'Suspicious email with malicious links intercepted', '185.220.101.50', 0.78, 'resolved'),
    ('ransomware', 'critical', 'Ransomware Activity', 'File encryption patterns consistent with ransomware', '192.168.2.15', 0.95, 'investigating'),
    ('data_exfiltration', 'error', 'Data Exfiltration Attempt', 'Unusual outbound data transfer detected', '10.0.1.200', 0.87, 'new'),
    ('privilege_escalation', 'error', 'Privilege Escalation', 'Unauthorized attempt to gain elevated privileges', '172.16.1.50', 0.91, 'new'),
    ('network_anomaly', 'warning', 'Network Anomaly', 'Unusual network patterns detected', '192.168.3.75', 0.73, 'resolved');

-- Create a function to generate realistic network activity
CREATE OR REPLACE FUNCTION generate_network_activity()
RETURNS void AS $$
DECLARE
    alert_types TEXT[] := ARRAY['port_scan', 'intrusion_attempt', 'malware_detected', 'ddos_attack', 'brute_force', 'data_exfiltration', 'phishing', 'ransomware', 'privilege_escalation', 'network_anomaly'];
    severities TEXT[] := ARRAY['info', 'warning', 'error', 'critical'];
    statuses TEXT[] := ARRAY['new', 'investigating', 'resolved', 'false_positive'];
    titles TEXT[] := ARRAY['Security Alert', 'Threat Detected', 'Suspicious Activity', 'Network Intrusion', 'Malicious Behavior', 'Security Incident'];
    i INT;
    random_alert_type TEXT;
    random_severity TEXT;
    random_status TEXT;
    random_title TEXT;
BEGIN
    FOR i IN 1..15 LOOP
        random_alert_type := alert_types[1 + floor(random() * array_length(alert_types, 1))];
        random_severity := severities[1 + floor(random() * array_length(severities, 1))];
        random_status := statuses[1 + floor(random() * array_length(statuses, 1))];
        random_title := titles[1 + floor(random() * array_length(titles, 1))] || ' #' || i;
        
        INSERT INTO public.system_alerts (
            alert_type,
            severity,
            title,
            description,
            source_ip,
            ai_confidence,
            status,
            created_at
        ) VALUES (
            random_alert_type,
            random_severity,
            random_title,
            'Auto-generated alert for demonstration purposes - ' || random_alert_type,
            ('192.168.' || floor(random() * 255) || '.' || floor(random() * 255))::inet,
            0.5 + (random() * 0.5), -- Random confidence between 0.5 and 1.0
            random_status,
            NOW() - (random() * interval '7 days') -- Random time within last 7 days
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate sample network activity
SELECT generate_network_activity();

-- Insert sample learning modules progress (for demo purposes - will be user-specific after login)
-- These will be templates that get copied for each user

-- Create sample attack simulation results templates
INSERT INTO public.system_alerts (alert_type, severity, title, description, source_ip, target_ip, ai_confidence, status, created_at) VALUES
    ('xss_attack', 'error', 'XSS Attack Detected', 'Cross-site scripting attempt blocked', '203.0.113.25', '192.168.1.10', 0.96, 'resolved', NOW() - interval '2 hours'),
    ('buffer_overflow', 'critical', 'Buffer Overflow Attempt', 'Stack buffer overflow detected in application', '198.51.100.30', '10.0.0.100', 0.93, 'investigating', NOW() - interval '1 hour'),
    ('mitm_attack', 'error', 'Man-in-the-Middle Attack', 'SSL certificate mismatch detected', '172.16.255.1', '192.168.1.50', 0.88, 'new', NOW() - interval '30 minutes');

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_alerts,
    COUNT(*) FILTER (WHERE severity = 'error') as error_alerts,
    COUNT(*) FILTER (WHERE severity = 'warning') as warning_alerts,
    COUNT(*) FILTER (WHERE severity = 'info') as info_alerts,
    COUNT(*) FILTER (WHERE status = 'new') as new_alerts,
    COUNT(*) FILTER (WHERE status = 'investigating') as investigating_alerts,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_alerts,
    COUNT(*) FILTER (WHERE created_at >= NOW() - interval '24 hours') as alerts_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - interval '7 days') as alerts_last_week,
    AVG(ai_confidence) as avg_ai_confidence
FROM public.system_alerts;

-- Create a function to get real-time threat statistics
CREATE OR REPLACE FUNCTION get_threat_statistics()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'total_alerts', COUNT(*),
        'critical_count', COUNT(*) FILTER (WHERE severity = 'critical'),
        'error_count', COUNT(*) FILTER (WHERE severity = 'error'),
        'warning_count', COUNT(*) FILTER (WHERE severity = 'warning'),
        'info_count', COUNT(*) FILTER (WHERE severity = 'info'),
        'new_count', COUNT(*) FILTER (WHERE status = 'new'),
        'investigating_count', COUNT(*) FILTER (WHERE status = 'investigating'),
        'resolved_count', COUNT(*) FILTER (WHERE status = 'resolved'),
        'avg_confidence', ROUND(AVG(ai_confidence)::numeric, 2),
        'last_24h_count', COUNT(*) FILTER (WHERE created_at >= NOW() - interval '24 hours'),
        'threat_types', jsonb_agg(DISTINCT alert_type)
    ) INTO result
    FROM public.system_alerts;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.profiles IS 'User profiles with cybersecurity gamification data';
COMMENT ON TABLE public.threat_logs IS 'Log of detected threats and security incidents';
COMMENT ON TABLE public.learning_progress IS 'User progress through cybersecurity training modules';
COMMENT ON TABLE public.attack_simulations IS 'Results from attack simulation exercises';
COMMENT ON TABLE public.gamification_events IS 'Events for cybersecurity gamification system';
COMMENT ON TABLE public.system_alerts IS 'Real-time security alerts detected by AI systems';
COMMENT ON FUNCTION get_threat_statistics() IS 'Returns comprehensive threat statistics for dashboard';
COMMENT ON VIEW dashboard_stats IS 'Pre-computed dashboard statistics for quick access';