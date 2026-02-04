# Like Functionality Setup

## Database Setup

### Step 1: Create Likes Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Prevent duplicate likes from same user on same post
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);
```

## Features Implemented

### Like Functionality:
- ✅ **Toggle Like**: Click heart button to like/unlike posts
- ✅ **Visual Feedback**: Heart fills with red color when liked
- ✅ **Like Count**: Shows number of likes on each post
- ✅ **Real-time Updates**: Like count updates immediately
- ✅ **Prevent Duplicates**: Users can only like a post once
- ✅ **Persistent State**: Like status persists across sessions
- ✅ **Loading States**: Button disabled during API calls

### User Experience:
- ✅ **Instant Feedback**: Heart animation and color change
- ✅ **Smart Labels**: Shows "1 Like" vs "2 Likes" correctly
- ✅ **Error Handling**: Graceful error messages
- ✅ **Optimistic Updates**: UI updates before server confirmation

## API Endpoints Added

### Like Endpoints:
- `GET /api/posts/:postId/likes` - Get all likes for a post
- `GET /api/posts/:postId/like-info` - Get like count and user's like status
- `POST /api/posts/:postId/like` - Toggle like on a post (like/unlike)

## Files Created/Modified

### Backend Files:
- `backend/models/Like.js` - Like database operations
- `backend/controllers/like.controller.js` - Like API logic
- `backend/routes/like.routes.js` - Like API routes
- `backend/app.js` - Added like routes
- `backend/models/Post.js` - Added like count support
- `backend/create-likes-table.sql` - Database migration

### Frontend Files:
- `frontend/src/services/like.api.js` - Like API client
- `frontend/src/components/PostCard/PostCard.jsx` - Updated with like button

## How to Test

### Like Feature:
1. Go to the Home page with posts
2. Click the heart button on any post
3. Heart should fill with red color and count should increase
4. Click again to unlike - heart becomes outline and count decreases
5. Refresh page - like status should persist
6. Try liking from different user accounts

### Button States:
- **Unliked**: Empty heart outline, gray color
- **Liked**: Filled heart, red color
- **Loading**: Button disabled during API call

## Database Schema

The likes table structure:
```
likes
├── id (BIGSERIAL, Primary Key)
├── post_id (BIGINT, Foreign Key → posts.id)
├── user_id (UUID, Foreign Key → users.id)
├── created_at (TIMESTAMP)
└── UNIQUE constraint on (post_id, user_id)
```

## Security Features

- **Authentication Required**: All like operations require valid JWT
- **Duplicate Prevention**: Database constraint prevents multiple likes from same user
- **Data Validation**: Post ID and User ID validation
- **SQL Injection Protection**: Using parameterized queries

## Performance Optimizations

- **Database Indexes**: Optimized queries on post_id, user_id, and created_at
- **Efficient Queries**: Single query to get both like count and user status
- **Unique Constraints**: Prevents duplicate data at database level
- **Optimistic Updates**: UI updates immediately for better UX

## Error Handling

- **Network Errors**: Graceful error messages and state restoration
- **Duplicate Likes**: Handled by database constraint
- **Invalid Post IDs**: Proper error responses
- **Loading States**: Visual feedback during operations

## Button Layout

The action buttons now appear in this order:
1. **❤️ Like** (with count) - Red when liked, gray when not
2. **💬 Comment** (with count) - Opens comment modal
3. **📤 Share** - Native sharing or clipboard fallback

The like functionality is now fully functional and ready to use!