# Design Guidelines: Random Video Chat Application (Monkey.app Style)

## Design Approach
**Reference-Based Approach** drawing inspiration from Monkey.app, Snapchat, and modern social video platforms. Focus on playful, mobile-first design that makes spontaneous connections feel fun and effortless.

## Core Design Principles
1. **Video-First Interface**: The video feed is the hero - everything else supports it
2. **Instant Gratification**: Fast interactions, minimal friction
3. **Playful & Approachable**: Fun without being childish, inviting for spontaneous use
4. **Mobile-Optimized**: Vertical video format, thumb-friendly controls

## Typography
- **Primary Font**: DM Sans (Google Fonts) - modern, friendly, highly legible
- **Headings**: Bold (700), 24-32px for main titles
- **Body**: Regular (400), 15-16px for interface text
- **Buttons/CTAs**: Medium (500), 14-16px, uppercase or sentence case
- **Timer/Stats**: Mono font (Roboto Mono) for time displays, tabular figures

## Layout System
**Spacing Units**: Use Tailwind units of **2, 3, 4, 6, 8** for consistency
- Tight spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, gap-4 (most UI elements)
- Generous spacing: p-6, p-8 (section separation)

**Container Strategy:**
- Full-screen video area: w-full h-screen or h-[calc(100vh-4rem)]
- Control panels: max-w-md centered for mobile-first
- Text overlays: p-4 to p-6 from edges

## Component Library

### 1. Video Interface
**Main Video Display:**
- Full-screen or near-full-screen video container
- Aspect ratio 9:16 (mobile) or 4:3 (desktop)
- Rounded corners (rounded-2xl) for softness
- Shadow overlay at bottom for control visibility

**Picture-in-Picture (Your Video):**
- Small preview in corner (w-24 h-32 to w-32 h-40)
- Rounded-xl with subtle border
- Positioned top-right with m-4

### 2. Control Panel
**Primary Actions** (overlaid on video bottom):
- Next/Skip button: Large, circular (h-16 w-16), prominent placement center-bottom
- Timer display: Top-center, semi-transparent pill background (bg-black/40 backdrop-blur-md)
- Settings/Report icons: Top corners, subtle until needed

**Button Treatments:**
- Circular action buttons with icon-only design
- Semi-transparent backgrounds with blur (bg-white/20 backdrop-blur-md) when over video
- No hover states on video overlays - keep them clean
- Standard button hover states for off-video controls

### 3. Chat Interface
**Side Panel or Overlay:**
- Slide-in from right or bottom (mobile)
- Semi-transparent background (bg-black/60 backdrop-blur-lg)
- Message bubbles: rounded-2xl, alternating alignment
- Input field: rounded-full with send button integrated

### 4. Matching/Waiting State
**Loading Screen:**
- Centered spinner or animated illustration
- "Finding someone new..." message
- Animated gradient or subtle motion background
- Quick tips or fun facts during wait

### 5. Navigation
**Minimal Top Bar:**
- Logo/branding left
- Coins/premium indicator (if applicable)
- Profile avatar right
- Height: h-16, fixed positioning

### 6. Modal Overlays
- Report/Settings modals: max-w-md, rounded-3xl
- Frosted glass effect (backdrop-blur-xl)
- Smooth slide-up animations
- Close button top-right

## Interaction Patterns

### Primary User Flow:
1. **Match Screen** → Instant video connection
2. **Active Chat** → Video + timer + controls visible
3. **Next Action** → Quick transition animation (0.3s)
4. **Repeat** → Seamless continuous matching

### Gestures (Mobile):
- Swipe up: Open text chat
- Tap video: Show/hide controls
- Double-tap: Add time (if feature enabled)
- Swipe right/left: Next person (alternative to button)

### Animations:
**Minimal & Purposeful:**
- Video connection: Quick fade-in (0.2s)
- Next transition: Smooth cross-fade (0.3s)
- Timer updates: Subtle scale pulse
- Button presses: Gentle scale feedback (scale-95 active state)

**Avoid:**
- Distracting background animations
- Excessive particle effects
- Auto-playing graphics that compete with video

## Icons
**Library**: Heroicons (CDN) for clean, modern iconography
- Video controls: Camera, Mic, Settings
- Actions: X (next), Heart (favorite), Flag (report)
- UI: Clock, Chat, Gift, Plus

## Accessibility
- High contrast for text overlays on video
- Touch targets minimum 44x44px
- Screen reader labels for icon-only buttons
- Keyboard navigation for desktop
- Clear focus states (ring-2 ring-offset-2)

## Special Considerations

### Safety Features (Prominent but Unobtrusive):
- Report button always accessible in top corner
- Skip button prominently placed
- Visual indicators for recording/streaming status

### Connection States:
- Loading: Animated state with progress indication
- Connected: Clean video interface
- Disconnected: Friendly error message with retry option
- Banned/Restricted: Clear messaging with support contact

### Performance:
- Lazy load chat components
- Optimize video rendering
- Preload next match during active call (if possible)
- Minimal DOM elements in video overlay

## Mobile-First Breakpoints
- **Mobile** (base): Single column, full-screen video, bottom controls
- **Tablet** (md:): Slightly larger video, side chat panel option
- **Desktop** (lg:): Centered video with flanking UI, keyboard shortcuts

This design creates an engaging, playful experience that puts video connections first while maintaining safety and ease of use.