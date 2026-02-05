import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import { fetchFeedPostById } from '../../services/feed.api.js';
import { formatName, formatRelativeTime, formatRole, formatSkills, getInitials } from '../../utils/formatters.js';

const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
