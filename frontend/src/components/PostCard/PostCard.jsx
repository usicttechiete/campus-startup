import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentSection from '../CommentSection/CommentSection.jsx';
import { getLikeInfo, toggleLike } from '../../services/like.api.js';
import { deleteFeedPost } from '../../services/feed.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
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

const stageColors = {
  Ideation: 'bg-gray-100 text-gray-600',
  MVP: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-100/50',
  Scaling: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-teal-700 border border-teal-100/50',
};

const PostCard = ({ post, onPostDeleted }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const loadLikeInfo = async () => {
    try {
      const info = await getLikeInfo(actualPostId);
      setLikeCount(info.count);
      setIsLiked(info.isLiked);
    } catch (e) { /* ignore */ }
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await toggleLike(actualPostId);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (e) { /* ignore */ }
    setLikeLoading(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
      }
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async () => {
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
  };

  const handleViewProject = () => {
    if (!actualPostId) return;
    navigate(`/project/${actualPostId}`);
  };

  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header - Twitter style */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {initials || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{displayName}</span>
            {role && <span className="text-gray-500 text-xs">@{role.toLowerCase().replace(/\s+/g, '')}</span>}
            <span className="text-gray-400 text-xs">· {publishedTime}</span>
          </div>
          {/* Startup Name • College Name */}
          <div className="flex items-center gap-1.5 text-xs truncate max-w-full">
            <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent shrink-0">
              {title} 🚀
            </span>
            {college && (
              <>
                <span className="text-gray-300 shrink-0">•</span>
                <span className="text-gray-500 truncate min-w-0">{college}</span>
              </>
            )}
          </div>
        </div>

        {/* Stage badge & menu */}
        <div className="flex items-center gap-2">
          {stage && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stageColors[stage] || 'bg-gray-100 text-gray-600'}`}>
              {stage}
            </span>
          )}
          {isOwner && (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
                <MoreIcon className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 min-w-[100px]">
                  <button onClick={handleDelete} disabled={deleteLoading} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
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
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{title}</h3>
        {description && (
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
        )}
      </div>

      {/* Image */}
      {hasImage && (
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <img src={imageUrl} alt={title} loading="lazy" className="w-full h-auto max-h-80 object-cover" />
        </div>
      )}

      {/* Skills tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="text-xs text-gray-400">+{skills.length - 5} more</span>
          )}
        </div>
      )}

      {/* Actions - Twitter style */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${isLiked
            ? 'text-red-500 bg-red-50 hover:bg-red-100'
            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
        >
          <HeartIcon filled={isLiked} className="w-4 h-4" />
          <span className="font-medium">{likeCount || ''}</span>
        </button>

        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition"
        >
          <CommentIcon className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {postType === 'project' && (
          <button
            onClick={handleViewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition"
          >
            <span>View</span>
          </button>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-green-500 hover:bg-green-50 transition"
        >
          <ShareIcon className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Modal */}
      <CommentSection postId={actualPostId} isOpen={showComments} onClose={() => setShowComments(false)} />
    </article>
  );
};

export default PostCard;
