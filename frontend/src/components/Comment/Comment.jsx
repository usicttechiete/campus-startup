import { useState } from 'react';
import Button from '../Button/Button.jsx';
import { formatRelativeTime, getInitials } from '../../utils/formatters.js';
import { deleteComment } from '../../services/comment.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Comment = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user?.id === comment.user_id;
  const authorName = comment.author?.name || 'Anonymous';
  const initials = getInitials(authorName);
  const timeAgo = formatRelativeTime(comment.created_at);

  return (
    <div className="flex gap-3 py-3">
      <div className="flex-shrink-0">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
          {initials}
        </span>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-body">{authorName}</span>
          {comment.author?.course && comment.author?.year && (
            <span className="text-xs text-muted">
              {comment.author.course} • Year {comment.author.year}
            </span>
          )}
          {timeAgo && <span className="text-xs text-muted">• {timeAgo}</span>}
        </div>
        
        <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
        
        {isAuthor && (
          <div className="pt-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-danger hover:bg-danger/10"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;