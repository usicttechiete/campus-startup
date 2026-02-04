import { useEffect, useState } from 'react';
import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';

const maxTeamSizeOptions = [2, 3, 4, 5, 6];

const CreateTeamModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [teamName, setTeamName] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setTeamName('');
      setRequiredSkills('');
      setMaxTeamSize(4);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: teamName.trim(),
      requiredSkills: requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      maxSize: Number(maxTeamSize) || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-t-3xl bg-card shadow-xl sm:rounded-3xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-body">Create a new team</h2>
            <p className="text-xs text-muted">Set up a team and recruit members</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-surface hover:text-body"
            aria-label="Close create team modal"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <label htmlFor="teamName" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Team name
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(event) => {
                setTeamName(event.target.value);
                setErrors((prev) => ({ ...prev, teamName: undefined }));
              }}
              placeholder="e.g. Campus Builders"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {errors.teamName && <p className="text-xs text-danger">{errors.teamName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="requiredSkills" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Required skills
            </label>
            <input
              id="requiredSkills"
              type="text"
              value={requiredSkills}
              onChange={(event) => setRequiredSkills(event.target.value)}
              placeholder="List skills separated by commas"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-muted">Type React, Design, Product, Marketing, etc.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="teamSize" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Max team size
            </label>
            <select
              id="teamSize"
              value={maxTeamSize}
              onChange={(event) => setMaxTeamSize(event.target.value)}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {maxTeamSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} members
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading ? <Loader size="sm" inline label="Creating" /> : 'Create team'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
