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
      setSuccessMessage('Role posted successfully.');
      setJobForm(jobFormTemplate);
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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-body">Hire</h1>
        <p className="mt-1 text-sm text-muted">
          Post new roles and review applicants with Trust Scores and Levels.
        </p>
      </header>

      <Card className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-body">Post a new role</h2>
          <p className="mt-1 text-sm text-muted">Share opportunities with verified students from your campus.</p>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleJobSubmit}>
          <div className="sm:col-span-2 space-y-2">
            <label htmlFor="role_title" className="text-xs font-semibold text-muted">
              Role title
            </label>
            <input
              id="role_title"
              name="role_title"
              required
              value={jobForm.role_title}
              onChange={handleJobFormChange}
              placeholder="Product Design Intern"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <label htmlFor="description" className="text-xs font-semibold text-muted">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={jobForm.description}
              onChange={handleJobFormChange}
              placeholder="Highlight responsibilities and what you are looking for"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type" className="text-xs font-semibold text-muted">
              Opportunity type
            </label>
            <select
              id="type"
              name="type"
              value={jobForm.type}
              onChange={handleJobFormChange}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Project">Project</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="external_link" className="text-xs font-semibold text-muted">
              Application link (optional)
            </label>
            <input
              id="external_link"
              name="external_link"
              value={jobForm.external_link}
              onChange={handleJobFormChange}
              placeholder="https://"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between gap-2">
            {jobError && <p className="text-sm text-danger">{jobError}</p>}
            {successMessage && <p className="text-sm text-success">{successMessage}</p>}
            <Button type="submit" variant="primary" className="sm:ml-auto" disabled={jobSubmitting}>
              {jobSubmitting ? <Loader size="sm" label="Posting" inline /> : 'Post Role'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-body">Active job postings</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {jobs.length} roles
          </span>
        </div>

        {loadingJobs ? (
          <div className="flex justify-center py-10">
            <Loader label="Fetching jobs" />
          </div>
        ) : jobError ? (
          <Card className="border border-danger/20 bg-danger/5 text-danger">
            <p>{jobError}</p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer space-y-3 border transition ${
                    selectedJobId === job.id ? 'border-primary-light ring-2 ring-primary/20' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-body">{job.role_title}</h3>
                      <p className="mt-1 text-sm text-muted">{job.company_name}</p>
                    </div>
                    <Badge variant="neutral" className="capitalize">
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{job.description}</p>
                  <p className="text-xs text-muted">Applicants: {job.applicant_count ?? job.applicants_count ?? 0}</p>
                </Card>
              ))}

              {!jobs.length && (
                <Card className="text-center text-sm text-muted">
                  No roles posted yet. Start by sharing your first opportunity.
                </Card>
              )}
            </div>

            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-body">Recent applicants</h2>
                {selectedJob ? (
                  <Badge variant="neutral">{selectedJob.role_title}</Badge>
                ) : null}
              </div>

              {loadingApplicants ? (
                <div className="flex justify-center py-6">
                  <Loader label="Loading applicants" />
                </div>
              ) : applicantError ? (
                <p className="text-sm text-danger">{applicantError}</p>
              ) : (
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="rounded-2xl border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-body">{applicant.name}</p>
                          <p className="text-xs text-muted">{applicant.degree || applicant.program}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="trust">{formatTrustScore(applicant.trust_score)}</Badge>
                          <Badge variant="level">{formatLevel(applicant.level)}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="rounded-full bg-surface px-3 py-1">Status: {applicant.status}</span>
                        {applicant.skills?.map((skill) => (
                          <span key={skill} className="rounded-full bg-surface px-3 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {statusOptions.map((status) => (
                          <Button
                            key={status}
                            variant={status === applicant.status ? 'primary' : 'subtle'}
                            size="sm"
                            onClick={() => handleStatusUpdate(applicant.id, status)}
                            disabled={statusLoadingId === applicant.id}
                          >
                            {statusLoadingId === applicant.id && status !== applicant.status ? (
                              <Loader size="sm" inline label="Updating" />
                            ) : (
                              status
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {!applicants.length && (
                    <p className="text-sm text-muted">No applicants yet. Share the role to reach more students.</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hire;
