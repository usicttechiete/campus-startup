import { useState } from 'react';
import { formatRelativeTime, getInitials } from '../../utils/formatters.js';
import { deleteComment } from '../../services/comment.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const Comment = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      setIsDeleting(true);
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user?.id === comment.user_id;
  const authorName = comment.author?.name || 'Anonymous';
  const initials = getInitials(authorName);
  const timeAgo = formatRelativeTime(comment.created_at);

  return (
    <div className="flex gap-3 rounded-xl bg-bg-glass p-3 animate-fade-in">
      {/* Avatar */}
      <div className="avatar avatar-sm flex-shrink-0">
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-primary truncate">{authorName}</span>
          {timeAgo && <span className="text-[10px] text-text-muted">• {timeAgo}</span>}
        </div>

        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-2 flex items-center gap-1 text-[10px] text-text-muted hover:text-danger transition"
          >
            <TrashIcon className="h-3 w-3" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Comment;