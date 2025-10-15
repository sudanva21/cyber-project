import { supabase } from '../config/supabase'
import type { UserProfile, ThreatLog, LearningProgress, AttackSimulation } from '../config/supabase'

/**
 * Database utility functions for the Cybersecurity Hacker Portal
 */

// =================
// PROFILE FUNCTIONS
// =================

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export const updateUserScore = async (userId: string, pointsToAdd: number): Promise<boolean> => {
  try {
    // Get current score
    const profile = await getUserProfile(userId)
    if (!profile) return false

    const newScore = profile.cyber_score + pointsToAdd
    const newLevel = Math.floor(newScore / 1000) + 1 // Level up every 1000 points

    const { error } = await supabase
      .from('profiles')
      .update({ 
        cyber_score: newScore,
        level: newLevel
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating user score:', error)
      return false
    }

    // Award level up badge if needed
    if (newLevel > profile.level) {
      await awardBadge(userId, `Level ${newLevel}`, pointsToAdd)
    }

    return true
  } catch (error) {
    console.error('Error in updateUserScore:', error)
    return false
  }
}

export const awardBadge = async (userId: string, badgeName: string, points: number = 0): Promise<boolean> => {
  try {
    // Check if user already has this badge
    const profile = await getUserProfile(userId)
    if (!profile || profile.badges.includes(badgeName)) {
      return false
    }

    // Add badge to user profile
    const updatedBadges = [...profile.badges, badgeName]
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ badges: updatedBadges })
      .eq('user_id', userId)

    if (profileError) {
      console.error('Error updating user badges:', profileError)
      return false
    }

    // Record gamification event
    const { error: eventError } = await supabase
      .from('gamification_events')
      .insert([{
        user_id: userId,
        event_type: 'badge_earned',
        event_data: { badge_name: badgeName },
        points_awarded: points
      }])

    if (eventError) {
      console.error('Error recording gamification event:', eventError)
    }

    return true
  } catch (error) {
    console.error('Error in awardBadge:', error)
    return false
  }
}

// ===================
// THREAT LOG FUNCTIONS
// ===================

export const logThreat = async (
  userId: string,
  threatType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  description: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('threat_logs')
      .insert([{
        user_id: userId,
        threat_type: threatType,
        severity,
        description
      }])

    if (error) {
      console.error('Error logging threat:', error)
      return false
    }

    // Award points for threat detection
    const points = severity === 'critical' ? 100 : severity === 'high' ? 75 : severity === 'medium' ? 50 : 25
    await updateUserScore(userId, points)

    return true
  } catch (error) {
    console.error('Error in logThreat:', error)
    return false
  }
}

export const getUserThreats = async (userId: string): Promise<ThreatLog[]> => {
  try {
    const { data, error } = await supabase
      .from('threat_logs')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false })

    if (error) {
      console.error('Error fetching user threats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserThreats:', error)
    return []
  }
}

// ==========================
// LEARNING PROGRESS FUNCTIONS
// ==========================

export const updateLearningProgress = async (
  userId: string,
  moduleId: string,
  completed: boolean,
  score: number,
  timeSpent: number
): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    if (existing) {
      // Update existing progress
      const { error } = await supabase
        .from('learning_progress')
        .update({
          completed,
          score,
          time_spent: timeSpent,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating learning progress:', error)
        return false
      }
    } else {
      // Create new progress record
      const { error } = await supabase
        .from('learning_progress')
        .insert([{
          user_id: userId,
          module_id: moduleId,
          completed,
          score,
          time_spent: timeSpent,
          completed_at: completed ? new Date().toISOString() : null
        }])

      if (error) {
        console.error('Error creating learning progress:', error)
        return false
      }
    }

    // Award points for completion
    if (completed) {
      await updateUserScore(userId, score)
      
      // Award completion badge for first module
      const userProgress = await getUserLearningProgress(userId)
      const completedModules = userProgress.filter(p => p.completed).length
      
      if (completedModules === 1) {
        await awardBadge(userId, 'Security Rookie', 50)
      } else if (completedModules === 5) {
        await awardBadge(userId, 'Learning Expert', 200)
      }
    }

    return true
  } catch (error) {
    console.error('Error in updateLearningProgress:', error)
    return false
  }
}

export const getUserLearningProgress = async (userId: string): Promise<LearningProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching learning progress:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserLearningProgress:', error)
    return []
  }
}

// =============================
// ATTACK SIMULATION FUNCTIONS
// =============================

export const recordAttackSimulation = async (
  userId: string,
  simulationType: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  result: 'success' | 'failed' | 'partial',
  score: number,
  timeTaken: number,
  details?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('attack_simulations')
      .insert([{
        user_id: userId,
        simulation_type: simulationType,
        difficulty,
        result,
        score,
        time_taken: timeTaken,
        details
      }])

    if (error) {
      console.error('Error recording attack simulation:', error)
      return false
    }

    // Award points based on difficulty and result
    let points = 0
    const basePoints = { beginner: 25, intermediate: 50, advanced: 100, expert: 200 }
    const multiplier = { success: 1, partial: 0.5, failed: 0.1 }
    
    points = basePoints[difficulty] * multiplier[result]
    await updateUserScore(userId, Math.floor(points))

    // Check for simulation badges
    const userSimulations = await getUserAttackSimulations(userId)
    const successfulSims = userSimulations.filter(s => s.result === 'success').length
    
    if (successfulSims === 1) {
      await awardBadge(userId, 'First Success', 100)
    } else if (successfulSims === 5) {
      await awardBadge(userId, 'Simulation Master', 250)
    } else if (successfulSims === 10) {
      await awardBadge(userId, 'Cyber Warrior', 500)
    }

    return true
  } catch (error) {
    console.error('Error in recordAttackSimulation:', error)
    return false
  }
}

export const getUserAttackSimulations = async (userId: string): Promise<AttackSimulation[]> => {
  try {
    const { data, error } = await supabase
      .from('attack_simulations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching attack simulations:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserAttackSimulations:', error)
    return []
  }
}

// ========================
// SYSTEM ALERTS FUNCTIONS
// ========================

export const getSystemAlerts = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching system alerts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getSystemAlerts:', error)
    return []
  }
}

export const getThreatStatistics = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_threat_statistics')

    if (error) {
      console.error('Error fetching threat statistics:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getThreatStatistics:', error)
    return null
  }
}

// ==================
// REAL-TIME FUNCTIONS
// ==================

export const subscribeToSystemAlerts = (callback: (payload: any) => void) => {
  return supabase
    .channel('system_alerts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'system_alerts' }, callback)
    .subscribe()
}

export const subscribeToUserProfile = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('user_profile')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'profiles',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}

// =================
// UTILITY FUNCTIONS
// =================

export const generateNetworkActivity = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('generate_network_activity')
    
    if (error) {
      console.error('Error generating network activity:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in generateNetworkActivity:', error)
    return false
  }
}

export const getDashboardStats = async () => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    return null
  }
}