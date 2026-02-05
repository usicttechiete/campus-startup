import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import { fetchInternshipById, applyToInternship } from '../../services/internship.api.js';
import { useNotification } from '../../context/NotificationContext.jsx';

const InternshipDetail = () => {
  const { id: internshipId } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    if (!internshipId) return;
    let mounted = true;

    const loadInternship = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchInternshipById(internshipId);
        if (mounted) {
          setInternship(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load internship');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInternship();
    return () => {
      mounted = false;
    };
  }, [internshipId]);

  const handleApply = async (event) => {
    event.preventDefault();
    if (!resumeLink) {
      notify({ message: 'Please add your resume link.', variant: 'error' });
      return;
    }
    setApplyLoading(true);
    setError('');
    try {
      await applyToInternship(internshipId, { resumeLink });
      notify({ message: 'Application submitted!', variant: 'success' });
      setResumeLink('');
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary">
          ← Back
        </button>
        <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={() => navigate('/internships')}>
          Browse more
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader label="Loading internship" />
        </div>
      )}

      {error && !loading && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          {error}
        </Card>
      )}

      {!loading && !error && internship && (
        <div className="space-y-5">
          <section className="rounded-3xl bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#0F172A] p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-white/70">Internship</p>
            <h1 className="mt-2 text-2xl font-semibold">{internship.role_title}</h1>
            <p className="mt-2 text-sm text-white/80">{internship.company_name || 'Company'}</p>
            {internship.description && (
              <p className="mt-3 text-sm leading-relaxed text-white/80">{internship.description}</p>
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Location</h3>
              <p className="text-sm text-muted">{internship.location || internship.mode || '—'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Type</h3>
              <p className="text-sm text-muted">{internship.type || 'Internship'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Stipend</h3>
              <p className="text-sm text-muted">{internship.stipend || internship.salary_range || internship.compensation || '—'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Duration</h3>
              <p className="text-sm text-muted">
                {internship.duration || internship.duration_text || internship.duration_label || internship.duration_months || '—'}
              </p>
            </Card>
          </section>

          <Card className="space-y-3 border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-body">Apply now</h3>
            <form onSubmit={handleApply} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={resumeLink}
                onChange={(event) => setResumeLink(event.target.value)}
                placeholder="Paste resume link"
                className="input flex-1 text-sm"
                required
              />
              <Button type="submit" variant="primary" size="sm" disabled={applyLoading}>
                {applyLoading ? <Loader size="sm" inline /> : 'Apply'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InternshipDetail;
