import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import { fetchStartupById } from '../../services/startup.api.js';
import { fetchJobsByStartup } from '../../services/internship.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { postJob, updateJob, deleteJob, fetchHireJobs, fetchJobApplicants } from '../../services/hire.api.js';
import { useNotification } from '../../context/NotificationContext.jsx';

const jobFormTemplate = {
  role_title: '',
  description: '',
  type: 'Internship',
  external_link: '',
  location: '',
  stipend: '',
  duration: '',
  application_deadline: '',
  company_id: '',
};

const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const StartupDetail = () => {
  const { id: startupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useNotification();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState(jobFormTemplate);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [startupJobs, setStartupJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Applicants state for founder
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState({});

  const isFounder = user?.id === startup?.user_id;

  useEffect(() => {
    if (!startupId) return;
    let mounted = true;

    const loadStartup = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchStartupById(startupId);
        if (mounted) {
          setStartup(data);
          setJobForm(prev => ({ ...prev, company_id: data.id }));
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load startup');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStartup();
    return () => {
      mounted = false;
    };
  }, [startupId]);

  useEffect(() => {
    if (startupId) {
      loadStartupJobs();
    }
  }, [startupId, isFounder]);

  const loadStartupJobs = async () => {
    setLoadingJobs(true);
    try {
      // For founders, use the hire API to get their jobs with more details
      // For others, use the public internship API
      let data;
      if (isFounder) {
        data = await fetchHireJobs();
      } else {
        data = await fetchJobsByStartup(startupId);
      }
      const list = Array.isArray(data?.results) ? data.results : data || [];
      setStartupJobs(list);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplicants = async (jobId) => {
    if (!jobId || applicantsByJob[jobId]) return;

    setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
    try {
      const data = await fetchJobApplicants(jobId);
      setApplicantsByJob(prev => ({
        ...prev,
        [jobId]: Array.isArray(data?.results) ? data.results : data || []
      }));
    } catch (err) {
      console.error('Failed to load applicants:', err);
      setApplicantsByJob(prev => ({ ...prev, [jobId]: [] }));
    } finally {
      setLoadingApplicants(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleJobApplicants = (jobId) => {
    const isExpanding = expandedJobId !== jobId;
    setExpandedJobId(isExpanding ? jobId : null);

    if (isExpanding) {
      loadApplicants(jobId);
    }
  };

  const handleJobFormChange = (event) => {
    const { name, value } = event.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobSubmit = async (event) => {
    event.preventDefault();
    setJobSubmitting(true);
    setSuccessMessage(null);
    setJobError(null);

    try {
      if (editingJobId) {
        await updateJob(editingJobId, jobForm);
        setSuccessMessage('Job updated successfully!');
      } else {
        await postJob(jobForm);
        setSuccessMessage('Job posted successfully!');
      }
      setJobForm({ ...jobFormTemplate, company_id: startupId });
      setShowJobModal(false);
      setEditingJobId(null);
      await loadStartupJobs();
    } catch (err) {
      console.error('Job submission error:', err);
      setJobError(err.message || 'Failed to submit job');
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    setDeleting(true);
    try {
      await deleteJob(jobId);
      notify({ type: 'success', message: 'Job deleted successfully!' });
      setShowDeleteConfirm(null);
      await loadStartupJobs();
    } catch (err) {
      notify({ type: 'error', message: err.message || 'Failed to delete job' });
    } finally {
      setDeleting(false);
    }
  };

  const openJobModal = () => {
    setJobForm({ ...jobFormTemplate, company_id: startupId });
    setEditingJobId(null);
    setJobError(null);
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setJobForm({
      role_title: job.role_title || '',
      description: job.description || '',
      type: job.type || 'Internship',
      external_link: job.external_link || '',
      location: job.location || '',
      stipend: job.stipend || '',
      duration: job.duration || '',
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
      company_id: job.company_id || startupId,
    });
    setEditingJobId(job.id);
    setJobError(null);
    setShowJobModal(true);
  };

  const summary = useMemo(() => {
    if (!startup) return null;
    return (
      <section className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-wide text-white/70">Startup</p>
        <h1 className="mt-2 text-2xl font-semibold">{startup.name}</h1>
        <p className="mt-2 text-sm text-white/80">{startup.domain || 'Domain coming soon'}</p>
        {startup.problem && (
          <p className="mt-3 text-sm leading-relaxed text-white/80">{startup.problem}</p>
        )}
      </section>
    );
  }, [startup]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary">
          ← Back
        </button>
        <div className="flex gap-2">
          {isFounder && startup?.status === 'APPROVED' && (
            <Button variant="primary" size="sm" onClick={openJobModal}>
              + Post Job
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="rounded-full px-4">
            Go home
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm text-success">
          <span>✓</span> {successMessage}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader label="Loading startup" />
        </div>
      )}

      {error && !loading && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          {error}
        </Card>
      )}

      {!loading && !error && startup && (
        <div className="space-y-5">
          {summary}

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Stage</h3>
              {startup.stage ? <Badge variant="neutral">{startup.stage}</Badge> : <p className="text-sm text-muted">—</p>}
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Status</h3>
              <p className="text-sm text-muted">{startup.status || 'Active'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Head</h3>
              <p className="text-sm text-muted">{startup.head_name || '—'}</p>
              {startup.head_email && <p className="text-xs text-muted">{startup.head_email}</p>}
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Team size</h3>
              <p className="text-sm text-muted">{startup.total_members ?? '—'}</p>
            </Card>
          </section>

          {/* Jobs/Roles Section - Visible to everyone */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Open Roles</h2>
              <span className="text-xs text-text-muted">{startupJobs.length} {startupJobs.length === 1 ? 'role' : 'roles'}</span>
            </div>

            {loadingJobs ? (
              <div className="flex justify-center py-6">
                <Loader size="sm" label="Loading roles" />
              </div>
            ) : startupJobs.length > 0 ? (
              <Card className="space-y-0 bg-primary/5 border-primary/20 p-0 overflow-hidden">
                {startupJobs.map((job, index) => (
                  <div key={job.id} className={index > 0 ? 'border-t border-border/50' : ''}>
                    {/* Job Card */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-text-primary">{job.role_title}</h4>
                            <Badge variant="primary" className="text-[10px]">{job.type}</Badge>
                          </div>
                          {job.description && (
                            <p className="text-xs text-text-secondary line-clamp-2">{job.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs text-text-muted mt-2">
                            {job.location && <span>📍 {job.location}</span>}
                            {job.stipend && <span>💰 {job.stipend}</span>}
                            {job.duration && <span>⏱️ {job.duration}</span>}
                          </div>
                        </div>

                        {/* Edit/Delete buttons - Only for founder */}
                        {isFounder && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditJob(job)}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(job.id)}
                              className="text-xs font-medium text-danger hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* View Applicants Button - Only for founder */}
                      {isFounder && (
                        <button
                          onClick={() => toggleJobApplicants(job.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-colors"
                        >
                          <span className="text-sm font-medium text-text-secondary">
                            View Applicants ({applicantsByJob[job.id]?.length ?? 0})
                          </span>
                          <ChevronDownIcon
                            className={`h-4 w-4 text-text-muted transition-transform ${expandedJobId === job.id ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}

                      {/* Apply button for non-founders */}
                      {!isFounder && job.external_link && (
                        <a
                          href={job.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                        >
                          Apply Now ↗
                        </a>
                      )}
                    </div>

                    {/* Applicants List - Only for founder */}
                    {isFounder && expandedJobId === job.id && (
                      <div className="px-4 pb-4">
                        {loadingApplicants[job.id] ? (
                          <div className="flex justify-center py-6">
                            <Loader size="sm" label="Loading applicants" />
                          </div>
                        ) : applicantsByJob[job.id]?.length > 0 ? (
                          <div className="space-y-2">
                            {applicantsByJob[job.id].map((app) => (
                              <div
                                key={app.id}
                                className="rounded-lg bg-white p-3 border border-border/50"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <p className="text-sm font-medium text-text-primary">{app.applicant?.name || 'Anonymous'}</p>
                                    <p className="text-xs text-text-muted">
                                      {app.applicant?.course || app.applicant?.branch || 'Student'} • {app.applicant?.year ? `Year ${app.applicant.year}` : ''}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {app.resume_link ? (
                                      <a
                                        href={app.resume_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                      >
                                        Resume ↗
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-text-disabled italic">No Resume</span>
                                    )}
                                    <Badge variant={
                                      app.status === 'Shortlisted' ? 'success' :
                                        app.status === 'Rejected' ? 'danger' :
                                          'neutral'
                                    } className="text-[10px]">
                                      {app.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-sm text-text-muted">No applicants yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="py-6 text-center">
                <p className="text-sm text-text-muted">No roles posted yet</p>
                {isFounder && (
                  <button
                    onClick={openJobModal}
                    className="mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    Post your first role
                  </button>
                )}
              </Card>
            )}
          </section>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Delete Job?</h3>
            <p className="text-sm text-text-secondary">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => handleDeleteJob(showDeleteConfirm)}
                className="flex-1"
                disabled={deleting}
              >
                {deleting ? <Loader size="sm" inline label="Deleting" /> : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingJobId ? 'Edit Job' : 'Post New Job'}
              </h2>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form className="p-4 space-y-4" onSubmit={handleJobSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="role_title" className="text-xs text-text-muted">Role title *</label>
                <input
                  id="role_title"
                  name="role_title"
                  required
                  value={jobForm.role_title}
                  onChange={handleJobFormChange}
                  placeholder="e.g. Product Design Intern"
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs text-text-muted">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  placeholder="What you're looking for..."
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="type" className="text-xs text-text-muted">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={jobForm.type}
                    onChange={handleJobFormChange}
                    className="input"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="location" className="text-xs text-text-muted">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobFormChange}
                    placeholder="e.g. Remote"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="stipend" className="text-xs text-text-muted">Stipend</label>
                  <input
                    id="stipend"
                    name="stipend"
                    value={jobForm.stipend}
                    onChange={handleJobFormChange}
                    placeholder="e.g. ₹10k"
                    className="input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="duration" className="text-xs text-text-muted">Duration</label>
                  <input
                    id="duration"
                    name="duration"
                    value={jobForm.duration}
                    onChange={handleJobFormChange}
                    placeholder="e.g. 3 Months"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="application_deadline" className="text-xs text-text-muted">Deadline</label>
                  <input
                    id="application_deadline"
                    name="application_deadline"
                    type="date"
                    value={jobForm.application_deadline}
                    onChange={handleJobFormChange}
                    className="input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="external_link" className="text-xs text-text-muted">Apply link</label>
                  <input
                    id="external_link"
                    name="external_link"
                    type="url"
                    value={jobForm.external_link}
                    onChange={handleJobFormChange}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>

              {jobError && <p className="text-xs text-danger">{jobError}</p>}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={jobSubmitting} className="flex-1">
                  {jobSubmitting ? (
                    <Loader size="sm" inline label={editingJobId ? 'Updating' : 'Posting'} />
                  ) : (
                    editingJobId ? 'Update Job' : 'Post Job'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StartupDetail;
