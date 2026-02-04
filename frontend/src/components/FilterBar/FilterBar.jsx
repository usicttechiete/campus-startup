import { useMemo } from 'react';
import clsx from 'clsx';

const FilterBar = ({ filters = [], activeFilter, onFilterChange, trailingAction }) => {
  const items = useMemo(() => filters.filter(Boolean), [filters]);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-card p-2 shadow-card">
      {items.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange?.(filter.value)}
          className={clsx(
            'rounded-full px-4 py-2 text-xs font-semibold transition',
            activeFilter === filter.value
              ? 'bg-primary text-white shadow-soft'
              : 'bg-surface text-muted hover:text-body',
          )}
        >
          {filter.label}
        </button>
      ))}
      {trailingAction ? <div className="ml-auto flex items-center">{trailingAction}</div> : null}
    </div>
  );
};

export default FilterBar;
