-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    cyber_score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create threat_logs table
CREATE TABLE IF NOT EXISTS public.threat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    threat_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    description TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attack_simulations table
CREATE TABLE IF NOT EXISTS public.attack_simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
    result TEXT CHECK (result IN ('success', 'failed', 'partial')) DEFAULT 'failed',
    score INTEGER DEFAULT 0,
    time_taken INTEGER DEFAULT 0, -- in seconds
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gamification_events table
CREATE TABLE IF NOT EXISTS public.gamification_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'badge_earned', 'level_up', 'achievement_unlocked', etc.
    event_data JSONB,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_alerts table (for AI-powered detection)
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info',
    title TEXT NOT NULL,
    description TEXT,
    source_ip INET,
    target_ip INET,
    port INTEGER,
    protocol TEXT,
    raw_data JSONB,
    ai_confidence DECIMAL(3,2), -- AI confidence score (0.00 to 1.00)
    status TEXT CHECK (status IN ('new', 'investigating', 'resolved', 'false_positive')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_logs_user_id ON public.threat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_logs_severity ON public.threat_logs(severity);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON public.learning_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_attack_simulations_user_id ON public.attack_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_attack_simulations_type ON public.attack_simulations(simulation_type);
CREATE INDEX IF NOT EXISTS idx_gamification_events_user_id ON public.gamification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_status ON public.system_alerts(status);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON public.system_alerts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attack_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Threat logs policies
CREATE POLICY "Users can view own threat logs" ON public.threat_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own threat logs" ON public.threat_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threat logs" ON public.threat_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- Learning progress policies
CREATE POLICY "Users can view own learning progress" ON public.learning_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress" ON public.learning_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress" ON public.learning_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Attack simulations policies
CREATE POLICY "Users can view own attack simulations" ON public.attack_simulations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attack simulations" ON public.attack_simulations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Gamification events policies
CREATE POLICY "Users can view own gamification events" ON public.gamification_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert gamification events" ON public.gamification_events
    FOR INSERT WITH CHECK (true); -- Allow service role to insert

-- System alerts policies (admin only for now)
CREATE POLICY "All users can view system alerts" ON public.system_alerts
    FOR SELECT USING (true);

-- Create functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at BEFORE UPDATE ON public.learning_progress
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_system_alerts_updated_at BEFORE UPDATE ON public.system_alerts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.system_alerts (alert_type, severity, title, description, source_ip, ai_confidence) VALUES
    ('port_scan', 'warning', 'Port Scan Detected', 'Multiple port connection attempts detected', '192.168.1.100', 0.85),
    ('brute_force', 'high', 'Brute Force Attack', 'Multiple failed login attempts from single IP', '10.0.0.50', 0.92),
    ('malware', 'critical', 'Malware Signature Detected', 'Known malware signature found in network traffic', '172.16.0.25', 0.98),
    ('ddos', 'critical', 'DDoS Attack Detected', 'Unusual traffic volume detected', '203.0.113.10', 0.89),
    ('sql_injection', 'high', 'SQL Injection Attempt', 'Malicious SQL queries detected', '198.51.100.15', 0.94);

-- Create a function to generate realistic network activity
CREATE OR REPLACE FUNCTION generate_network_activity()
RETURNS void AS $$
DECLARE
    alert_types TEXT[] := ARRAY['port_scan', 'intrusion_attempt', 'malware_detected', 'ddos_attack', 'brute_force', 'data_exfiltration'];
    severities TEXT[] := ARRAY['info', 'warning', 'error', 'critical'];
    statuses TEXT[] := ARRAY['new', 'investigating', 'resolved'];
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO public.system_alerts (
            alert_type,
            severity,
            title,
            description,
            source_ip,
            ai_confidence,
            status
        ) VALUES (
            alert_types[1 + floor(random() * array_length(alert_types, 1))],
            severities[1 + floor(random() * array_length(severities, 1))],
            'Alert #' || i,
            'Auto-generated alert for demonstration',
            ('192.168.' || floor(random() * 255) || '.' || floor(random() * 255))::inet,
            0.5 + (random() * 0.5), -- Random confidence between 0.5 and 1.0
            statuses[1 + floor(random() * array_length(statuses, 1))]
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.profiles IS 'User profiles with cybersecurity gamification data';
COMMENT ON TABLE public.threat_logs IS 'Log of detected threats and security incidents';
COMMENT ON TABLE public.learning_progress IS 'User progress through cybersecurity training modules';
COMMENT ON TABLE public.attack_simulations IS 'Results from attack simulation exercises';
COMMENT ON TABLE public.gamification_events IS 'Events for cybersecurity gamification system';
COMMENT ON TABLE public.system_alerts IS 'Real-time security alerts detected by AI systems';