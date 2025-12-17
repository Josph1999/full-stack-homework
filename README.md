# Cross-Tab Collaboration Dashboard

A real-time collaboration dashboard that synchronizes user activity across multiple browser tabs using the [react-broadcast-sync](https://www.npmjs.com/package/react-broadcast-sync) library.

## Features Implemented

### Core Features ✅
- ✅ Custom `useCollaborativeSession` hook with typed interface
- ✅ User presence system with join/leave detection
- ✅ Shared counter with last action tracking
- ✅ Real-time chat with typing indicators
- ✅ Message deletion with cross-tab sync
- ✅ Message expiration support (TTL)
- ✅ TypeScript with comprehensive type safety
- ✅ Proper error handling and cleanup

### Bonus Features ✅
- ✅ Theme sync across tabs (light/dark mode)
- ✅ Debouncing for cursor position updates
- ✅ Loading states with skeleton UI
- ✅ Fully responsive layout (mobile-first)
- ✅ Activity feed showing recent actions
- ✅ User avatar system with random colors
- ✅ Cursor position indicators across tabs

---

## Setup Instructions

### Prerequisites
- Node.js 18+ or compatible package manager (npm, pnpm, yarn)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open multiple browser tabs at [http://localhost:3000](http://localhost:3000) to test cross-tab synchronization

### Build for Production

```bash
npm run build
npm start
```

---

## Implementation Notes

### Architecture Overview

The application follows a modular architecture with clear separation of concerns:

```
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout with theme wrapper
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── activity-feed.tsx  # Activity log display
│   ├── app-wrapper.tsx    # Theme provider wrapper
│   ├── chat-panel.tsx     # Chat interface
│   ├── counter-panel.tsx  # Shared counter
│   ├── cursor-indicators.tsx # Remote cursor display
│   ├── dashboard.tsx      # Main dashboard container
│   ├── theme-provider.tsx # MUI theme configuration
│   └── user-list.tsx      # Active users display
├── hooks/
│   └── useCollaborativeSession.ts # Core collaboration hook
└── types/
    └── models.ts          # TypeScript type definitions
```

### Key Technical Decisions

#### 1. Custom Hook (`useCollaborativeSession`)
- **Location**: `hooks/useCollaborativeSession.ts`
- **Purpose**: Centralized state management and cross-tab synchronization
- **Features**:
  - Uses `react-broadcast-sync` for BroadcastChannel API abstraction
  - Manages all collaborative state (users, messages, counter, activities, theme, cursors)
  - Implements debouncing for high-frequency updates (cursor movements)
  - Handles message expiration with automatic cleanup
  - Prevents self-feedback loops by filtering own messages
  - Returns typed interface (`CollaborativeSessionReturn`)

#### 2. Type Safety
- **Location**: `types/models.ts`
- **Strategy**: Comprehensive TypeScript types for all data structures
- **Key Types**:
  - `User`, `ChatMessage`, `CounterState`, `Activity`, `CursorPosition`
  - Payload types for each broadcast message type
  - Union type `BroadcastMessagePayload` for type-safe message handling
  - `CollaborativeSessionReturn` interface for hook return type
- **Benefits**: Full IntelliSense support, compile-time error detection, self-documenting code

#### 3. State Synchronization
- **Initial Sync**: On mount, each tab broadcasts its current state
- **Incremental Updates**: Changes are broadcast immediately to other tabs
- **Deduplication**: JSON.stringify comparison prevents unnecessary re-renders
- **Message Filtering**: Each tab skips processing its own broadcasts using `senderId`

#### 4. Theme Management
- **Cross-tab Sync**: Custom event `theme-change` + localStorage
- **Persistence**: Theme preference saved to localStorage
- **SSR Compatibility**: `AppWrapper` prevents hydration mismatch with mounted state
- **MUI Integration**: Dynamic theme switching with `createTheme`

#### 5. Performance Optimizations
- **Debouncing**: Cursor movements debounced to 50ms to reduce message frequency
- **useCallback**: All action functions memoized to prevent unnecessary re-renders
- **Lazy Loading**: Components use fade-in animations for smooth UX
- **Skeleton Loading**: Initial 500ms loading state with skeleton UI

#### 6. User Experience
- **Responsive Design**: Mobile-first approach with MUI Grid breakpoints
- **Visual Feedback**:
  - Typing indicators show when users are typing
  - Activity feed logs all user actions
  - Cursor indicators show remote user positions
  - Fade animations for smooth transitions
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

### Data Flow

```
User Action → Component Handler → useCollaborativeSession Action
    ↓
Local State Update (optimistic)
    ↓
Broadcast to Other Tabs via BroadcastChannel
    ↓
Other Tabs Receive Message → Update Their State
    ↓
Re-render UI with New Data
```

### Edge Cases Handled

1. **Tab Closure**: Cleanup in useEffect return broadcasts `USER_LEAVE` and `left` activity
2. **Message Expiration**: setTimeout automatically deletes messages after TTL
3. **Self-feedback Prevention**: Messages filtered by `senderId` to prevent loops
4. **Undefined User Names**: Safe navigation operators (`?.`) prevent crashes
5. **Theme Flash**: Mounting guard prevents FOUC (Flash of Unstyled Content)
6. **Cursor Visibility**: Auto-hide after 3 seconds of inactivity

### Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.8
- **Styling**: Material-UI (MUI) v7 with Emotion
- **State Management**: React Hooks (useState, useCallback, useRef)
- **Cross-tab Communication**: react-broadcast-sync v1.6
- **ID Generation**: UUID v13
- **Testing**: Jest + React Testing Library

### Testing

Run tests:
```bash
npm test
```

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All browsers with BroadcastChannel API support

### Future Enhancements

- Persistent storage (IndexedDB/localStorage) for message history
- User authentication and real user profiles
- File sharing capabilities
- Voice/video call integration
- End-to-end encryption for messages
- Offline support with sync on reconnect

---

## Project Structure

```
full-stack-homework/
├── app/
│   ├── globals.css
│   ├── layout.tsx          # Root layout with AppWrapper
│   └── page.tsx            # Main dashboard page
├── components/
│   ├── activity-feed.tsx   # Activity log with icons
│   ├── app-wrapper.tsx     # Theme provider wrapper
│   ├── chat-panel.tsx      # Chat with typing indicators
│   ├── counter-panel.tsx   # Shared counter component
│   ├── cursor-indicators.tsx # Cursor position display
│   ├── dashboard.tsx       # Main layout container
│   ├── theme-provider.tsx  # MUI theme config
│   └── user-list.tsx       # Active users list
├── hooks/
│   └── useCollaborativeSession.ts # Core hook
├── types/
│   └── models.ts           # TypeScript definitions
├── __tests__/
│   └── example.test.tsx    # Test setup
├── jest.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## License

MIT
