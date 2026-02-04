import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import {
  fetchHireJobs,
  fetchJobApplicants,
  postJob,
  updateApplicationStatus,
} from '../../services/hire.api.js';
import { formatLevel, formatTrustScore } from '../../utils/formatters.js';

const jobFormTemplate = {
  role_title: '',
  description: '',
  type: 'Internship',
  external_link: '',
};

const statusOptions = ['Applied', 'Shortlisted', 'Rejected'];

// Icons
const BriefcaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Hire = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [applicantError, setApplicantError] = useState(null);
  const [jobForm, setJobForm] = useState(jobFormTemplate);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadJobs = async () => {
    setLoadingJobs(true);
    setJobError(null);
    try {
      const data = await fetchHireJobs();
      const list = Array.isArray(data?.results) ? data.results : data || [];
      setJobs(list);
      if (list.length) {
        setSelectedJobId(list[0].id);
      }
    } catch (err) {
      setJobError(err.message || 'Unable to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplicants = async (jobId) => {
    if (!jobId) return;
    setLoadingApplicants(true);
    setApplicantError(null);
    try {
      const data = await fetchJobApplicants(jobId);
      setApplicants(Array.isArray(data?.results) ? data.results : data || []);
    } catch (err) {
      setApplicantError(err.message || 'Unable to load applicants');
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadApplicants(selectedJobId);
    } else {
      setApplicants([]);
    }
  }, [selectedJobId]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId), [jobs, selectedJobId]);

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
      await postJob(jobForm);
      setSuccessMessage('Role posted successfully!');
      setJobForm(jobFormTemplate);
      setShowForm(false);
      await loadJobs();
    } catch (err) {
      setJobError(err.message || 'Failed to post job');
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setStatusLoadingId(applicationId);
    setApplicantError(null);
    try {
      await updateApplicationStatus(applicationId, { status });
      await loadApplicants(selectedJobId);
    } catch (err) {
      setApplicantError(err.message || 'Failed to update status');
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
          <p className="text-xs text-text-muted">Post roles and review applicants</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post Role'}
        </Button>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm text-success">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Job Form - Collapsible */}
      {showForm && (
        <Card className="animate-slide-up">
          <form className="space-y-4" onSubmit={handleJobSubmit}>
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
              {jobSubmitting ? <Loader size="sm" inline label="Posting" /> : 'Post Role'}
            </Button>
          </form>
        </Card>
      )}

      {/* Jobs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-secondary">Your Roles</h2>
          <span className="text-xs text-text-muted">{jobs.length} posted</span>
        </div>

        {loadingJobs ? (
          <div className="flex justify-center py-8">
            <Loader label="Loading roles" />
          </div>
        ) : jobError && !showForm ? (
          <Card className="bg-danger-soft border-danger/20 text-danger text-sm">{jobError}</Card>
        ) : (
          <>
            {/* Job Tabs */}
            {jobs.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className={`chip flex-shrink-0 ${selectedJobId === job.id ? 'chip-active' : ''}`}
                  >
                    <BriefcaseIcon className="h-3 w-3" />
                    {job.role_title}
                    <span className="ml-1 text-[10px] opacity-60">
                      ({job.applicant_count ?? job.applicants_count ?? 0})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Job Details + Applicants */}
            {selectedJob && (
              <Card className="space-y-4 animate-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{selectedJob.role_title}</h3>
                    <p className="text-xs text-text-muted">{selectedJob.company_name || 'Your company'}</p>
                  </div>
                  <Badge variant="primary">{selectedJob.type}</Badge>
                </div>

                {selectedJob.description && (
                  <p className="text-sm text-text-secondary">{selectedJob.description}</p>
                )}

                <div className="border-t border-divider pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UsersIcon className="h-4 w-4 text-text-muted" />
                    <span className="text-sm font-medium text-text-secondary">Applicants</span>
                    <Badge variant="neutral" className="text-[10px]">{applicants.length}</Badge>
                  </div>

                  {loadingApplicants ? (
                    <div className="flex justify-center py-6">
                      <Loader size="sm" label="Loading" />
                    </div>
                  ) : applicantError ? (
                    <p className="text-xs text-danger">{applicantError}</p>
                  ) : (
                    <div className="space-y-3">
                      {applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="rounded-lg bg-bg-glass p-3 border border-border/50"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm font-medium text-text-primary">{applicant.name}</p>
                              <p className="text-xs text-text-muted">{applicant.degree || applicant.program}</p>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="accent">{formatTrustScore(applicant.trust_score)}</Badge>
                              <Badge variant="secondary">{formatLevel(applicant.level)}</Badge>
                            </div>
                          </div>

                          {applicant.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {applicant.skills.slice(0, 3).map((skill) => (
                                <span key={skill} className="text-[10px] bg-bg-elevated px-2 py-0.5 rounded-full text-text-muted">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-1.5">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusUpdate(applicant.id, status)}
                                disabled={statusLoadingId === applicant.id}
                                className={`chip text-[10px] py-1 ${status === applicant.status ? 'chip-active' : ''
                                  } ${status === 'Rejected' ? 'hover:border-danger/30' : ''}`}
                              >
                                {statusLoadingId === applicant.id && status !== applicant.status ? (
                                  <Loader size="sm" inline />
                                ) : (
                                  status
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {!applicants.length && (
                        <div className="py-6 text-center">
                          <p className="text-sm text-text-muted">No applicants yet</p>
                          <p className="text-xs text-text-disabled mt-1">Share this role to get started</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {!jobs.length && !showForm && (
              <Card className="py-8 text-center">
                <div className="mb-2 text-3xl">💼</div>
                <p className="text-sm text-text-secondary">No roles posted yet</p>
                <p className="text-xs text-text-muted mt-1">Post your first role to start hiring</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hire;
