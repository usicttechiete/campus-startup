import { Suspense, lazy, useEffect, useState, useMemo, useCallback } from 'react';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import PullToRefresh from '../../components/PullToRefresh/PullToRefresh.jsx';
import { createFeedPost } from '../../services/feed.api.js';
import useFeedPosts from '../../hooks/useFeedPosts.js';

const JobsSuggestions = lazy(() => import('../../components/JobsSuggestions/JobsSuggestions.jsx'));
const StartupsSuggestions = lazy(() => import('../../components/StartupsSuggestions/StartupsSuggestions.jsx'));

const postTypes = [
  { label: 'Projects', value: 'project' },
  { label: 'Updates', value: 'work_update' },
];

const stageFilters = [
  { label: 'All', value: 'all' },
  { label: 'Ideation', value: 'Ideation' },
  { label: 'MVP', value: 'MVP' },
  { label: 'Scaling', value: 'Scaling' },
];

const initialFormState = {
  title: '',
  description: '',
  stage: 'Ideation',
  required_skills: '',
  post_type: 'project',
};

// Icons
const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const Home = () => {
  const { posts, loading, error, filters, loadPosts } = useFeedPosts();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts({ stage: 'all', post_type: 'project' });
  }, []);

  const handleFilterChange = useCallback((stageValue) => {
    loadPosts({ stage: stageValue });
  }, [loadPosts]);

  const handleRefresh = useCallback(() => loadPosts(), [loadPosts]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCreatePost = useCallback(async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const postData = {
        title: form.title,
        description: form.description,
        post_type: form.post_type,
      };
      if (form.post_type !== 'work_update') {
        postData.stage = form.stage;
        postData.required_skills = form.required_skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      await createFeedPost(postData);
      setShowForm(false);
      setForm(initialFormState);
      loadPosts();
    } catch (err) {
      setFormError(err.message || 'Failed to create post');
    }
    setFormLoading(false);
  }, [form, loadPosts]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleShowForm = useCallback(() => setShowForm(true), []);
  const handleCloseForm = useCallback(() => setShowForm(false), []);

  const handlePostTypeChange = useCallback((typeValue) => {
    loadPosts({ post_type: typeValue, stage: typeValue === 'work_update' ? 'all' : filters?.stage });
  }, [loadPosts, filters?.stage]);

  const handleFormTypeChange = useCallback((typeValue) => {
    setForm((prev) => ({ ...prev, post_type: typeValue }));
  }, []);

  const handleModalClick = useCallback((e) => e.stopPropagation(), []);
  const handleModalFormClick = useCallback((e) => e.stopPropagation(), []);

  // Client-side search filter: match title and description (case-insensitive)
  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }, [posts, searchTerm]);

  // Fixed positions: Jobs after 2nd post, Startups after 5th (predictable UX)
  const suggestionPositions = { jobs: 2, startups: 5 };

  const getFormTitle = useCallback(() => {
    const types = { startup_idea: 'Share Idea', project: 'Share Project', work_update: 'Post Update' };
    return types[form.post_type] || 'Create Post';
  }, [form.post_type]);

  // Render feed with suggestion sections inserted at fixed positions
  const renderFeed = useMemo(() => {
    const elements = [];
    let jobsInserted = false;
    let startupsInserted = false;

    filteredPosts.forEach((post, index) => {
      // Insert Jobs suggestions at designated position
      if (!jobsInserted && index === suggestionPositions.jobs) {
        elements.push(
          <Suspense key="jobs-suggestions" fallback={null}>
            <JobsSuggestions />
          </Suspense>
        );
        jobsInserted = true;
      }

      // Insert Startups suggestions at designated position
      if (!startupsInserted && index === suggestionPositions.startups) {
        elements.push(
          <Suspense key="startups-suggestions" fallback={null}>
            <StartupsSuggestions />
          </Suspense>
        );
        startupsInserted = true;
      }

      elements.push(
        <PostCard
          key={post.post_id || post.id}
          post={post}
          onPostDeleted={() => loadPosts()}
          onPostCollaborated={() => loadPosts()}
        />
      );
    });

    // If we didn't have enough posts, still show suggestions at the end
    if (!jobsInserted && filteredPosts.length >= 1) {
      elements.push(
        <Suspense key="jobs-suggestions" fallback={null}>
          <JobsSuggestions />
        </Suspense>
      );
    }
    if (!startupsInserted && filteredPosts.length >= 2) {
      elements.push(
        <Suspense key="startups-suggestions" fallback={null}>
          <StartupsSuggestions />
        </Suspense>
      );
    }

    return elements;
  }, [filteredPosts, loadPosts]);

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-app mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-text-primary">Feed</h1>
              <button
                onClick={handleShowForm}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition active:scale-95"
              >
                <PlusIcon className="w-4 h-4" />
                Post
              </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  onClick={() => { /* Potential search trigger logic */ }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-bg-subtle transition-all z-10"
                  aria-label="Search"
                >
                  <SearchIcon className="w-4 h-4 text-text-muted" />
                </button>
                <input
                  type="text"
                  placeholder="Search ideas, projects..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && console.log('Searching:', searchTerm)}
                  className="w-full bg-bg-subtle border-0 rounded-full py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:bg-white transition"
                />
              </div>
              <button
                onClick={() => console.log('Searching:', searchTerm)}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 active:scale-95 transition"
              >
                Search
              </button>
            </div>

            {/* Post Type Tabs */}
            <div className="flex border-b border-border">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handlePostTypeChange(type.value)}
                  className={`flex-1 py-3 text-sm font-semibold transition relative ${filters?.post_type === type.value
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                    }`}
                >
                  {type.label}
                  {filters?.post_type === type.value && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </header>

          {/* Stage Filter Pills */}
          {filters?.post_type !== 'work_update' && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {stageFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition ${filters?.stage === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-bg-subtle text-text-secondary hover:bg-border'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* Feed */}
          {loading && !posts.length ? (
            <div className="flex justify-center py-12">
              <Loader label="Loading feed" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          ) : (
            <PullToRefresh onRefresh={handleRefresh} disabled={loading}>
              {posts.length > 0 ? (
                filteredPosts.length > 0 ? (
                  <div className="space-y-4">{renderFeed}</div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-text-secondary text-sm">No matches for &quot;{searchTerm}&quot;</p>
                    <p className="text-text-muted text-xs mt-1">Try a different search term</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🌟</div>
                  <p className="text-text-secondary text-sm mb-2">No posts yet. Be the first!</p>
                  <p className="text-text-muted text-xs mb-4">Share a project idea or post an update to get started.</p>
                  <Button onClick={handleShowForm}>Create Post</Button>
                </div>
              )}
            </PullToRefresh>
          )}

          {/* Create Post Modal */}
          {showForm && (
            <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={handleCloseForm}>
              <div className="w-full max-w-[480px] bg-bg-elevated rounded-t-3xl animate-slide-up" onClick={handleModalFormClick}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-bold text-text-primary">{getFormTitle()}</h2>
                  <button onClick={handleCloseForm} className="p-2 rounded-full hover:bg-bg-subtle">
                    <CloseIcon className="w-5 h-5 text-text-muted" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreatePost} className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Post Type */}
                  <div className="flex gap-2">
                    {postTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={handleFormTypeChange}
                        className={`flex-1 py-2 text-xs font-semibold rounded-full transition ${form.post_type === type.value
                          ? 'bg-primary text-white'
                          : 'bg-bg-subtle text-text-secondary'
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <input
                    name="title"
                    required
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="What's your idea about?"
                    className="w-full bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />

                  {/* Description */}
                  <textarea
                    name="description"
                    rows={3}
                    required
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Tell us more..."
                    className="w-full bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />

                  {/* Stage & Skills */}
                  {form.post_type !== 'work_update' && (
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="stage"
                        value={form.stage}
                        onChange={handleFormChange}
                        className="bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm"
                      >
                        <option value="Ideation">Ideation</option>
                        <option value="MVP">MVP</option>
                        <option value="Scaling">Scaling</option>
                      </select>
                      <input
                        name="required_skills"
                        value={form.required_skills}
                        onChange={handleFormChange}
                        placeholder="Skills (comma sep)"
                        className="bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  )}

                  {formError && <p className="text-sm text-red-600">{formError}</p>}
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <Button type="submit" className="w-full" onClick={handleCreatePost} disabled={formLoading}>
                    {formLoading ? <Loader size="sm" inline /> : 'Publish'}
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;
