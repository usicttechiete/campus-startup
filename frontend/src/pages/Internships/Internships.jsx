import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import InternshipCard from '../../components/InternshipCard/InternshipCard.jsx';
import {
  fetchInternships,
  applyToInternship,
} from '../../services/internship.api.js';
import { formatSkills } from '../../utils/formatters.js';
import useDebouncedValue from '../../utils/useDebouncedValue.js';
import { useNotification } from '../../context/NotificationContext.jsx';

const defaultFilters = {
  search: '',
  skill: '',
  duration: '',
  paid: 'all',
  location: '',
  workType: 'all',
  sort: 'latest',
};

const workTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Part-time', value: 'Part-time' },
  { label: 'Full-time', value: 'Full-time' },
];

const paidOptions = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Highest stipend', value: 'highest-stipend' },
  { label: 'Shortest duration', value: 'shortest-duration' },
  { label: 'Closing soon', value: 'closing-soon' },
];

const resolveValue = (value, fallback = 'Not specified') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

const formatDuration = (internship) => {
  const duration = internship.duration || internship.duration_text || internship.duration_label;
  if (duration) return duration;
  const months = internship.duration_months ?? internship.duration_month;
  if (months) return `${months} month${Number(months) === 1 ? '' : 's'}`;
  const weeks = internship.duration_weeks ?? internship.duration_week;
  if (weeks) return `${weeks} week${Number(weeks) === 1 ? '' : 's'}`;
  return null;
};

const formatDeadline = (deadlineValue) => {
  if (!deadlineValue) return null;
  const date = new Date(deadlineValue);
  if (Number.isNaN(date.getTime())) return deadlineValue;
  return date.toLocaleDateString();
};

const parseFiltersFromParams = (params) => ({
  search: params.get('search') ?? '',
  skill: params.get('skill') ?? '',
  duration: params.get('duration') ?? '',
  paid: params.get('paid') ?? 'all',
  location: params.get('location') ?? '',
  workType: params.get('workType') ?? 'all',
  sort: params.get('sort') ?? 'latest',
});

const areFiltersEqual = (first, second) =>
  Object.keys(defaultFilters).every((key) => (first?.[key] ?? '') === (second?.[key] ?? ''));

const Internships = () => {
  const { notify } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters, ...parseFiltersFromParams(searchParams) }));
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [resumeInputs, setResumeInputs] = useState({});
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const debouncedSearch = useDebouncedValue(filters.search, 450);

  const buildParams = useCallback(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.skill) params.skill = filters.skill;
    if (filters.duration) params.duration = filters.duration;
    if (filters.location) params.location = filters.location;
    if (filters.paid !== 'all') params.paid = filters.paid;
    if (filters.workType !== 'all') params.type = filters.workType;
    if (filters.sort) params.sort = filters.sort;
    return params;
  }, [debouncedSearch, filters.duration, filters.location, filters.paid, filters.skill, filters.sort, filters.workType]);

  const loadInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildParams();
      const data = await fetchInternships(params);
      const results = Array.isArray(data?.results) ? data.results : data || [];
      setJobs(results);
    } catch (err) {
      setError(err.message || 'Unable to load internships');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const nextFilters = { ...defaultFilters, ...parseFiltersFromParams(searchParams) };
    setFilters((prev) => (areFiltersEqual(prev, nextFilters) ? prev : nextFilters));
  }, [searchParams]);

  useEffect(() => {
    loadInternships();
  }, [loadInternships]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (debouncedSearch) nextParams.set('search', debouncedSearch);
    if (filters.skill) nextParams.set('skill', filters.skill);
    if (filters.duration) nextParams.set('duration', filters.duration);
    if (filters.location) nextParams.set('location', filters.location);
    if (filters.paid !== 'all') nextParams.set('paid', filters.paid);
    if (filters.workType !== 'all') nextParams.set('workType', filters.workType);
    if (filters.sort && filters.sort !== 'latest') nextParams.set('sort', filters.sort);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [debouncedSearch, filters, searchParams, setSearchParams]);

  const handleResumeInputChange = (jobId, value) => {
    setResumeInputs((prev) => ({ ...prev, [jobId]: value }));
  };

  const handleSubmitApplication = async (job) => {
    if (!job?.id) return;
    if (appliedJobIds.includes(job.id)) return;
    const resumeLink = resumeInputs[job.id];
    if (!resumeLink) {
      notify({ message: 'Please add your resume or portfolio link before submitting.', variant: 'error' });
      return;
    }
    setApplyJobId(job.id);
    setApplyLoading(true);
    setError(null);
    try {
      await applyToInternship(job.id, { resumeLink });
      setAppliedJobIds((prev) => (prev.includes(job.id) ? prev : [...prev, job.id]));
      setResumeInputs((prev) => ({ ...prev, [job.id]: '' }));
      notify({
        message: 'Application submitted successfully. The organizer will contact you if shortlisted.',
        variant: 'success',
      });
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
      setApplyJobId(null);
    }
  };

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-body">Internships</h1>
        <p className="mt-1 text-sm text-muted">
          Discover opportunities tailored to your skills and interests.
        </p>
      </header>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-body">Filter internships</h2>
            <p className="text-xs text-muted">Use filters to narrow down your search.</p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">
            {jobs.length} opportunities
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <label htmlFor="search" className="text-xs font-semibold text-muted">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={filters.search}
              onChange={handleFilterChange('search')}
              placeholder="Search internships"
              className="w-full rounded-3xl border border-border bg-surface px-5 py-4 text-base outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="skill" className="text-xs font-semibold text-muted">
              Skill required
            </label>
            <input
              id="skill"
              type="text"
              value={filters.skill}
              onChange={handleFilterChange('skill')}
              placeholder="e.g. React"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="text-xs font-semibold text-muted">
              Duration
            </label>
            <input
              id="duration"
              type="text"
              value={filters.duration}
              onChange={handleFilterChange('duration')}
              placeholder="e.g. 3 months"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="paid" className="text-xs font-semibold text-muted">
              Paid / Unpaid
            </label>
            <select
              id="paid"
              value={filters.paid}
              onChange={handleFilterChange('paid')}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {paidOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-xs font-semibold text-muted">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={filters.location}
              onChange={handleFilterChange('location')}
              placeholder="Remote, On-campus"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="workType" className="text-xs font-semibold text-muted">
              Work type
            </label>
            <select
              id="workType"
              value={filters.workType}
              onChange={handleFilterChange('workType')}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {workTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="sort" className="text-xs font-semibold text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={handleFilterChange('sort')}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader label="Loading internships" />
        </div>
      ) : error ? (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{error}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <InternshipCard
              key={job.id}
              internship={job}
              onResumeChange={handleResumeInputChange}
              resumeValue={resumeInputs[job.id] ?? ''}
              onSubmit={handleSubmitApplication}
              isApplied={appliedJobIds.includes(job.id)}
              applyLoading={applyLoading && applyJobId === job.id}
            />
          ))}

          {!jobs.length && (
            <Card className="text-center text-sm text-muted">
              No opportunities found. Try adjusting your filters.
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Internships;
