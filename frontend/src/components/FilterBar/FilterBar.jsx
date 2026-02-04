import { useMemo } from 'react';
import clsx from 'clsx';

const FilterBar = ({ filters = [], activeFilter, onFilterChange }) => {
  const buttons = useMemo(
    () =>
      filters.map((filter) => ({
        value: filter.value,
        label: filter.label,
        isActive: activeFilter === filter.value,
      })),
    [filters, activeFilter]
  );

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {buttons.map((button) => (
        <button
          key={button.value}
          onClick={() => onFilterChange(button.value)}
          className={clsx(
            'chip',
            button.isActive && 'chip-active'
          )}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
