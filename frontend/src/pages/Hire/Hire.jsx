import { useEffect, useState, useMemo } from 'react';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import {
  fetchHireJobs,
  fetchJobApplicants,
  postJob,
  updateJob,
  updateApplicationStatus,
  fetchMyApprovedStartup,
} from '../../services/hire.api.js';
import { useRole } from '../../context/RoleContext.jsx';

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

const statusOptions = ['Applied', 'Shortlisted', 'Rejected'];

const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Hire = () => {
  const { role } = useRole();
  const [jobs, setJobs] = useState([]);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState({});
  const [jobError, setJobError] = useState(null);
  const [jobForm, setJobForm] = useState(jobFormTemplate);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [myStartup, setMyStartup] = useState(null);
  const [loadingStartup, setLoadingStartup] = useState(false);

  const isAdmin = role === 'admin';
  const canPostJobs = !isAdmin && myStartup?.status === 'APPROVED';

  // Group jobs by company
  const jobsByCompany = useMemo(() => {
    const grouped = {};
    jobs.forEach(job => {
      const companyName = job.company_name || 'Unknown Startup';
      if (!grouped[companyName]) {
        grouped[companyName] = [];
      }
      grouped[companyName].push(job);
    });
    return grouped;
  }, [jobs]);

  const loadMyStartup = async () => {
    if (isAdmin) return;

    setLoadingStartup(true);
    try {
      const data = await fetchMyApprovedStartup();
      if (data?.status === 'APPROVED' && data?.startup) {
        setMyStartup(data.startup);
        setJobForm(prev => ({ ...prev, company_id: data.startup.id }));
      } else {
        setMyStartup(null);
      }
    } catch (err) {
      console.error('Failed to load startup:', err);
      setMyStartup(null);
    } finally {
      setLoadingStartup(false);
    }
  };

  const loadJobs = async () => {
    setLoadingJobs(true);
    setJobError(null);
    try {
      const data = await fetchHireJobs();
      const list = Array.isArray(data?.results) ? data.results : data || [];
      setJobs(list);
    } catch (err) {
      setJobError(err.message || 'Unable to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplicants = async (jobId) => {
    if (!jobId || applicantsByJob[jobId]) return; // Don't reload if already loaded

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

  useEffect(() => {
    if (role) {
      loadMyStartup();
      loadJobs();
    }
  }, [role]);

  const toggleCompany = (companyName) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyName]: !prev[companyName]
    }));
  };

  const toggleJobApplicants = (jobId) => {
    const isExpanding = !expandedJobs[jobId];
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: isExpanding
    }));

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
        setSuccessMessage('Role updated successfully!');
      } else {
        await postJob(jobForm);
        setSuccessMessage('Role posted successfully!');
      }
      setJobForm(jobFormTemplate);
      setShowForm(false);
      setEditingJobId(null);
      await loadJobs();
    } catch (err) {
      setJobError(err.message || 'Failed to submit job');
    } finally {
      setJobSubmitting(false);
    }
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
      company_id: job.company_id || myStartup?.id || '',
    });
    setEditingJobId(job.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingJobId(null);
      setJobForm({ ...jobFormTemplate, company_id: myStartup?.id || '' });
    } else {
      setShowForm(true);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setStatusLoadingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, { status });
      // Reload applicants for the job
      const jobId = Object.keys(applicantsByJob).find(jId =>
        applicantsByJob[jId].some(app => app.id === applicationId)
      );
      if (jobId) {
        setApplicantsByJob(prev => ({ ...prev, [jobId]: undefined })); // Clear cache
        await loadApplicants(jobId);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Hire</h1>
          <p className="text-xs text-text-muted">
            {isAdmin ? 'View all job postings from approved startups' : 'Post roles and review applicants'}
          </p>
        </div>
        {canPostJobs && (
          <Button variant="primary" size="sm" onClick={toggleForm}>
            {showForm ? 'Cancel' : (editingJobId ? 'Edit Role' : '+ Post Role')}
          </Button>
        )}
      </header>

      {/* Admin Notice */}
      {isAdmin && (
        <Card className="bg-primary/10 border-primary/20">
          <p className="text-sm text-text-secondary">
            ℹ️ As an admin, you can view all job postings but cannot create or manage jobs. Only approved startups can post jobs.
          </p>
        </Card>
      )}

      {/* No Approved Startup Notice */}
      {!isAdmin && !loadingStartup && !myStartup && (
        <Card className="bg-warning/10 border-warning/20">
          <p className="text-sm text-text-secondary">
            ⚠️ You need an approved startup to post jobs. Please register your startup first.
          </p>
        </Card>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm text-success">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Job Form - Collapsible */}
      {showForm && canPostJobs && (
        <Card className="animate-slide-up">
          <form className="space-y-4" onSubmit={handleJobSubmit}>
            {/* Startup Selection */}
            <div className="space-y-1.5">
              <label htmlFor="company_id" className="text-xs text-text-muted">Startup *</label>
              <select
                id="company_id"
                name="company_id"
                required
                value={jobForm.company_id}
                onChange={handleJobFormChange}
                className="input"
                disabled={!!myStartup}
              >
                {myStartup ? (
                  <option value={myStartup.id}>{myStartup.name}</option>
                ) : (
                  <option value="">Select a startup</option>
                )}
              </select>
              {myStartup && (
                <p className="text-[10px] text-text-muted">
                  Your approved startup is automatically selected
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role_title" className="text-xs text-text-muted">Role title</label>
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
              <label htmlFor="description" className="text-xs text-text-muted">Description</label>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="type" className="text-xs text-text-muted">Type</label>
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

            <Button type="submit" variant="primary" disabled={jobSubmitting} className="w-full">
              {jobSubmitting ? (
                <Loader size="sm" inline label={editingJobId ? 'Updating' : 'Posting'} />
              ) : (
                editingJobId ? 'Update Role' : 'Post Role'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Jobs List Grouped by Company */}
      <div className="space-y-3">
        {loadingJobs ? (
          <div className="flex justify-center py-8">
            <Loader label="Loading roles" />
          </div>
        ) : jobError && !showForm ? (
          <Card className="bg-danger-soft border-danger/20 text-danger text-sm">{jobError}</Card>
        ) : (
          <>
            {Object.keys(jobsByCompany).length > 0 ? (
              Object.entries(jobsByCompany).map(([companyName, companyJobs]) => (
                <Card key={companyName} className="p-0 overflow-hidden">
                  {/* Company Header */}
                  <button
                    onClick={() => toggleCompany(companyName)}
                    className="w-full p-4 flex items-center justify-between hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {companyName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-bold text-text-primary">{companyName}</h3>
                        <p className="text-xs text-text-muted">{companyJobs.length} role{companyJobs.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-text-muted transition-transform ${expandedCompanies[companyName] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Jobs List */}
                  {expandedCompanies[companyName] && (
                    <div className="border-t border-border">
                      {companyJobs.map((job) => (
                        <div key={job.id} className="border-b border-border last:border-b-0">
                          {/* Job Header */}
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-semibold text-text-primary">{job.role_title}</h4>
                                  <Badge variant="primary">{job.type}</Badge>
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
                              {canPostJobs && !isAdmin && (
                                <button
                                  onClick={() => handleEditJob(job)}
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  Edit
                                </button>
                              )}
                            </div>

                            {/* View Applicants Button */}
                            <button
                              onClick={() => toggleJobApplicants(job.id)}
                              className="w-full flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                            >
                              <span className="text-sm font-medium text-text-secondary">
                                View Applicants ({applicantsByJob[job.id] ? applicantsByJob[job.id].length : (job.applicant_count ?? 0)})
                              </span>
                              <ChevronDownIcon
                                className={`h-4 w-4 text-text-muted transition-transform ${expandedJobs[job.id] ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Applicants List */}
                          {expandedJobs[job.id] && (
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
                                      className="rounded-lg bg-bg-glass p-3 border border-border/50"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                          <p className="text-sm font-medium text-text-primary">{app.applicant?.name || 'Anonymous'}</p>
                                          <p className="text-xs text-text-muted">
                                            {app.applicant?.course || app.applicant?.branch || 'Student'} • {app.applicant?.year ? `Year ${app.applicant.year}` : ''}
                                          </p>
                                        </div>
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
                                      </div>

                                      {!isAdmin && (
                                        <div className="flex gap-1.5 flex-wrap">
                                          {statusOptions.map((status) => (
                                            <button
                                              key={status}
                                              type="button"
                                              onClick={() => handleStatusUpdate(app.id, status)}
                                              disabled={statusLoadingId === app.id}
                                              className={`chip text-[10px] py-1 ${status === app.status ? 'chip-active' : ''
                                                } ${status === 'Rejected' ? 'hover:border-danger/30' : ''}`}
                                            >
                                              {statusLoadingId === app.id && status !== app.status ? (
                                                <Loader size="sm" inline />
                                              ) : (
                                                status
                                              )}
                                            </button>
                                          ))}
                                        </div>
                                      )}
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
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="py-8 text-center">
                <div className="mb-2 text-3xl">💼</div>
                <p className="text-sm text-text-secondary">No roles posted yet</p>
                <p className="text-xs text-text-muted mt-1">
                  {canPostJobs ? 'Post your first role to start hiring' : 'Check back later for opportunities'}
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hire;
