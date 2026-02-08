import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import { fetchInternshipById, applyToInternship, checkApplicationStatus } from '../../services/internship.api.js';
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
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

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

    const checkStatus = async () => {
      setCheckingStatus(true);
      try {
        const result = await checkApplicationStatus(internshipId);
        if (mounted && result.hasApplied) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error('Failed to check application status:', err);
      } finally {
        if (mounted) {
          setCheckingStatus(false);
        }
      }
    };

    loadInternship();
    checkStatus();

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
      notify({ message: 'Application submitted successfully!', variant: 'success' });
      setResumeLink('');
      setHasApplied(true);
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit application';
      setError(errorMessage);
      notify({ message: errorMessage, variant: 'error' });

      // Check if error is about duplicate application
      if (errorMessage.includes('already applied')) {
        setHasApplied(true);
      }
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

      {error && !loading && !hasApplied && (
        <Card className="border border-danger/20 bg-danger/5 text-danger p-4">
          {error}
        </Card>
      )}

      {!loading && internship && (
        <div className="space-y-5">
          {/* Header Card */}
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary">{internship.company_name || 'Company'}</h1>
                <p className="text-base text-text-secondary mt-1">Role: {internship.role_title}</p>
              </div>
              {internship.type && (
                <Badge variant="primary">{internship.type}</Badge>
              )}
            </div>
            {internship.description && (
              <p className="text-sm text-text-secondary leading-relaxed">{internship.description}</p>
            )}
          </Card>

          {/* Details Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-text-muted uppercase">Location</h3>
              <p className="text-sm text-text-primary">{internship.location || internship.mode || '—'}</p>
            </Card>
            <Card className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-text-muted uppercase">Duration</h3>
              <p className="text-sm text-text-primary">
                {internship.duration || internship.duration_text || internship.duration_label || internship.duration_months || '—'}
              </p>
            </Card>
            <Card className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-text-muted uppercase">Stipend</h3>
              <p className="text-sm text-text-primary">{internship.stipend || internship.salary_range || internship.compensation || '—'}</p>
            </Card>
            <Card className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-text-muted uppercase">Deadline</h3>
              <p className="text-sm text-text-primary">
                {internship.application_deadline
                  ? new Date(internship.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </p>
            </Card>
          </div>

          {/* Apply Section */}
          <Card className="p-5 border-2 border-primary/20">
            <h3 className="text-base font-bold text-text-primary mb-3">Apply for this position</h3>

            {checkingStatus ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" label="Checking status" />
              </div>
            ) : hasApplied ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-success-soft text-success">
                <span className="text-lg">✓</span>
                <div>
                  <p className="font-medium">Application Submitted!</p>
                  <p className="text-sm opacity-80">You have already applied to this position.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="resume" className="text-xs font-medium text-text-muted">
                    Resume Link *
                  </label>
                  <input
                    id="resume"
                    type="url"
                    value={resumeLink}
                    onChange={(event) => setResumeLink(event.target.value)}
                    placeholder="https://drive.google.com/your-resume"
                    className="input"
                    required
                  />
                  <p className="text-xs text-text-muted">
                    Paste a link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>
                <Button type="submit" variant="primary" size="md" disabled={applyLoading} className="w-full">
                  {applyLoading ? <Loader size="sm" inline label="Submitting" /> : 'Submit Application'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default InternshipDetail;
