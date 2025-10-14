import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database schema types
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  last_login: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  cyber_score: number
  level: number
  badges: string[]
  created_at: string
  updated_at: string
}

export interface ThreatLog {
  id: string
  user_id: string
  threat_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detected_at: string
  resolved: boolean
  resolved_at?: string
}

export interface LearningProgress {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  score: number
  time_spent: number
  completed_at?: string
}

export interface AttackSimulation {
  id: string
  user_id: string
  simulation_type: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  result: 'success' | 'failed' | 'partial'
  score: number
  time_taken: number
  created_at: string
}