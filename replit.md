# Talkastranger - Random Video Chat Application

## Overview
Talkastranger is a random video chat application inspired by Monkey.app, connecting users globally through spontaneous video conversations. It offers instant peer-to-peer video connections, text chat, user matching, and skip functionality. The platform aims to facilitate fun, spontaneous video conversations with a mobile-first, engaging interface featuring TASSY mascot branding. The project includes extensive SEO landing pages for global locations to maximize market reach. The app features comprehensive Islamic marriage and family guidance with 20 FAQs and detailed content on finding a spouse and starting a family.

## User Preferences
Preferred communication style: Simple, everyday language.
Theme: Purple dark theme by default (inspired by Monkey.app), with light/dark theme toggle.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, utilizing Vite for development. It features a component-based structure with reusable UI components from shadcn/ui and Radix UI primitives, styled with Tailwind CSS. Key design decisions include a mobile-first approach with a vertical video format, a stable Socket.io connection managed by refs, and automatic re-queueing after disconnections. State management uses TanStack React Query for server state and local React hooks for UI state, with Wouter for client-side routing. A custom `useWebRTC` hook encapsulates all WebRTC and matchmaking logic. The UI features a redesigned hero section with a video-style background, enhanced location display with search functionality, and rebranding with the TASSY mascot.

### Backend Architecture
The backend uses Express.js with TypeScript, providing HTTP services and WebSocket support via Socket.io. It implements a queue-based matchmaking service for pairing users and handles WebRTC signaling (offers, answers, ICE candidates). The server facilitates initial matching, then media streams transfer peer-to-peer. The matchmaking algorithm pairs users, manages disconnections, and processes skip requests. WebSocket events manage the matching process, WebRTC signaling, and real-time text chat. The current storage is in-memory (`MemStorage`), designed with an interface (`IStorage`) to support future database integration (e.g., PostgreSQL with Drizzle ORM). Session management is planned with Express sessions.

### Real-time Video Communication
WebRTC is central to the application, providing peer-to-peer video and audio streaming. It uses Google STUN servers for NAT traversal. The signaling protocol, managed by Socket.io, establishes direct P2P connections after server-side matching. The system monitors connection states and includes re-queueing logic for disconnections or skips. This approach minimizes server bandwidth and latency for media streams.

### Data Schema
The project currently uses a minimal in-memory user model for anonymous chat sessions, extensible for future features like user profiles and preferences. The design anticipates PostgreSQL integration via Drizzle ORM.

### UI Component Architecture
The design system features a vibrant purple primary color scheme (280° hue) with deep purple backgrounds in dark mode (270° hue), matching Monkey.app's visual style. The theme supports both light and dark modes with default dark theme. Core components include `VideoDisplay`, `ChatPanel`, `ControlButtons`, `ChatTimer`, `LoadingScreen`, `WelcomeScreen`, `TassyMascot` (with rotating anti-nudity one-liners), `MarriageFAQ` (20 Islamic marriage questions), and `MarriageGuidance` (comprehensive family guidance content). Radix UI primitives ensure accessibility. The TASSY cat mascot appears throughout the app with humorous reminders about appropriate behavior.

## External Dependencies

### Third-Party Services
- **STUN Servers**: `stun.l.google.com:19302`, `stun1.l.google.com:19302` for WebRTC NAT traversal.

### Key NPM Packages
- **Real-time Communication**: `socket.io`, `socket.io-client`
- **UI Framework**: `@radix-ui/*`, `tailwindcss`, `class-variance-authority`, `lucide-react`
- **State & Data**: `@tanstack/react-query`, `drizzle-orm`, `drizzle-zod`, `zod`
- **Form Handling**: `react-hook-form`, `@hookform/resolvers`
- **Development**: `vite`, `@replit/vite-plugin-*`, `tsx`, `esbuild`
- **Session Management**: `express-session`, `connect-pg-simple`