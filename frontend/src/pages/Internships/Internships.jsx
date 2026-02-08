import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import InternshipCard from '../../components/InternshipCard/InternshipCard.jsx';
import {
  fetchInternships,
  applyToInternship,
} from '../../services/internship.api.js';
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

// Icons
const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const Internships = () => {
  const navigate = useNavigate();
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
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = filters.search;

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

  const handleViewDetails = (job) => {
    if (!job?.id) return;
    navigate(`/internship/${job.id}`);
  };

  const handleSubmitApplication = async (job) => {
    if (!job?.id) return;
    if (appliedJobIds.includes(job.id)) return;
    const resumeLink = resumeInputs[job.id];
    if (!resumeLink) {
      notify({ message: 'Please add your resume link before submitting.', variant: 'error' });
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
        message: 'Application submitted!',
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

  const activeFilterCount = [
    filters.skill,
    filters.duration,
    filters.location,
    filters.paid !== 'all' ? filters.paid : '',
    filters.workType !== 'all' ? filters.workType : '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <header>
        <h1 className="text-xl font-bold text-text-primary">Internships</h1>
        <p className="text-xs text-text-muted">Find opportunities that match your skills</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={handleFilterChange('search')}
          placeholder="Search internships..."
          className="input pl-12"
        />
      </div>

      {/* Filter Toggle & Active Filters */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`chip ${showFilters ? 'chip-active' : ''}`}
        >
          <FilterIcon className="h-3.5 w-3.5" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <div className="flex items-center gap-2">
          <select
            value={filters.sort}
            onChange={handleFilterChange('sort')}
            className="input py-2 text-xs"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <Card className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Filter by
            </span>
            <span className="text-xs text-text-muted">{jobs.length} results</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-text-muted">Skill</label>
              <input
                type="text"
                value={filters.skill}
                onChange={handleFilterChange('skill')}
                placeholder="e.g. React"
                className="input text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-muted">Duration</label>
              <input
                type="text"
                value={filters.duration}
                onChange={handleFilterChange('duration')}
                placeholder="e.g. 3 months"
                className="input text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-muted">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={handleFilterChange('location')}
                placeholder="Remote, On-site"
                className="input text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-muted">Paid</label>
              <select
                value={filters.paid}
                onChange={handleFilterChange('paid')}
                className="input text-sm"
              >
                {paidOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs text-text-muted">Work Type</label>
              <div className="flex flex-wrap gap-1.5">
                {workTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, workType: option.value }))}
                    className={`chip text-xs ${filters.workType === option.value ? 'chip-active' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader label="Loading internships" />
        </div>
      ) : error ? (
        <Card className="border-danger/20 bg-danger-soft text-danger text-sm">
          {error}
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <InternshipCard
              key={job.id}
              internship={job}
              onViewDetails={handleViewDetails}
              onResumeChange={handleResumeInputChange}
              resumeValue={resumeInputs[job.id] ?? ''}
              onSubmit={handleSubmitApplication}
              isApplied={appliedJobIds.includes(job.id)}
              applyLoading={applyLoading && applyJobId === job.id}
            />
          ))}

          {!jobs.length && (
            <Card className="py-8 text-center">
              <div className="mb-2 text-3xl">💼</div>
              <p className="text-sm text-text-secondary">No opportunities found</p>
              <p className="text-xs text-text-muted mt-1">Try adjusting your filters</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Internships;
