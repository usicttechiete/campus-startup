import { Suspense, lazy, useEffect, useState } from 'react';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import { createFeedPost } from '../../services/feed.api.js';
import useFeedPosts from '../../hooks/useFeedPosts.js';

const stageFilters = [
  { label: 'All', value: 'all' },
  { label: 'Ideation', value: 'Ideation' },
  { label: 'MVP', value: 'MVP' },
  { label: 'Scaling', value: 'Scaling' },
];

const postTypes = [
  { label: 'Startup Ideas', value: 'startup_idea' },
  { label: 'Projects', value: 'project' },
  { label: 'Work Updates', value: 'work_update' },
];

const initialFormState = {
  title: '',
  description: '',
  stage: 'Ideation',
  required_skills: '',
  post_type: 'startup_idea',
};

const HomeQuickScroll = lazy(() => import('../../components/HomeQuickScroll/HomeQuickScroll.jsx'));

const Home = () => {
  const { posts, loading, error, filters, loadPosts } = useFeedPosts();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Initial load
  useEffect(() => {
    // Only load if we haven't loaded yet, or strictly rely on the hook's state
    // Actually, hook manages state, just trigger initial load with default if needed, 
    // or let the hook's default state handle it? 
    // The hook doesn't auto-load, so we must call loadPosts.
    loadPosts({ stage: 'all', post_type: 'startup_idea' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleFilterChange = (stageValue) => {
    // User clicked a Stage filter (Ideation, MVP, Scaling)
    loadPosts({ stage: stageValue });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const postData = {
        title: form.title,
        description: form.description,
        post_type: form.post_type,
      };

      // Only add stage and skills for startup ideas and projects
      if (form.post_type === 'startup_idea' || form.post_type === 'project') {
        postData.stage = form.stage;
        postData.required_skills = form.required_skills.split(',').map((skill) => skill.trim()).filter(Boolean);
      }

      await createFeedPost(postData);
      setShowForm(false);
      setForm(initialFormState);
      loadPosts();
    } catch (err) {
      setFormError(err.message || 'Failed to create post');
    } finally {
      setFormLoading(false);
    }
  };

  const getFormTitle = () => {
    switch (form.post_type) {
      case 'startup_idea':
        return 'Share a new startup idea';
      case 'project':
        return 'Share a new project';
      case 'work_update':
        return 'Share a work update';
      default:
        return 'Share a new post';
    }
  };

  const getFormDescription = () => {
    switch (form.post_type) {
      case 'startup_idea':
        return 'Highlight your startup idea to invite collaborators.';
      case 'project':
        return 'Share your project to find team members.';
      case 'work_update':
        return 'Update your network about your work progress.';
      default:
        return 'Share something with your network.';
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    // Refresh the feed after a post is deleted
    loadPosts();
  };

  const shouldShowQuickScroll = !isSearchFocused && !searchTerm.trim();

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-body">
            Feed
          </h1>

          <div className="flex items-center gap-2">
            {/* Search icon */}
            <button
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              aria-label="Search"
            >
              🔍
            </button>

            {/* Add post */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Post Type Tabs */}
        <div className="flex gap-1 rounded-2xl bg-surface p-1">
          {postTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                const newFilters = { post_type: type.value };
                if (type.value === 'work_update') newFilters.stage = 'all';
                loadPosts(newFilters);
              }}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${filters?.post_type === type.value
                ? 'bg-primary text-white'
                : 'text-muted hover:text-body'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search ideas, projects, people"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </header>

      {shouldShowQuickScroll && (
        <Suspense fallback={null}>
          <HomeQuickScroll />
        </Suspense>
      )}


      {showForm && (
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{getFormTitle()}</h2>
            <p className="text-sm text-muted">{getFormDescription()}</p>
          </div>
          <form className="space-y-4" onSubmit={handleCreatePost}>
            {/* Post Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted" htmlFor="post_type">
                Post Type
              </label>
              <select
                id="post_type"
                name="post_type"
                value={form.post_type}
                onChange={handleFormChange}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="startup_idea">Startup Ideas</option>
                <option value="project">Projects</option>
                <option value="work_update">Work Updates</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                value={form.title}
                onChange={handleFormChange}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder={
                  form.post_type === 'startup_idea'
                    ? 'e.g. AI Study Buddy'
                    : form.post_type === 'project'
                      ? 'e.g. E-commerce Website'
                      : 'e.g. Completed React Dashboard'
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={form.description}
                onChange={handleFormChange}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder={
                  form.post_type === 'startup_idea'
                    ? 'Describe your idea, goals, and what you need'
                    : form.post_type === 'project'
                      ? 'Describe your project, tech stack, and team needs'
                      : 'Share your progress, achievements, or learnings'
                }
              />
            </div>

            {/* Conditional fields for startup ideas and projects */}
            {(form.post_type === 'startup_idea' || form.post_type === 'project') && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted" htmlFor="stage">
                    Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={form.stage}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="MVP">MVP</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted" htmlFor="required_skills">
                    Required Skills
                  </label>
                  <input
                    id="required_skills"
                    name="required_skills"
                    value={form.required_skills}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Separate multiple skills with commas"
                  />
                </div>
              </div>
            )}

            {formError && <p className="text-sm text-danger">{formError}</p>}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={formLoading}>
                {formLoading ? <Loader size="sm" label="Posting" inline /> : 'Publish'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {filters?.post_type !== 'work_update' && (
        <FilterBar filters={stageFilters} activeFilter={filters?.stage || 'all'} onFilterChange={handleFilterChange} />
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader label="Loading feed" />
        </div>
      ) : error ? (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{error}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.post_id || post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}

          {!posts.length && (
            <Card className="text-center text-sm text-muted">
              No projects found for this filter yet. Try exploring other stages or share something new.
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
