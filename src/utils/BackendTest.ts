import { supabase } from '../config/supabase'

/**
 * Backend verification and testing utilities
 * Run these functions in the browser console to test backend connectivity
 */

// Test database connection
export const testConnection = async () => {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Connection failed:', error)
      return false
    }

    console.log('✅ Connection successful!')
    return true
  } catch (error) {
    console.error('❌ Connection error:', error)
    return false
  }
}

// Test authentication
export const testAuth = async () => {
  console.log('🔐 Testing authentication...')
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ User authenticated:', session.user.email)
      return session.user
    } else {
      console.log('ℹ️ No active session')
      return null
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error)
    return null
  }
}

// Test system alerts
export const testSystemAlerts = async () => {
  console.log('🚨 Testing system alerts...')
  
  try {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('❌ System alerts test failed:', error)
      return []
    }

    console.log('✅ System alerts loaded:', data.length, 'alerts')
    console.table(data)
    return data
  } catch (error) {
    console.error('❌ System alerts error:', error)
    return []
  }
}

// Test threat statistics
export const testThreatStats = async () => {
  console.log('📊 Testing threat statistics...')
  
  try {
    const { data, error } = await supabase.rpc('get_threat_statistics')

    if (error) {
      console.error('❌ Threat stats test failed:', error)
      return null
    }

    console.log('✅ Threat statistics loaded:')
    console.log(data)
    return data
  } catch (error) {
    console.error('❌ Threat stats error:', error)
    return null
  }
}

// Test real-time subscription
export const testRealTime = () => {
  console.log('⚡ Testing real-time subscription...')
  
  const subscription = supabase
    .channel('test_alerts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'system_alerts' 
    }, (payload) => {
      console.log('📡 Real-time update received:', payload)
    })
    .subscribe((status) => {
      console.log('📡 Subscription status:', status)
    })

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe()
    console.log('📡 Real-time subscription closed')
  }
}

// Test user profile operations
export const testUserProfile = async (userId?: string) => {
  console.log('👤 Testing user profile operations...')
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('ℹ️ No authenticated user for profile test')
      return null
    }
    userId = user.id
  }

  try {
    // Try to get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Profile test failed:', error)
      return null
    }

    if (profile) {
      console.log('✅ User profile found:')
      console.log(profile)
      return profile
    } else {
      console.log('ℹ️ No profile found for user')
      return null
    }
  } catch (error) {
    console.error('❌ Profile test error:', error)
    return null
  }
}

// Generate test network activity
export const generateTestActivity = async () => {
  console.log('🔧 Generating test network activity...')
  
  try {
    const { error } = await supabase.rpc('generate_network_activity')

    if (error) {
      console.error('❌ Test activity generation failed:', error)
      return false
    }

    console.log('✅ Test network activity generated successfully!')
    return true
  } catch (error) {
    console.error('❌ Test activity generation error:', error)
    return false
  }
}

// Run full backend test suite
export const runFullBackendTest = async () => {
  console.log('🧪 Running full backend test suite...')
  console.log('=====================================')
  
  const results = {
    connection: await testConnection(),
    auth: await testAuth(),
    systemAlerts: (await testSystemAlerts()).length > 0,
    threatStats: (await testThreatStats()) !== null,
    userProfile: (await testUserProfile()) !== null
  }

  console.log('=====================================')
  console.log('🧪 Test Results Summary:')
  console.table(results)
  
  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length
  
  console.log(`✅ Tests passed: ${passed}/${total}`)
  
  if (passed === total) {
    console.log('🎉 All backend tests passed! Your setup is working perfectly.')
  } else {
    console.log('⚠️ Some tests failed. Check the setup guide for troubleshooting.')
  }

  return results
}

// Expose functions to window for console access
if (typeof window !== 'undefined') {
  ;(window as any).backendTest = {
    testConnection,
    testAuth,
    testSystemAlerts,
    testThreatStats,
    testRealTime,
    testUserProfile,
    generateTestActivity,
    runFullBackendTest
  }
  
  console.log('🔧 Backend test utilities loaded! Use window.backendTest.runFullBackendTest() to test everything.')
}