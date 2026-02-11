import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';
import Comment from '../Comment/Comment.jsx';
import { getComments, createComment } from '../../services/comment.api.js';

const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CommentSection = ({ postId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (postId) loadComments();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await createComment(postId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop z-[10000]" onClick={onClose}>
      <div
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-divider px-4 py-3">
          <h3 className="text-lg font-semibold text-text-primary">Comments</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-bg-glass hover:text-text-primary transition"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader label="Loading comments" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-danger mb-3">{error}</p>
              <Button size="sm" variant="ghost" onClick={loadComments}>
                Try again
              </Button>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-text-muted">No comments yet.</p>
              <p className="text-xs text-text-muted">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t border-divider p-4">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="input flex-1"
              disabled={submitting}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newComment.trim() || submitting}
              className="px-3"
            >
              {submitting ? (
                <Loader size="sm" inline />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommentSection;