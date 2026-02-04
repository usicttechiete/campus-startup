import { useState, useEffect } from 'react';
import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';
import Comment from '../Comment/Comment.jsx';
import { getComments, createComment } from '../../services/comment.api.js';

const CommentSection = ({ postId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
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
    
    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const comment = await createComment(postId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-t-3xl bg-card shadow-xl sm:rounded-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-semibold text-body">Comments</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-surface hover:text-body"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader label="Loading comments" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-danger">
              <p>{error}</p>
              <Button size="sm" variant="ghost" onClick={loadComments} className="mt-2">
                Try again
              </Button>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-1">
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

        {/* Comment Form */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={submitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? <Loader size="sm" inline /> : 'Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;