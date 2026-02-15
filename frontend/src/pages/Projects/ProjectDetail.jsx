import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import { createPostUpdate, fetchFeedPostById, fetchPostUpdates } from '../../services/feed.api.js';
import { formatName, formatRelativeTime, formatRole, formatSkills, getInitials } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesError, setUpdatesError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '' });
  const [updateSubmitting, setUpdateSubmitting] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let mounted = true;

    const loadProject = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchFeedPostById(projectId);
        if (mounted) {
          setProject(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load project');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProject();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const loadUpdates = useCallback(async () => {
    if (!projectId) return;
    setUpdatesLoading(true);
    setUpdatesError('');
    try {
      const res = await fetchPostUpdates(projectId);
      setUpdates(Array.isArray(res?.results) ? res.results : []);
    } catch (err) {
      setUpdates([]);
      setUpdatesError(err.message || 'Unable to load updates');
    } finally {
      setUpdatesLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const header = useMemo(() => {
    if (!project) return null;
    const authorData = project.author || project.authorProfile || {};
    const displayName = formatName(authorData.name);
    const role = formatRole(authorData.role);
    const initials = getInitials(displayName);
    const published = formatRelativeTime(project.created_at);

    return (
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              {initials || 'P'}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted">Posted by</p>
              <p className="text-base font-semibold text-body">{displayName}</p>
              {role && <p className="text-xs text-muted">{role}</p>}
              {published && <p className="text-xs text-muted">{published}</p>}
            </div>
          </div>
          {project.stage && <Badge variant="neutral">{project.stage}</Badge>}
        </div>
      </section>
    );
  }, [project]);

  const skills = formatSkills(project?.required_skills);

  const isOwner = Boolean(user?.id && project?.author_id && user.id === project.author_id);
  const collaborators = Array.isArray(project?.collaborators) ? project.collaborators : [];
  const isCollaborator = Boolean(
    user?.id && collaborators.some((c) => c.user_id === user.id || c.user?.id === user.id)
  );
  const canPostUpdate = isOwner || isCollaborator;

  const handleUpdateFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmitUpdate = useCallback(async (e) => {
    e.preventDefault();
    if (!projectId) return;
    if (updateSubmitting) return;

    setUpdateSubmitting(true);
    setUpdatesError('');
    try {
      await createPostUpdate(projectId, {
        title: updateForm.title,
        description: updateForm.description,
      });
      setUpdateForm({ title: '', description: '' });
      setShowUpdateForm(false);
      await loadUpdates();
    } catch (err) {
      setUpdatesError(err.message || 'Failed to post update');
    } finally {
      setUpdateSubmitting(false);
    }
  }, [projectId, updateForm.title, updateForm.description, updateSubmitting, loadUpdates]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary">
          ← Back
        </button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/internships')} className="rounded-full px-4">
          Browse internships
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader label="Loading project" />
        </div>
      )}

      {error && !loading && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          {error}
        </Card>
      )}

      {!loading && !error && project && (
        <div className="space-y-5">
          <section className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-white/70">Project</p>
            <h1 className="mt-2 text-2xl font-semibold">{project.title}</h1>
            {project.description && (
              <p className="mt-3 text-sm leading-relaxed text-white/80">{project.description}</p>
            )}
          </section>

          {header}

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Project type</h3>
              <p className="text-sm text-muted">{project.post_type || 'Project'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Collaboration</h3>
              <p className="text-sm text-muted">Looking for collaborators and feedback.</p>
            </Card>
          </section>

          {skills.length > 0 && (
            <Card className="space-y-3 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Skills needed</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <Card className="space-y-4 border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-body">Updates</h3>
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

            {showUpdateForm && canPostUpdate && (
              <form onSubmit={handleSubmitUpdate} className="space-y-3">
                <input
                  name="title"
                  required
                  value={updateForm.title}
                  onChange={handleUpdateFormChange}
                  placeholder="Update title"
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                />
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={updateForm.description}
                  onChange={handleUpdateFormChange}
                  placeholder="What changed since the last post?"
                  className="w-full rounded-xl border border-border bg-bg px-4 py-2 text-sm"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={updateSubmitting}>
                    {updateSubmitting ? 'Posting...' : 'Publish update'}
                  </Button>
                </div>
              </form>
            )}

            {updatesError && (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
                {updatesError}
              </div>
            )}

            {updatesLoading ? (
              <div className="flex justify-center py-6">
                <Loader label="Loading updates" />
              </div>
            ) : updates.length > 0 ? (
              <div className="space-y-3">
                {updates.map((u) => (
                  <div key={u.id || u.post_id} className="rounded-2xl border border-border bg-bg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-body">{u.title}</p>
                      <p className="text-xs text-muted">{formatRelativeTime(u.created_at)}</p>
                    </div>
                    {u.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{u.description}</p>
                    )}
                  </div>
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

export default ProjectDetail;
