# Repository Rules

## Project Information
- **Type**: Cybersecurity Web Application
- **Frontend**: React with TypeScript
- **Backend**: Supabase
- **Testing Framework**: Playwright
- **Target Framework**: Playwright

## Tech Stack
- React 18+ with TypeScript
- Vite for build tooling
- Supabase for backend services
- Three.js for 3D backgrounds
- Web Audio API for sound effects
- CSS3 animations for hacker aesthetic

## Configuration
- **Supabase URL**: https://hvaxqlqqbhmwvenizopb.supabase.co
- **Supabase Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2YXhxbHFxYmhtd3Zlbml6b3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzY5ODYsImV4cCI6MjA3NTUxMjk4Nn0.G08JRnTVg97LW9YaDN9Dgx5se_tfEYb5kU42e7ZZJPQ
- **Authentication**: Google OAuth enabled

## Features
- **Professional Cybersecurity Dashboard** (NewDashboard.tsx) - Complete redesign with enhanced features:
  - Modern cyber-themed interface with glowing effects and gradients
  - Four main sections: Overview, Security Tools, Analytics, Security Status
  - User profile system with XP progression (0-1000 XP per level)
  - Statistics cards showing cyber score, simulations completed, learning progress, threats detected
  - **Real-time Achievement Notification System**: Animated toast notifications with slide-in effects, automatic dismissal, and localStorage persistence
  - **Live Threat Monitoring**: Real-time security alerts from system_alerts table with auto-refresh every 30 seconds
  - **Dynamic Security Scoring**: Real-time security score calculation based on active threat levels
  - **Enhanced Security Tab**: Live threat alert cards with severity indicators, timestamps, and comprehensive security statistics
  - Recent activity feeds and achievements system
  - Responsive design for all screen sizes with mobile-optimized layouts
- **Five Professional Cybersecurity Tools**:
  - **SteganographyDetector**: AI-powered hidden data detection in images with LSB analysis, entropy calculations, and metadata inspection
  - **URLScanner**: Multi-engine URL reputation analysis with phishing/malware detection and SSL verification
  - **MalwareScanner**: Advanced malware detection with behavioral analysis, signature matching, and multi-engine verification
  - **HashAnalyzer**: File integrity verification supporting MD5, SHA-1, SHA-256, SHA-512, and CRC32 algorithms
  - **NetworkForensics**: Deep packet inspection with live capture simulation, traffic analysis, and threat detection
- **Enhanced Attack Simulator** (AttackSimulator.tsx) - Completely redesigned modern cybersecurity training platform with:
  - **Dynamic Hero Section**: Professional command center interface with real-time statistics, progress tracking, and visual cybersecurity dashboard
  - **Progressive Scenario System**: Six realistic attack simulations from beginner to expert levels with unlocking progression and achievement tracking
  - **Interactive Training Interface**: Real-time simulation console with terminal-style feedback, progress visualization, and detailed attack vector analysis
  - **Gamified Learning Experience**: XP points, difficulty progression, completion badges, streak tracking, and performance analytics
  - **Immersive Visual Design**: Cyberpunk-themed interface with glowing effects, animated backgrounds, card-based layouts, and smooth transitions
  - **Comprehensive Skill Development**: Covers phishing, SQL injection, DDoS, APT, ransomware, and MITM attack scenarios
  - **Real-time Feedback System**: Live simulation logs, performance scoring, detailed explanations, and improvement recommendations
- **Enhanced Threat Detection System** (ThreatDetector.tsx) - Completely redesigned advanced cybersecurity command center with:
  - **Real-time Metrics Dashboard**: Live KPI cards showing total threats, system health %, blocked attacks, response times, and active connections
  - **Multi-view Interface System**: Three distinct views - Alerts, Network Topology, and Threat Intelligence
  - **Interactive Network Visualization**: HTML5 Canvas-based network map with real-time node status, IP addresses, and threat indicators
  - **Advanced Alert Management**: Real-time search/filter, severity-based filtering (Critical/High/Medium/Low), bulk resolution, auto-resolve toggle
  - **Export Functionality**: CSV export capability for alert data and reporting
  - **Threat Intelligence Feed**: IOCs (Indicators of Compromise), APT campaigns, ransomware families, and security advisories
  - **Enhanced Visual Design**: Professional cyberpunk styling with glowing effects, animated cards, and responsive layouts
  - **Database Integration**: Full integration with system_alerts table for persistent alert management
- **Enhanced Awareness Section** - Completely redesigned cybersecurity learning platform with:
  - **Modern Card-Based Layout**: Clean, visually appealing module cards with improved typography and spacing
  - **Progressive Learning Path**: Visual learning journey with difficulty progression indicators and prerequisite connections
  - **Interactive Dashboard**: Personal learning analytics, progress tracking, and achievement system
  - **Gamified Experience**: XP points, badges, streaks, and leaderboard elements to increase engagement
  - **Enhanced Quiz Interface**: Modern question layouts with better visual feedback and explanation system
  - **Quick Learning Tools**: Interactive password checker, phishing simulator, and mini-games
  - **Smart Recommendations**: AI-powered next steps based on performance and completion rates
- AI-powered detection simulation
- Gamification system with levels and achievements
- 3D background video/animation
- Sound effects throughout
- Loading screen with number counting
- Google OAuth authentication
- Protected routing system
- Authentication modal with social login

## Recent Updates

### Professional Homepage Redesign (Current)
- **Complete UI/UX Transformation**: Redesigned HomePage.tsx and HomePage.css to present an enterprise-grade cybersecurity platform with enhanced professional appearance while preserving the existing 3D background animation
- **System Status Header**: Added sticky header with real-time system clock, operational status indicator (OPERATIONAL/ONLINE), and DEFCON threat level display for enterprise command center aesthetics
- **Enhanced Hero Section**: Implemented command prompt simulation with typing animation effect, professional title "ELITE CYBERSECURITY COMMAND CENTER", and emphasis on AI-powered capabilities with enterprise-grade protection messaging
- **Company Performance Metrics**: Added impressive statistics display showing 99.97% threat detection rate, 24/7 monitoring capabilities, 500K+ threats neutralized, and <0.2s response time with live animated counters
- **Enterprise Features Grid**: Redesigned features section as "Enterprise Security Solutions" with Command Center flagship product badge, Premium and Enterprise tier indicators, and professional descriptions using enterprise terminology
- **Security Operations Center (SOC)**: Transformed network activity section into comprehensive SOC dashboard with live security metrics cards, professional threat intelligence feed, real-time scanning animations, and enhanced network monitoring
- **Professional Styling & Animations**: Enhanced HomePage.css with 900+ lines of professional styling including typing cursor animation, scanning progress indicators, enhanced hover effects, professional gradients, comprehensive responsive design, and enterprise-grade visual elements
- **TypeScript Optimization**: Fixed all HomePage-related TypeScript errors by removing unused imports (useNavigate) and unused variables while maintaining full functionality
- **Performance & Accessibility**: Maintained existing background animation system unchanged, improved responsive grid layouts for all screen sizes, and enhanced user experience with smooth animations and professional visual hierarchy

### Navbar Optimization & Floating System Time (Previous)
- **Navbar Spacing Fixes**: Resolved content overlap issues by implementing proper spacing between logo, navigation links, and user actions with responsive breakpoints at 1200px, 1024px, 768px, and 480px
- **System Time Relocation**: Moved system time from navbar to floating widget positioned in top-right corner to reduce navbar crowding and improve navigation space efficiency
- **FloatingSystemTime Component**: New standalone component with minimizable interface, real-time updates, responsive design, and cyberpunk styling including backdrop blur, glowing effects, and smooth animations
- **Navigation Simplification**: Streamlined nav-actions section by removing system time display, reducing minimum width requirements, and optimizing space allocation for authentication controls
- **Responsive Design Enhancement**: Improved mobile layouts with proper element ordering, flex-wrap handling, and optimized spacing across all screen sizes
- **CSS Optimization**: Removed redundant system-time styling from Navigation.css and implemented dedicated FloatingSystemTime.css with comprehensive responsive breakpoints

### Enhanced Dashboard with Real-time Monitoring & Achievement System (Previous)
- **Achievement Notification System**: Complete real-time notification system with animated toast notifications that track user achievements via localStorage, prevent duplicate notifications, and include smooth animations (slide-in, pulse, bounce effects) with automatic dismissal after 5 seconds
- **Real-time Threat Monitoring Dashboard**: Security tab transformed with live threat alerts pulling from Supabase system_alerts table, dynamic security scoring based on active threats, comprehensive threat alert cards with severity indicators and timestamps, and security statistics showing system uptime and threats blocked
- **Auto-refresh Functionality**: Implemented automatic polling every 30 seconds for threat alerts when viewing the security tab, with proper cleanup of intervals to prevent memory leaks
- **Enhanced NewDashboard.tsx**: Added new state variables for threat alerts and achievement notifications, loadThreatAlerts function, achievement notification component, enhanced security tab with real threat data integration
- **Comprehensive CSS Styling**: Added 350+ lines of styling for achievement notifications, threat alert cards, security stats grid, animations, and mobile responsive design in NewDashboard.css
- **React Hooks Integration**: Advanced state management using useState and useEffect for real-time updates, integrated with existing Supabase authentication and database structure while maintaining TypeScript type safety
- **Database Integration**: Full utilization of existing system_alerts table with proper error handling and real-time data fetching without requiring schema modifications

### Latest Threat Detection System Enhancement (Previous)
- **Complete Threat Detector Transformation**: Redesigned from basic alert system to professional-grade cybersecurity analytics platform
- **Real-time Metrics Implementation**: Added five live KPI cards with animated counters and trend indicators
- **Multi-view Architecture**: Created tabbed interface system with Alerts, Network Topology, and Threat Intelligence views
- **Canvas-based Network Visualization**: Built interactive network map with real-time node status updates and threat visualization
- **Advanced Alert Management System**: Implemented comprehensive search, filtering, bulk operations, and CSV export functionality
- **Enhanced Database Schema Integration**: Full utilization of system_alerts table with proper RLS policies
- **TypeScript Interface Expansion**: Added ThreatMetrics, NetworkNode, and ThreatIntelligence type definitions
- **Professional UI/UX Enhancement**: Applied cyberpunk design system with glowing effects, gradients, and responsive layouts
- **Audio Integration Enhancement**: Extended existing sound system with contextual feedback for threat management actions

### Dashboard Redesign (Earlier)
- **Complete UI/UX overhaul**: Transformed from basic dashboard to professional cybersecurity interface
- **Security Tools Implementation**: All five tools use simulation-based approach for safety and demonstration
- **Modular Component Architecture**: Each tool is a separate component with dedicated styling
- **Database Integration**: Full integration with existing Supabase schema (no SQL changes needed)
- **Event Handling**: Fixed tool launch functionality with proper event propagation
- **TypeScript Improvements**: Added proper type definitions and fixed import/export issues
- **Responsive Design**: All components work seamlessly across desktop, tablet, and mobile
- **Navigation Enhancement**: Updated MainContent.tsx routing to use NewDashboard as primary interface

## Tool Implementation Strategy
- **Simulation-Based Approach**: Tools use controlled algorithms to generate realistic results without real security risks
- **File Analysis**: Tools analyze file characteristics (name, size, type) to provide appropriate mock results
- **Realistic Demonstrations**: Each tool provides enterprise-grade UI with professional styling and detailed output
- **Modal Interface**: All tools open in dedicated modal windows with smooth animations
- **Extensible Architecture**: Easy to extend with real API integrations when needed

## Threat Detection Technical Implementation
- **HTML5 Canvas API**: Custom network topology visualization with real-time rendering and animation loops
- **React State Management**: Complex state handling using useState and useEffect hooks for multi-view coordination
- **TypeScript Interfaces**: Comprehensive type system for ThreatMetrics, NetworkNode, ThreatIntelligence, and Alert data structures
- **CSV Export Functionality**: Client-side data export using Blob API and URL.createObjectURL for report generation
- **Real-time Updates**: Interval-based data refresh system for metrics and network status visualization
- **Advanced Filtering Algorithms**: Multi-criteria search and filter implementation for large alert datasets
- **Responsive Canvas Rendering**: Dynamic canvas sizing and high-DPI display support for network visualization
- **Database Query Optimization**: Efficient use of Supabase queries with proper indexing on system_alerts table
- **Event-driven Architecture**: Comprehensive event handling for user interactions and bulk operations
- **Memory Management**: Proper cleanup of intervals, event listeners, and canvas contexts to prevent memory leaks

## Design Guidelines
- Dark, cybersecurity-themed design with improved readability
- Minimal color palette with unique cyber colors (neon blues, greens, purples)
- Clean, professional layout with enhanced navigation
- Typography: Inter font for body text, Orbitron for headers
- Optimized background brightness for better contrast
- No patterns in 3D background
- Continuous 3D video/animation
- Cyberpunk-styled authentication components
- Mobile-responsive design
- Gradient effects, glowing borders, and hover animations
- Professional card layouts with subtle shadows and borders
- Consistent color schemes across all components

## Current Status
- **Development Server**: Running on port 3006 (handles port conflicts automatically)
- **Database Schema**: Complete with system_alerts table, RLS policies, and sample data
- **Authentication**: Fully integrated with Supabase Auth and Google OAuth
- **Core Features**: All major components functional and production-ready
- **Homepage**: Completely redesigned with enterprise-grade professional appearance
- **Testing Framework**: Playwright configured and ready for E2E test implementation
- **Performance**: Optimized with proper memory management and efficient rendering

## Current Implementation Details

### Enhanced Dashboard Technical Architecture
- **NewDashboard.tsx** (~800+ lines): Core dashboard component with integrated achievement notifications, threat monitoring, and real-time updates
- **NewDashboard.css** (~1000+ lines): Comprehensive styling including achievement notification animations, threat alert cards, security statistics grid, and mobile responsive layouts
- **State Management**: Advanced React hooks implementation with useState for threat alerts and achievement notifications, useEffect for auto-refresh functionality
- **Database Integration**: Direct integration with Supabase system_alerts table using existing RLS policies, no schema modifications required
- **Performance Optimization**: Proper interval cleanup, memory leak prevention, and efficient re-rendering strategies
- **Achievement Tracking**: localStorage-based achievement persistence with duplicate prevention and cross-session continuity

### Key Files Modified

#### Professional Homepage Redesign (Current)
- `src/pages/HomePage.tsx`: Complete professional transformation (~520 lines) with enterprise-grade UI, system status header, enhanced hero section, performance metrics, SOC dashboard, and TypeScript optimization
- `src/pages/HomePage.css`: Comprehensive professional styling (~956 lines) including typing animations, scanning indicators, enterprise-grade visual elements, responsive design, and cyberpunk aesthetics

#### Previous Enhancements
- `src/pages/NewDashboard.tsx`: Enhanced with achievement notifications, threat monitoring, auto-refresh functionality
- `src/styles/NewDashboard.css`: Added 350+ lines of styling for notifications, alerts, animations, and responsive design
- Integration maintains existing authentication flow and database structure

## Future Enhancement Opportunities
- **Achievement Database Migration**: Move achievement tracking from localStorage to Supabase for multi-device sync
- **WebSocket Integration**: Replace polling-based updates with real-time WebSocket connections for threat alerts
- **Advanced Security Scoring**: Implement more sophisticated scoring algorithms with severity weights and historical trends
- **Threat Alert Management**: Add filtering, sorting, and management capabilities for security alerts
- **Real API Integration**: Replace simulation-based tools with actual security API endpoints
- **Advanced Threat Intelligence**: Integration with external threat intelligence feeds
- **Machine Learning Integration**: AI-powered threat pattern recognition and prediction
- **Extended Network Visualization**: 3D network topology with more detailed node relationships
- **Real-time Collaborative Features**: Multi-user threat response coordination
- **Advanced Analytics**: Historical trend analysis and threat pattern visualization
- **Mobile App Integration**: Native mobile companion app for alert notifications
- **Enterprise Integration**: SIEM system integration and enterprise security tool compatibility