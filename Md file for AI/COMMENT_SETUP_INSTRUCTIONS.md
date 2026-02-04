# Comment and Share Functionality Setup

## Database Setup

### Step 1: Create Comments Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create comments table with correct data types
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Features Implemented

### Comment Functionality:
- ✅ **View Comments**: Click "Comment" button to open comment modal
- ✅ **Add Comments**: Write and post new comments on any post
- ✅ **Delete Comments**: Authors can delete their own comments
- ✅ **Real-time Updates**: Comments appear immediately after posting
- ✅ **User Information**: Shows commenter's name, course, and year
- ✅ **Responsive Design**: Works on mobile and desktop

### Share Functionality:
- ✅ **Native Sharing**: Uses device's native share menu when available
- ✅ **Clipboard Fallback**: Copies post details to clipboard if native sharing unavailable
- ✅ **URL Fallback**: Copies page URL as final fallback
- ✅ **Error Handling**: Graceful fallbacks for different scenarios

## API Endpoints Added

### Comment Endpoints:
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `POST /api/posts/:postId/comments` - Create a new comment
- `DELETE /api/comments/:commentId` - Delete a comment (author only)

## Files Created/Modified

### Backend Files:
- `backend/models/Comment.js` - Comment database operations
- `backend/controllers/comment.controller.js` - Comment API logic
- `backend/routes/comment.routes.js` - Comment API routes
- `backend/app.js` - Added comment routes
- `backend/models/Post.js` - Added comment count support
- `backend/create-comments-table.sql` - Database migration

### Frontend Files:
- `frontend/src/services/comment.api.js` - Comment API client
- `frontend/src/components/Comment/Comment.jsx` - Individual comment component
- `frontend/src/components/CommentSection/CommentSection.jsx` - Comment modal
- `frontend/src/components/PostCard/PostCard.jsx` - Updated with functional buttons

## How to Test

### Comment Feature:
1. Go to the Home page with posts
2. Click the "Comment" button on any post
3. A modal will open showing existing comments
4. Type a comment and click "Post"
5. Your comment should appear immediately
6. Try deleting your own comment (delete button only appears for your comments)

### Share Feature:
1. Click the "Share" button on any post
2. On mobile: Native share menu should appear
3. On desktop: Post details copied to clipboard
4. If clipboard fails: Page URL copied instead

## Database Schema

The comments table structure:
```
comments
├── id (BIGSERIAL, Primary Key)
├── post_id (BIGINT, Foreign Key → posts.id)
├── user_id (UUID, Foreign Key → users.id)
├── content (TEXT, NOT NULL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Security Features

- **Authentication Required**: All comment operations require valid JWT
- **Author-only Deletion**: Users can only delete their own comments
- **Content Validation**: Comments cannot be empty
- **SQL Injection Protection**: Using parameterized queries
- **XSS Protection**: Content is properly escaped in UI

## Error Handling

- **Network Errors**: Graceful error messages and retry options
- **Validation Errors**: Clear feedback for invalid input
- **Permission Errors**: Appropriate messages for unauthorized actions
- **Loading States**: Visual feedback during API operations

The comment and share functionality is now fully functional and ready to use!