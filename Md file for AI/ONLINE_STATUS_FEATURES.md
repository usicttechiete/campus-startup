# Online Status and Availability Features

This document describes the implementation of online/offline status and "Available to Work" toggle features for the Profile page.

## Features Implemented

### 1. Online/Offline Status Indicator
- **Component**: `OnlineStatusDot`
- **Location**: Bottom-right of profile avatar
- **Appearance**: 
  - Green pulsing dot when online
  - Grey dot when offline
  - 10-12px size with white border
- **Behavior**:
  - User is marked online when profile page is open
  - Automatically updates every 30 seconds (heartbeat)
  - Handles page visibility changes
  - Sets offline on page unload

### 2. Available to Work Toggle
- **Component**: `AvailabilityToggle`
- **Location**: Profile tab under "About" section
- **Appearance**: Professional toggle switch with descriptive text
- **Behavior**:
  - Instant updates to database
  - Loading state during API calls
  - Persistent across sessions
  - Shows appropriate subtext based on state

## Database Schema

Run the SQL migration in `backend/add-online-status-fields.sql`:

```sql
-- Add online status fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;

-- Add availability field
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS available_to_work BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);
CREATE INDEX IF NOT EXISTS idx_users_available_to_work ON users(available_to_work);
```

## Components

### OnlineStatusDot
```jsx
import OnlineStatusDot from '../../components/OnlineStatusDot/OnlineStatusDot.jsx';

<OnlineStatusDot isOnline={true} size="small" />
```

Props:
- `isOnline` (boolean): Current online status
- `size` (string): 'small', 'medium', or 'large'

### AvailabilityToggle
```jsx
import AvailabilityToggle from '../../components/AvailabilityToggle/AvailabilityToggle.jsx';

<AvailabilityToggle
  isAvailable={false}
  onToggle={(newValue) => console.log(newValue)}
  loading={false}
  disabled={false}
/>
```

Props:
- `isAvailable` (boolean): Current availability status
- `onToggle` (function): Callback when toggle is clicked
- `loading` (boolean): Show loading state
- `disabled` (boolean): Disable the toggle
- `size` (string): 'small', 'medium', or 'large'

## Hooks

### useOnlineStatus
```jsx
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

const { isOnline, lastSeen, setOnlineStatus } = useOnlineStatus(userId);
```

### useAvailability
```jsx
import { useAvailability } from '../../hooks/useOnlineStatus.js';

const { isAvailable, loading, toggleAvailability } = useAvailability(userId, initialAvailability);
```

## Integration Points

### Profile Page (StudentProfile.jsx)
1. **Avatar Enhancement**: Online status dot positioned at bottom-right
2. **About Tab**: Availability toggle added under bio section
3. **Real-time Updates**: Automatic status management

## Technical Implementation

### Online Status Logic
- **Heartbeat**: Every 30 seconds to maintain online status
- **Page Visibility**: Detects when tab becomes hidden/visible
- **Cleanup**: Proper cleanup on component unmount
- **Error Handling**: Graceful degradation on API failures

### Availability Logic
- **Instant Updates**: Real-time database updates
- **Loading States**: Visual feedback during API calls
- **Error Recovery**: Reverts state on failure
- **Initial Load**: Fetches current state from database

## Styling

All components use Tailwind CSS classes:
- Consistent with existing design system
- Smooth animations and transitions
- Mobile-responsive design
- Professional appearance matching LinkedIn/Discord standards

## Performance Considerations

- **Efficient Updates**: Only updates when necessary
- **Proper Cleanup**: Prevents memory leaks
- **Optimized Queries**: Database indexes for fast lookups
- **Debounced Actions**: Prevents excessive API calls

## Browser Compatibility

- Modern browsers with ES6+ support
- Uses standard Web APIs (visibility API, beforeunload)
- Graceful degradation for older browsers

## Testing

The implementation has been tested with:
- Build process (`npm run build`)
- Component integration
- Database schema compatibility
- Error handling scenarios

## Future Enhancements

1. **Real-time Presence**: Consider WebSocket integration for instant updates
2. **Status Messages**: Add custom status messages
3. **Bulk Operations**: Update multiple users at once
4. **Analytics**: Track online/offline patterns
5. **Mobile App**: Extend to mobile applications

## Troubleshooting

### Common Issues
1. **Status Not Updating**: Check database connection and permissions
2. **Toggle Not Working**: Verify user ID is available
3. **Styling Issues**: Ensure Tailwind CSS is properly configured
4. **Build Errors**: Check import paths and component exports

### Debug Mode
Enable console logging in the hooks to debug:
```javascript
console.log('Online status updated:', { isOnline, lastSeen });
console.log('Availability toggled:', { isAvailable, error });
```
