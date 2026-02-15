import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import {
  createPostUpdate,
  fetchFeedPostById,
  fetchPostUpdates,
} from '../../services/feed.api.js';
import { formatName, formatRelativeTime, formatRole, getInitials } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';

const UpdateDetail = () => {
  const { id: updateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [updatePost, setUpdatePost] = useState(null);
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesError, setUpdatesError] = useState('');

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', stage: 'Ideation', required_skills: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!updateId) return;
    let mounted = true;

    const loadUpdate = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchFeedPostById(updateId);
        if (!mounted) return;
        setUpdatePost(data);
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load update');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUpdate();
    return () => {
      mounted = false;
    };
  }, [updateId]);

  const parentPostId = updatePost?.parent_post_id;

  useEffect(() => {
    if (!parentPostId) return;
    let mounted = true;

    const loadProject = async () => {
      try {
        const data = await fetchFeedPostById(parentPostId);
        if (!mounted) return;
        setProject(data);
      } catch (err) {
        if (mounted) {
          setProject(null);
        }
      }
    };

    loadProject();
    return () => {
      mounted = false;
    };
  }, [parentPostId]);

  const loadUpdates = useCallback(async () => {
    if (!parentPostId) return;
    setUpdatesLoading(true);
    setUpdatesError('');
    try {
      const res = await fetchPostUpdates(parentPostId);
      setUpdates(Array.isArray(res?.results) ? res.results : []);
    } catch (err) {
      setUpdates([]);
      setUpdatesError(err.message || 'Unable to load updates');
    } finally {
      setUpdatesLoading(false);
    }
  }, [parentPostId]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const isOwner = Boolean(user?.id && project?.author_id && user.id === project.author_id);
  const collaborators = Array.isArray(project?.collaborators) ? project.collaborators : [];
  const isCollaborator = Boolean(
    user?.id && collaborators.some((c) => c.user_id === user.id || c.user?.id === user.id)
  );
  const canPostUpdate = isOwner || isCollaborator;

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!parentPostId) return;
    if (submitting) return;

    setSubmitting(true);
    setUpdatesError('');

    try {
      await createPostUpdate(parentPostId, {
        title: updateForm.title,
        description: updateForm.description,
        stage: updateForm.stage,
        required_skills: updateForm.required_skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setUpdateForm({ title: '', description: '', stage: 'Ideation', required_skills: '' });
      setShowUpdateForm(false);
      await loadUpdates();
    } catch (err) {
      setUpdatesError(err.message || 'Failed to post update');
    } finally {
      setSubmitting(false);
    }
  }, [loadUpdates, parentPostId, submitting, updateForm.description, updateForm.required_skills, updateForm.stage, updateForm.title]);

  const header = useMemo(() => {
    const authorData = updatePost?.author || updatePost?.authorProfile || {};
    const displayName = formatName(authorData.name) || 'Anonymous';
    const role = formatRole(authorData.role);
    const initials = getInitials(displayName);
    const published = formatRelativeTime(updatePost?.created_at);

    return (
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              {initials || 'U'}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted">Update by</p>
              <p className="text-base font-semibold text-body">{displayName}</p>
              {role && <p className="text-xs text-muted">{role}</p>}
              {published && <p className="text-xs text-muted">{published}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }, [updatePost]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary">
          ← Back
        </button>
        {parentPostId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/project/${parentPostId}`)}
            className="rounded-full px-4"
          >
            View project
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader label="Loading update" />
        </div>
      )}

      {error && !loading && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          {error}
        </Card>
      )}

      {!loading && !error && updatePost && (
        <div className="space-y-5">
          <section className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-white/70">Update</p>
            <h1 className="mt-2 text-2xl font-semibold">{updatePost.title}</h1>
            {updatePost.description && (
              <p className="mt-3 text-sm leading-relaxed text-white/80">{updatePost.description}</p>
            )}
          </section>

          {header}

          <Card className="space-y-4 border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-body">Post another update</h3>
              {canPostUpdate && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowUpdateForm((prev) => !prev)}
                  className="rounded-full px-4"
                >
                  {showUpdateForm ? 'Close' : 'Post update'}
                </Button>
              )}
            </div>

            {!canPostUpdate && (
              <p className="text-sm text-muted">
                Only the project author or collaborators can post updates.
              </p>
            )}

            {showUpdateForm && canPostUpdate && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="title"
                  required
                  value={updateForm.title}
                  onChange={handleFormChange}
                  placeholder="Update title"
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                />
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={updateForm.description}
                  onChange={handleFormChange}
                  placeholder="What changed since the last post?"
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="stage"
                    value={updateForm.stage}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="MVP">MVP</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                  <input
                    name="required_skills"
                    value={updateForm.required_skills}
                    onChange={handleFormChange}
                    placeholder="Skills (comma sep)"
                    className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Publish update'}
                  </Button>
                </div>
              </form>
            )}

            {updatesError && (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
                {updatesError}
              </div>
            )}
          </Card>

          <Card className="space-y-4 border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-body">All updates for this project</h3>
              {parentPostId && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadUpdates}
                  className="rounded-full px-4"
                >
                  Refresh
                </Button>
              )}
            </div>

            {updatesLoading ? (
              <div className="flex justify-center py-6">
                <Loader label="Loading updates" />
              </div>
            ) : updates.length > 0 ? (
              <div className="space-y-3">
                {updates.map((u) => (
                  <button
                    type="button"
                    key={u.id || u.post_id}
                    onClick={() => navigate(`/update/${u.id || u.post_id}`)}
                    className={`w-full rounded-2xl border border-border p-4 text-left transition ${
                      (u.id || u.post_id) === updateId ? 'bg-bg-subtle' : 'bg-bg hover:bg-bg-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-body">{u.title}</p>
                      <p className="text-xs text-muted">{formatRelativeTime(u.created_at)}</p>
                    </div>
                    {u.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{u.description}</p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No updates yet.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default UpdateDetail;
