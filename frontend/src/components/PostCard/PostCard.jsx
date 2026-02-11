import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentSection from '../CommentSection/CommentSection.jsx';
import { getLikeInfo, toggleLike } from '../../services/like.api.js';
import { deleteFeedPost, joinFeedPost } from '../../services/feed.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  formatName,
  formatRole,
  formatSkills,
  formatRelativeTime,
  getInitials,
} from '../../utils/formatters.js';

// Twitter/Reddit-style icons
const HeartIcon = ({ filled, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ShareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const MoreIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const ThumbsUpIcon = ({ filled, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const stageColors = {
  Ideation: 'bg-bg-subtle text-text-secondary',
  MVP: 'bg-gradient-to-r from-bg-subtle to-bg-subtle text-primary border border-border',
  Scaling: 'bg-gradient-to-r from-bg-subtle to-bg-subtle text-primary border border-border',
};

const PostCard = ({ post, onPostDeleted, onPostCollaborated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useNotification();
  const [showComments, setShowComments] = useState(false);
  const [showLetsBuildConfirm, setShowLetsBuildConfirm] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [collabLoading, setCollabLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  if (!post) return null;

  const {
    id: postId,
    post_id,
    author_id: authorId,
    author,
    authorProfile,
    title,
    description,
    post_type: postType,
    stage,
    required_skills: requiredSkills,
    image_url: imageUrl,
    created_at: createdAt,
  } = post;

  const actualPostId = postId || post_id;
  const isOwner = user && authorId && user.id === authorId;
  const collaborators = post.collaborators || [];
  const isCollaborator =
    hasJoined ||
    (user?.id && collaborators.some((c) => c.user_id === user.id || c.user?.id === user.id));
  const authorData = author || authorProfile;

  const displayName = formatName(authorData?.name) || 'Anonymous';
  const role = formatRole(authorData?.role);
  const college = authorData?.college;
  const publishedTime = formatRelativeTime(createdAt);
  const skills = formatSkills(requiredSkills);
  const initials = getInitials(displayName);
  const hasImage = imageUrl && imageUrl.trim().length > 0;

  useEffect(() => {
    if (actualPostId) loadLikeInfo();
  }, [actualPostId]);

  useEffect(() => {
    if (user?.id && Array.isArray(post?.collaborators)) {
      const joined = post.collaborators.some((c) => c.user_id === user.id || c.user?.id === user.id);
      setHasJoined(joined);
    }
  }, [post?.collaborators, user?.id]);

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const loadLikeInfo = useCallback(async () => {
    try {
      const info = await getLikeInfo(actualPostId);
      setLikeCount(info.count);
      setIsLiked(info.isLiked);
    } catch (e) { /* ignore */ }
  }, [actualPostId]);

  const handleLike = useCallback(async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await toggleLike(actualPostId);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (e) { /* ignore */ }
    setLikeLoading(false);
  }, [likeLoading, actualPostId]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
      }
    } catch (e) { /* ignore */ }
  }, [title, description]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleteLoading(true);
    try {
      await deleteFeedPost(actualPostId);
      onPostDeleted?.(actualPostId);
    } catch (e) {
      alert('Failed to delete');
    }
    setDeleteLoading(false);
    setShowMenu(false);
  }, [actualPostId, onPostDeleted]);

  const handleCardClick = useCallback(() => {
    if (!actualPostId) return;
    navigate(`/project/${actualPostId}`);
  }, [actualPostId, navigate]);

  const handleLetsBuildConfirm = useCallback(() => {
    setShowLetsBuildConfirm(true);
  }, []);

  const handleLetsBuild = useCallback(async () => {
    if (!actualPostId || collabLoading || isOwner) return;
    setShowLetsBuildConfirm(false);
    setCollabLoading(true);
    try {
      await joinFeedPost(actualPostId, {});
      setHasJoined(true);
      onPostCollaborated?.();
      notify({ message: "You're in! The poster will see your request.", variant: 'success' });
    } catch (e) {
      notify({ message: e?.message || 'Could not join. You may have already joined.', variant: 'error' });
    }
    setCollabLoading(false);
  }, [actualPostId, collabLoading, isOwner, onPostCollaborated, notify]);

  const showLetsBuild = (postType === 'project' || postType === 'startup_idea') && !isOwner;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  const handleMenuClick = useCallback((e) => e.stopPropagation(), []);
  const handleCommentClick = useCallback((e) => { e.stopPropagation(); setShowComments(true); }, []);
  const handleLetsBuildClick = useCallback((e) => {
    e.stopPropagation();
    if (isCollaborator) return;
    handleLetsBuildConfirm();
  }, [isCollaborator, handleLetsBuildConfirm]);
  const handleShareClick = useCallback((e) => { e.stopPropagation(); handleShare(); }, [handleShare]);
  const handleConfirmClose = useCallback((e) => { e.stopPropagation(); setShowLetsBuildConfirm(false); }, []);
  const handleCancelClose = useCallback((e) => { e.stopPropagation(); setShowLetsBuildConfirm(false); }, []);
  const handleConfirmLetsBuild = useCallback((e) => { e.stopPropagation(); handleLetsBuild(); }, [handleLetsBuild]);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="bg-bg-elevated border border-border rounded-xl p-4 space-y-3 hover:shadow-card transition-shadow cursor-pointer active:bg-bg-subtle"
    >
      {/* Header - Twitter style */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text-primary text-sm">{displayName}</span>
            {role && <span className="text-text-secondary text-xs">@{role.toLowerCase().replace(/\s+/g, '')}</span>}
            <span className="text-text-muted text-xs">· {publishedTime}</span>
          </div>
          {/* Startup Name • College Name */}
          <div className="flex items-center gap-1.5 text-xs truncate max-w-full">
            <span className="font-bold bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent shrink-0">
              {title} 🚀
            </span>
            {college && (
              <>
                <span className="text-text-muted shrink-0">•</span>
                <span className="text-text-secondary truncate min-w-0">{college}</span>
              </>
            )}
          </div>
        </div>

        {/* Stage badge & menu */}
        <div className="flex items-center gap-2">
          {stage && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-xl ${stageColors[stage] || 'bg-bg-subtle text-text-secondary'}`}>
              {stage}
            </span>
          )}
          {isOwner && (
            <div className="relative" onClick={handleMenuClick}>
              <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-xl hover:bg-bg-subtle text-text-muted">
                <MoreIcon className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-bg-elevated border border-border rounded-xl shadow-card py-1 z-20 min-w-[100px]">
                  <button onClick={handleDelete} disabled={deleteLoading} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-bg-subtle">
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content - Reddit style */}
      <div className="space-y-2">
        <h3 className="font-semibold text-text-primary text-[15px] leading-snug break-words">{title}</h3>
        {description && (
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">{description}</p>
        )}
      </div>

      {/* Image */}
      {hasImage && (
        <div className="rounded-xl overflow-hidden border border-border">
          <img src={imageUrl} alt={title} loading="lazy" className="w-full h-auto max-h-80 object-cover" />
        </div>
      )}

      {/* Skills tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs bg-bg-subtle text-text-secondary px-2 py-0.5 rounded-xl">
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="text-xs text-text-muted">+{skills.length - 5} more</span>
          )}
        </div>
      )}

      {/* Actions - Twitter style */}
      <div className="flex items-center justify-start gap-2 pt-2 border-t border-border" onClick={handleMenuClick}>
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl transition min-w-[2.5rem] ${isLiked
            ? 'text-red-500 bg-red-50 hover:bg-red-100'
            : 'text-text-secondary hover:text-red-500 hover:bg-bg-subtle'
            }`}
        >
          <HeartIcon filled={isLiked} className="w-5 h-5 flex-shrink-0" />
          {likeCount > 0 && <span className="text-xs font-medium">{likeCount}</span>}
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-text-secondary hover:text-primary hover:bg-bg-subtle transition"
          aria-label="Comment"
        >
          <CommentIcon className="w-5 h-5" />
        </button>

        {showLetsBuild && (
          <button
            onClick={handleLetsBuildClick}
            disabled={collabLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition ${isCollaborator
              ? 'text-amber-600 bg-amber-50'
              : 'text-text-secondary hover:text-amber-600 hover:bg-bg-subtle'
              }`}
            aria-label="Let's Build"
          >
            <ThumbsUpIcon filled={isCollaborator} className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleShareClick}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-text-secondary hover:text-green-500 hover:bg-bg-subtle transition"
          aria-label="Share"
        >
          <ShareIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Modal */}
      <CommentSection postId={actualPostId} isOpen={showComments} onClose={() => setShowComments(false)} />

      {/* Let's Build confirmation */}
      {showLetsBuildConfirm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={handleConfirmClose}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-bg-elevated p-5 shadow-card"
            onClick={handleCancelClose}
          >
            <p className="text-sm font-medium text-text-primary">Join this project?</p>
            <p className="mt-1 text-xs text-text-secondary">
              The poster will get a notification and can see you want to build with them.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleCancelClose}
                className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold text-text-secondary hover:bg-bg-subtle"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLetsBuild}
                disabled={collabLoading}
                className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {collabLoading ? 'Joining...' : "Yes, I'm in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
