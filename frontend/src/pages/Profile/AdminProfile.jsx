import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/Card/Card.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import { getMe, updateProfile, requestStudentUpgrade } from '../../services/user.api.js';
import { fetchInternships } from '../../services/internship.api.js';
import { formatLevel, formatTrustScore } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useRole } from '../../context/RoleContext.jsx';
import OnlineStatusDot from '../../components/OnlineStatusDot/OnlineStatusDot.jsx';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

const tabConfig = [
  { key: 'about', label: 'About' },
  { key: 'skills', label: 'Skills' },
  { key: 'teams', label: 'Internships Posted' },
  { key: 'events', label: 'Events Hosted' },
];

// Icons
const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AnimatedCard = ({ children, className = '', delay = 0, hover = true }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: 'easeOut', delay }}
    whileHover={hover ? { scale: 1.02 } : undefined}
    className={className}
  >
    {children}
  </motion.div>
);

const AdminProfile = () => {
  const { signOut } = useAuth();
  const { role, refreshRole } = useRole();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutInput, setAboutInput] = useState('');
  const [aboutError, setAboutError] = useState('');
  const [aboutLoading, setAboutLoading] = useState(false);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  // Student upgrade states
  const [studentUpgradeLoading, setStudentUpgradeLoading] = useState(false);
  const [studentUpgradeMessage, setStudentUpgradeMessage] = useState('');
  const [studentUpgradeSuccess, setStudentUpgradeSuccess] = useState(false);

  // Internships State
  const [postedInternships, setPostedInternships] = useState([]);
  const [internshipsLoading, setInternshipsLoading] = useState(false);

  // Online status hook
  const { isOnline } = useOnlineStatus(profile?.id);

  const getDisplayName = (currentProfile) => {
    if (currentProfile?.name) return currentProfile.name;
    if (currentProfile?.email) return currentProfile.email.split('@')[0];
    return 'Admin';
  };

  const handleSaveAbout = async () => {
    const trimmed = aboutInput.trim();
    const currentAbout = profile?.admin_about || '';

    if (trimmed === currentAbout) {
      setAboutError('No changes to save');
      return;
    }

    if (trimmed.length > 600) {
      setAboutError('About is too long (max 600 characters)');
      return;
    }

    setAboutLoading(true);
    setAboutError('');
    try {
      const updatedProfile = await updateProfile({ admin_about: trimmed });
      setProfile(updatedProfile);
      setIsEditingAbout(false);
      setAboutInput(updatedProfile?.admin_about || trimmed);
    } catch (err) {
      setAboutError(err.message || 'Failed to update about section. Please try again.');
    } finally {
      setAboutLoading(false);
    }
  };

  const handleCancelAboutEdit = () => {
    setIsEditingAbout(false);
    setAboutInput(profile?.admin_about || '');
    setAboutError('');
  };

  const handleAddSkill = () => {
    const trimmed = skillInputValue.trim();
    if (!trimmed) {
      setSkillsError('Skill cannot be empty');
      return;
    }
    if (trimmed.length > 40) {
      setSkillsError('Skill name is too long');
      return;
    }
    if (skillsDraft.some((skill) => skill.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsError('Skill already added');
      return;
    }
    setSkillsDraft((prev) => [...prev, trimmed]);
    setSkillInputValue('');
    setSkillsError('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsDraft((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    const normalizedSkills = normalizeSkills(skillsDraft);
    const previousSkills = Array.isArray(profile?.admin_skills) ? profile.admin_skills : [];

    if (skillsFingerprint(normalizedSkills) === skillsFingerprint(previousSkills)) {
      setSkillsError('No changes to save');
      return;
    }

    setSkillsLoading(true);
    setSkillsError('');
    try {
      const updatedProfile = await updateProfile({ admin_skills: normalizedSkills });
      setProfile(updatedProfile);
      setIsEditingSkills(false);
      const nextSkills = Array.isArray(updatedProfile?.admin_skills) ? updatedProfile.admin_skills : normalizedSkills;
      setSkillsDraft(nextSkills);
      setSkillInputValue('');
    } catch (err) {
      setSkillsError(err.message || 'Failed to update skills. Please try again.');
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleCancelSkillsEdit = () => {
    setIsEditingSkills(false);
    const resetSkills = Array.isArray(profile?.admin_skills) ? profile.admin_skills : [];
    setSkillsDraft(resetSkills);
    setSkillInputValue('');
    setSkillsError('');
  };

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMe();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!profile?.id) return;

    const loadInternships = async () => {
      setInternshipsLoading(true);
      try {
        // Fetch internships where the current user (admin) is the creator (company_id)
        // Note: The backend hire controller uses req.user.id as company_id when creating,
        // so we filter by company_id here.
        const data = await fetchInternships({ company_id: profile.id });
        setPostedInternships(data?.results || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load internships:', err);
      } finally {
        setInternshipsLoading(false);
      }
    };

    loadInternships();
  }, [profile?.id]);

  const normalizeSkills = (skills) => skills.map((skill) => skill.trim()).filter(Boolean);
  const skillsFingerprint = (skills) => normalizeSkills(skills).map((skill) => skill.toLowerCase()).sort().join('|');

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();

    if (trimmed.length < 3) {
      setNameError('Name must be at least 3 characters');
      return;
    }

    if (trimmed.length > 60) {
      setNameError('Name is too long');
      return;
    }

    try {
      setNameLoading(true);
      setNameError('');
      const updatedProfile = await updateProfile({ name: trimmed });
      setProfile(updatedProfile);
      setIsEditingName(false);
    } catch (error) {
      setNameError('Failed to update name. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Error updating name:', error);
    } finally {
      setNameLoading(false);
    }
  };

  const teamsJoined = useMemo(() => {
    if (!profile) return [];
    if (Array.isArray(profile.teams_joined)) return profile.teams_joined;
    return [];
  }, [profile]);

  const eventsParticipated = useMemo(() => {
    if (!profile) return [];
    if (Array.isArray(profile.events_participated)) return profile.events_participated;
    if (Array.isArray(profile.events_attended_list)) return profile.events_attended_list;
    if (Array.isArray(profile.events_organized)) return profile.events_organized;
    return [];
    return [];
  }, [profile]);

  const handleStudentUpgrade = async () => {
    setStudentUpgradeLoading(true);
    setStudentUpgradeMessage('');
    setStudentUpgradeSuccess(false);
    setError(null);

    try {
      const response = await requestStudentUpgrade();
      setStudentUpgradeMessage(response.message);
      setStudentUpgradeSuccess(response.success);

      if (response.success) {
        // Update the profile with the new role
        setProfile(response.profile);
        // Refresh the role context
        if (refreshRole) {
          await refreshRole();
        }
        // Reload the profile to get updated data
        await loadProfile();
      }
    } catch (err) {
      setStudentUpgradeMessage(err.message || 'Failed to process student upgrade request');
      setStudentUpgradeSuccess(false);
    } finally {
      setStudentUpgradeLoading(false);
    }
  };

  const tabContent = useMemo(() => {
    if (!profile) return null;
    switch (activeTab) {
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-body">Admin Skills</h3>
              {isEditingSkills ? null : (
                <Button size="xs" variant="ghost" onClick={() => setIsEditingSkills(true)} className="text-primary hover:bg-surface rounded-full">
                  Edit
                </Button>
              )}
            </div>

            {isEditingSkills ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    value={skillInputValue}
                    onChange={(event) => {
                      setSkillInputValue(event.target.value);
                      setSkillsError('');
                    }}
                    placeholder="Add a skill"
                    className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                  />
                  <Button type="button" size="sm" variant="primary" onClick={handleAddSkill} disabled={skillsLoading} className="rounded-full px-4">
                    Add
                  </Button>
                </div>

                {skillsError ? <p className="text-xs text-danger">{skillsError}</p> : null}

                <div className="flex flex-wrap gap-2">
                  {skillsDraft.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="rounded-full bg-surface px-3 py-2 text-xs text-body hover:bg-danger/5 hover:text-danger transition-colors"
                    >
                      {skill} ✕
                    </button>
                  ))}
                  {!skillsDraft.length ? <p className="text-sm text-muted">No skills added yet.</p> : null}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="primary" onClick={handleSaveSkills} disabled={skillsLoading} className="rounded-full px-5">
                    {skillsLoading ? <Loader size="sm" inline /> : 'Save'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelSkillsEdit} disabled={skillsLoading} className="rounded-full hover:bg-surface">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {(profile.admin_skills || []).map((skill) => (
                  <div key={skill} className="rounded-2xl bg-surface px-4 py-3 text-body transition duration-200 hover:bg-primary/5 hover:scale-[1.01]">
                    {skill}
                  </div>
                ))}
                {!(profile.admin_skills || []).length ? <p className="text-sm text-muted">No skills added yet.</p> : null}
              </div>
            )}
          </div>
        );
      case 'teams':
        return (
          <div className="space-y-3">
            {internshipsLoading ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" />
              </div>
            ) : postedInternships.length ? (
              postedInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="rounded-2xl bg-card border border-border p-4 transition duration-200 hover:shadow-md hover:scale-[1.01]"
                >
                  <p className="text-body font-semibold mb-2">{internship.role_title}</p>
                  <p className="text-xs text-muted mb-1 line-clamp-2">{internship.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="neutral" className="bg-surface/50 text-[10px]">
                      {internship.type}
                    </Badge>
                    {/* Add more details if available, like applicants count */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No internships posted yet. Start creating opportunities for students.</p>
            )}
          </div>
        );
      case 'events':
        return (
          <div className="space-y-3">
            {eventsParticipated.length ? (
              eventsParticipated.map((event) => (
                <div
                  key={event.id || event.event_id || event.title}
                  className="rounded-2xl bg-card border border-border p-4 transition duration-200 hover:shadow-md hover:scale-[1.01]"
                >
                  <p className="text-body font-semibold mb-2">{event.title || event.name}</p>
                  {event.role && <p className="text-xs text-muted mb-1">Role: {event.role}</p>}
                  {event.stage && <p className="text-xs text-muted mb-1">Stage: {event.stage}</p>}
                  {event.result && <p className="text-xs text-success">Outcome: {event.result}</p>}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No events hosted yet. Start organizing events to engage the community.</p>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-body">About</h3>
                {isEditingAbout ? null : (
                  <Button size="xs" variant="ghost" onClick={() => setIsEditingAbout(true)} className="text-primary hover:bg-surface rounded-full">
                    Edit
                  </Button>
                )}
              </div>

              {isEditingAbout ? (
                <div className="space-y-4">
                  <textarea
                    value={aboutInput}
                    onChange={(event) => {
                      setAboutInput(event.target.value);
                      setAboutError('');
                    }}
                    rows={5}
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed outline-none transition focus:ring-2 focus:ring-primary"
                    placeholder="Write something about your admin profile..."
                  />
                  {aboutError ? <p className="text-xs text-danger">{aboutError}</p> : null}
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleSaveAbout} disabled={aboutLoading} className="rounded-full px-5">
                      {aboutLoading ? <Loader size="sm" inline /> : 'Save'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelAboutEdit} disabled={aboutLoading} className="rounded-full hover:bg-surface">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  {profile.admin_about ||
                    'Admin profile - manage events, oversee activities, and support the campus ecosystem.'}
                </p>
              )}
            </div>
          </div>
        );
    }
  }, [
    activeTab,
    profile,
    teamsJoined,
    eventsParticipated,
    aboutInput,
    aboutError,
    aboutLoading,
    isEditingAbout,
    isEditingSkills,
    skillInputValue,
    skillsDraft,
    skillsError,
    skillsLoading,
    internshipsLoading,
    postedInternships,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader label="Loading profile" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-danger/20 bg-danger/5 text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md space-y-6 px-3 py-4">
      <header className="space-y-4">
        <AnimatedCard
          delay={0}
          className="rounded-3xl bg-gradient-to-br from-primary/5 via-surface to-primary/10 p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-4">
              <div className="relative">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-md">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white">
                      {getDisplayName(profile)[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1">
                  <OnlineStatusDot isOnline={isOnline} size="small" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="level" className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-body">
                    Level {profile.level_badge || profile.level || formatLevel(profile.level) || 'Explorer'}
                  </Badge>
                  <Badge variant="primary" className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-black shadow-sm">
                    ADMIN
                  </Badge>
                  {typeof profile.xp_points === 'number' && (
                    <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                      {profile.xp_points} XP
                    </Badge>
                  )}
                </div>
                {!isEditingName ? (
                  <div className="mt-2 flex items-center gap-2">
                    <h1 className="text-xl font-bold text-body tracking-tight">{getDisplayName(profile)}</h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="rounded-full px-2 py-1 text-xs text-muted transition duration-200 hover:bg-surface hover:text-primary hover:rotate-6"
                      aria-label="Edit name"
                    >
                      ✏️
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <input
                      value={nameInput}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (!/^[A-Za-z ]*$/.test(value)) return;
                        setNameInput(value);
                        setNameError('');
                      }}
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                    {nameError && <p className="text-xs text-danger">{nameError}</p>}
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={handleSaveName} disabled={nameLoading}>
                        {nameLoading ? <Loader size="sm" inline /> : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="transition duration-200 hover:bg-surface hover:scale-[1.03] active:scale-[0.97]"
                        onClick={() => {
                          setIsEditingName(false);
                          setNameInput(profile.name);
                          setNameError('');
                        }}
                        disabled={nameLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted">Only letters and spaces allowed.</p>
                  </div>
                )}
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {profile.college && profile.course && profile.branch && profile.year ? (
                    <>
                      {profile.course} - {profile.branch} • Year {profile.year}
                      <br />
                      {profile.college}
                    </>
                  ) : (
                    profile.batch ? `${profile.batch} • ` : ''
                  )}
                  {profile.academic_year || profile.program || ''}
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">{profile.tagline || profile.headline || ''}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {role !== 'admin' ? (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="rounded-full px-5 py-2 shadow-sm transition duration-200 hover:shadow hover:scale-[1.03] active:scale-[0.97]"
                    onClick={handleStudentUpgrade}
                    disabled={studentUpgradeLoading}
                  >
                    {studentUpgradeLoading ? <Loader size="sm" inline /> : 'Become a Student'}
                  </Button>
                  {studentUpgradeMessage && (
                    <p className={`text-xs text-center ${studentUpgradeSuccess ? 'text-green-600' : 'text-red-600'}`}>
                      {studentUpgradeMessage}
                    </p>
                  )}
                </div>
              ) : null}
              <Button variant="ghost" size="icon" onClick={signOut} className="text-primary hover:bg-surface rounded-full">
                Log out
              </Button>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard
          delay={0.1}
          className="rounded-2xl bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-body">{formatTrustScore(profile.trust_score)}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Trust Score</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-body">{profile.projects_joined ?? teamsJoined.length ?? 0}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Teams</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-body">{profile.events_attended ?? eventsParticipated.length ?? 0}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Events Joined</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-body">{postedInternships.length || 0}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Internships Posted</p>
            </div>
          </div>
        </AnimatedCard>
      </header>

      {profile.college && profile.course && profile.branch && profile.year && (
        <AnimatedCard
          delay={0.2}
          className="rounded-2xl bg-card border border-border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <h3 className="text-sm font-semibold text-body mb-4">Academic Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-body">College</span>
              <span className="text-muted">{profile.college}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-body">Course</span>
              <span className="text-muted">{profile.course}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-body">Branch</span>
              <span className="text-muted">{profile.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-body">Year</span>
              <span className="text-muted">{profile.year}</span>
            </div>
          </div>
        </AnimatedCard>
      )}

      <AnimatedCard
        delay={0.3}
        className="rounded-2xl bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${tab.key === activeTab
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-muted hover:bg-primary/5 hover:text-body'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          {tabContent}
        </div>
      </AnimatedCard>

    </div>
  );
};

export default AdminProfile;
