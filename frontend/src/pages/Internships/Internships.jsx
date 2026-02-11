import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import InternshipCard from '../../components/InternshipCard/InternshipCard.jsx';
import {
  fetchInternships,
} from '../../services/internship.api.js';
import { fetchHireJobs } from '../../services/hire.api.js';
import { getMyStartup } from '../../services/startup.api.js';

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

const BriefcaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const Internships = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters, ...parseFiltersFromParams(searchParams) }));
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // My Jobs state - simplified
  const [myStartup, setMyStartup] = useState(null);
  const [myJobsCount, setMyJobsCount] = useState(0);
  const [loadingMyJobs, setLoadingMyJobs] = useState(false);

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500); // 500ms debounce for smoother API calls
    return () => clearTimeout(handler);
  }, [filters.search]);

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

  const handleManualSearch = () => {
    setDebouncedSearch(filters.search);
    loadInternships();
  };

  useEffect(() => {
    const nextFilters = { ...defaultFilters, ...parseFiltersFromParams(searchParams) };
    setFilters((prev) => (areFiltersEqual(prev, nextFilters) ? prev : nextFilters));
  }, [searchParams]);

  useEffect(() => {
    loadInternships();
    loadMyStartupAndJobs();
  }, [loadInternships]);

  const loadMyStartupAndJobs = async () => {
    try {
      const startupData = await getMyStartup();
      if (startupData?.status === 'APPROVED' && startupData?.startup) {
        setMyStartup(startupData.startup);
        await loadMyJobsCount();
      }
    } catch (err) {
      console.error('Failed to load startup:', err);
    }
  };

  const loadMyJobsCount = async () => {
    setLoadingMyJobs(true);
    try {
      const data = await fetchHireJobs();
      const list = Array.isArray(data?.results) ? data.results : data || [];
      setMyJobsCount(list.length);
    } catch (err) {
      console.error('Failed to load my jobs:', err);
    } finally {
      setLoadingMyJobs(false);
    }
  };

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

  const handleViewDetails = (job) => {
    if (!job?.id) return;
    navigate(`/internship/${job.id}`);
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

      {/* My Posted Roles - Simplified card for startup founders */}
      {myStartup && (
        <Card
          className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
          onClick={() => navigate(`/startup/${myStartup.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">My Posted Roles</h2>
              <p className="text-xs text-text-muted">
                {loadingMyJobs ? 'Loading...' : `${myJobsCount} ${myJobsCount === 1 ? 'role' : 'roles'} posted`}
              </p>
            </div>
          </div>
          <span className="text-primary font-medium text-sm">Manage →</span>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={handleManualSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all z-10"
            aria-label="Submit search"
          >
            <SearchIcon className="h-4 w-4 text-primary" />
          </button>
          <input
            type="text"
            value={filters.search}
            onChange={handleFilterChange('search')}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
            placeholder="Search roles, companies, or skills..."
            className="input !pl-14 shadow-sm"
          />
        </div>
        <Button
          variant="primary"
          onClick={handleManualSearch}
          className="rounded-xl px-6 font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          Search
        </Button>
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
