import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../../components/Card/Card.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import OnlineStatusDot from '../../components/OnlineStatusDot/OnlineStatusDot.jsx';
import AvailabilityToggle from '../../components/AvailabilityToggle/AvailabilityToggle.jsx';
import DebugOnlineStatus from '../../components/DebugOnlineStatus/DebugOnlineStatus.jsx';
import { getMe, updateProfile, requestAdminUpgrade } from '../../services/user.api.js';
import { createStartup, deleteMyStartup, getMyStartup } from '../../services/startup.api.js';
import { formatLevel, formatTrustScore } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useRole } from '../../context/RoleContext.jsx';
import { useOnlineStatus, useAvailability } from '../../hooks/useOnlineStatus.js';
import { fetchFeed, createFeedPost } from '../../services/feed.api.js';
import { fetchMyApplications } from '../../services/internship.api.js';
import PostCard from '../../components/PostCard/PostCard.jsx';

const tabConfig = [
  { key: 'about', label: 'About' },
  { key: 'skills', label: 'Skills' },
  { key: 'teams', label: 'Teams Joined' },
  { key: 'events', label: 'Events' },
];

const initialFormState = {
  title: '',
  description: '',
  stage: 'Ideation',
  required_skills: '',
  post_type: 'project',
};

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

const ProfileSkeleton = () => (
  <div className="mx-auto max-w-md space-y-6 px-3 py-4">
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-28 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-72 max-w-full rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
      <p className="mt-4 text-sm text-muted">Loading your profile… please wait</p>
    </div>

    <div className="grid grid-cols-3 gap-2 rounded-3xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
      <div className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
      <div className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
    </div>

    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>

    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-20 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-9 w-20 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-4 rounded-3xl border border-border/60 bg-card p-4">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const StudentProfile = () => {
  const { signOut } = useAuth();
  const { role, refreshRole } = useRole();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [bioError, setBioError] = useState('');
  const [bioLoading, setBioLoading] = useState(false);

  const [startupLoading, setStartupLoading] = useState(false);
  const [startupError, setStartupError] = useState('');
  const [startupStatus, setStartupStatus] = useState('NONE');
  const [startupStatusMessage, setStartupStatusMessage] = useState('');
  const [startupReapplyAfter, setStartupReapplyAfter] = useState(null);
  const [myStartup, setMyStartup] = useState(null);
  const [startupLoadedOnce, setStartupLoadedOnce] = useState(false);

  const [startupName, setStartupName] = useState('');
  const [startupProblem, setStartupProblem] = useState('');
  const [startupDomain, setStartupDomain] = useState('');
  const [startupStage, setStartupStage] = useState('IDEA');
  const [startupTotalMembers, setStartupTotalMembers] = useState('');
  const [startupHeadName, setStartupHeadName] = useState('');
  const [startupHeadEmail, setStartupHeadEmail] = useState('');
  const [startupRevenue, setStartupRevenue] = useState(false);
  const [startupActive, setStartupActive] = useState(true);
  const [startupSubmitLoading, setStartupSubmitLoading] = useState(false);
  const [startupSubmitError, setStartupSubmitError] = useState('');

  // Applied Section States
  const [myApplications, setMyApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [resumeInput, setResumeInput] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState('');

  const normalizeSkills = (skills) => skills.map((skill) => skill.trim()).filter(Boolean);
  const skillsFingerprint = (skills) => normalizeSkills(skills).map((skill) => skill.toLowerCase()).sort().join('|');

  // Admin upgrade states
  const [adminUpgradeLoading, setAdminUpgradeLoading] = useState(false);
  const [adminUpgradeMessage, setAdminUpgradeMessage] = useState('');
  const [adminUpgradeSuccess, setAdminUpgradeSuccess] = useState(false);

  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  // Activity Section States
  const [activityTab, setActivityTab] = useState('projects'); // 'projects' | 'updates'
  const [activityPosts, setActivityPosts] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');

  // Create Post States
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const postTypes = [
    { label: 'Project', value: 'project' },
    { label: 'Update', value: 'work_update' },
    { label: 'Idea', value: 'startup_idea' },
  ];

  // Online status and availability hooks
  const { isOnline } = useOnlineStatus(profile?.id);
  const { isAvailable, loading: availabilityLoading, toggleAvailability } = useAvailability(
    profile?.id,
    profile?.available_to_work
  );

  const getDisplayName = (currentProfile) => {
    if (currentProfile?.name) return currentProfile.name;
    if (currentProfile?.email) return currentProfile.email.split('@')[0];
    return 'User';
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

  const loadApplications = async () => {
    setApplicationsLoading(true);
    try {
      const data = await fetchMyApplications();
      console.log('STUDENT_PROFILE: My Applications raw data:', data);
      setMyApplications(data?.results || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleSaveResume = async () => {
    const trimmed = resumeInput.trim();
    if (trimmed && !/^https?:\/\/.+/.test(trimmed)) {
      setResumeError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    setResumeLoading(true);
    setResumeError('');
    try {
      const updatedProfile = await updateProfile({ resume_link: trimmed });
      setProfile(updatedProfile);
      setIsEditingResume(false);
    } catch (err) {
      setResumeError(err.message || 'Failed to update resume link');
    } finally {
      setResumeLoading(false);
    }
  };

  const handleDeactivateStartup = async () => {
    const confirmed = window.confirm('Deactivate your startup? This will remove it from your profile.');
    if (!confirmed) return;

    setStartupSubmitLoading(true);
    setStartupSubmitError('');
    try {
      await deleteMyStartup();
      setStartupStatus('NONE');
      setStartupStatusMessage('');
      setStartupReapplyAfter(null);
      setMyStartup(null);
      setStartupLoadedOnce(true);
    } catch (err) {
      setStartupSubmitError(err.message || 'Failed to deactivate startup');
    } finally {
      setStartupSubmitLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadApplications();
  }, []);

  useEffect(() => {
    if (profile?.resume_link) {
      setResumeInput(profile.resume_link);
    }
  }, [profile?.resume_link]);

  const tabsToRender = useMemo(() => {
    if (role === 'student') {
      return [...tabConfig, { key: 'applied', label: 'Applied' }, { key: 'startup', label: 'Add Your Startup' }];
    }
    return tabConfig;
  }, [role, tabConfig]);

  useEffect(() => {
    if (activeTab === 'applied') {
      loadApplications();
    }
  }, [activeTab]);

  useEffect(() => {
    if (role !== 'student' && activeTab === 'startup') {
      setActiveTab('about');
    }
  }, [role, activeTab]);

  useEffect(() => {
    if (role !== 'student') return;
    if (activeTab !== 'startup') return;
    if (startupLoadedOnce) return;

    const loadStartup = async () => {
      setStartupLoading(true);
      setStartupError('');
      try {
        const data = await getMyStartup();
        if (!data) {
          setStartupStatus('NONE');
          setStartupStatusMessage('');
          setStartupReapplyAfter(null);
          setMyStartup(null);
        } else if (data?.status === 'APPROVED') {
          setStartupStatus('APPROVED');
          setStartupStatusMessage('');
          setStartupReapplyAfter(null);
          setMyStartup(data?.startup || null);
        } else if (data?.status === 'PENDING') {
          setStartupStatus('PENDING');
          setStartupStatusMessage(data?.message || 'Application submitted. Please stay tuned for updates.');
          setStartupReapplyAfter(null);
          setMyStartup(null);
        } else if (data?.status === 'REJECTED') {
          setStartupStatus('REJECTED');
          setStartupStatusMessage(data?.message || 'Your application was denied.');
          setStartupReapplyAfter(data?.reapply_after || null);
          setMyStartup(null);
        } else {
          setStartupStatus('NONE');
          setStartupStatusMessage('');
          setStartupReapplyAfter(null);
          setMyStartup(null);
        }
      } catch (err) {
        setStartupError(err.message || 'Unable to load your startup');
      } finally {
        setStartupLoadedOnce(true);
        setStartupLoading(false);
      }
    };

    loadStartup();
    loadStartup();
  }, [activeTab, role, startupLoadedOnce]);

  useEffect(() => {
    if (!profile?.id) return;

    const loadActivity = async () => {
      setActivityLoading(true);
      setActivityError('');
      try {
        const data = await fetchFeed({ author_id: profile.id });
        setActivityPosts(data?.results || []);
      } catch (err) {
        setActivityError('Failed to load activity');
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivity();
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.name) {
      setNameInput(profile.name);
    }
    if (profile) {
      const nextSkills = Array.isArray(profile.skills) ? profile.skills : [];
      setSkillsDraft(nextSkills);
      setBioInput(profile.bio || profile.about || '');
    }
  }, [profile]);

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
    return [];
    if (Array.isArray(profile.events_attended_list)) return profile.events_attended_list;
    return [];
  }, [profile]);

  const { projectsPosted, updatesPosted } = useMemo(() => {
    const projects = [];
    const updates = [];
    activityPosts.forEach((post) => {
      if (post.post_type === 'project' || post.post_type === 'startup_idea') {
        projects.push(post);
      } else if (post.post_type === 'work_update') {
        updates.push(post);
      }
    });
    return { projectsPosted: projects, updatesPosted: updates };
  }, [activityPosts]);

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
    const previousSkills = Array.isArray(profile?.skills) ? profile.skills : [];

    if (skillsFingerprint(normalizedSkills) === skillsFingerprint(previousSkills)) {
      setSkillsError('No changes to save');
      return;
    }

    setSkillsLoading(true);
    setSkillsError('');
    try {
      const updatedProfile = await updateProfile({ skills: normalizedSkills });
      setProfile(updatedProfile);
      setIsEditingSkills(false);
      const nextSkills = Array.isArray(updatedProfile?.skills) ? updatedProfile.skills : normalizedSkills;
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
    const resetSkills = Array.isArray(profile?.skills) ? profile.skills : [];
    setSkillsDraft(resetSkills);
    setSkillInputValue('');
    setSkillsError('');
  };

  const handleSaveBio = async () => {
    const trimmed = bioInput.trim();
    const currentBio = profile?.bio || profile?.about || '';

    if (trimmed === currentBio) {
      setBioError('No changes to save');
      return;
    }

    if (trimmed.length > 600) {
      setBioError('Bio is too long (max 600 characters)');
      return;
    }
    setBioLoading(true);
    setBioError('');
    try {
      const updatedProfile = await updateProfile({ bio: trimmed });
      setProfile(updatedProfile);
      setIsEditingBio(false);
      setBioInput(updatedProfile?.bio || updatedProfile?.about || trimmed);
    } catch (err) {
      setBioError(err.message || 'Failed to update about section. Please try again.');
    } finally {
      setBioLoading(false);
    }
  };

  const handleCancelBioEdit = () => {
    setIsEditingBio(false);
    setBioInput(profile?.bio || profile?.about || '');
    setBioError('');
  };

  const handleCreateStartup = async (event) => {
    event.preventDefault();

    const payload = {
      name: startupName.trim(),
      problem: startupProblem.trim(),
      domain: startupDomain.trim(),
      stage: startupStage,
      total_members: startupTotalMembers === '' ? null : Number(startupTotalMembers),
      head_name: startupHeadName.trim(),
      head_email: startupHeadEmail.trim(),
      revenue: Boolean(startupRevenue),
      active: Boolean(startupActive),
    };

    if (!payload.name) {
      setStartupSubmitError('Startup name is required');
      return;
    }
    if (!payload.problem) {
      setStartupSubmitError('Problem statement is required');
      return;
    }
    if (!payload.domain) {
      setStartupSubmitError('Domain is required');
      return;
    }
    if (!payload.stage) {
      setStartupSubmitError('Stage is required');
      return;
    }
    if (!payload.head_name) {
      setStartupSubmitError('Head name is required');
      return;
    }
    if (!payload.head_email) {
      setStartupSubmitError('Head email is required');
      return;
    }

    if (!payload.active) {
      setStartupSubmitError('Active startup must be set to Yes to submit an application.');
      return;
    }

    setStartupSubmitLoading(true);
    setStartupSubmitError('');
    try {
      const response = await createStartup(payload);
      setStartupStatus(response?.status || 'PENDING');
      setStartupStatusMessage(response?.message || 'Application submitted. Please stay tuned for updates.');
      setStartupReapplyAfter(null);
      setMyStartup(null);
      setStartupLoadedOnce(true);
    } catch (err) {
      setStartupSubmitError(err.message || 'Failed to create startup');
    } finally {
      setStartupSubmitLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'startup':
        if (role !== 'student') {
          return null;
        }

        if (startupLoading) {
          return (
            <div className="py-6">
              <Loader label="Loading startup" />
            </div>
          );
        }

        if (startupError) {
          return (
            <Card className="border border-danger/20 bg-danger/5 text-danger">
              <p className="text-sm">{startupError}</p>
            </Card>
          );
        }

        const reapplyDate = startupReapplyAfter ? new Date(startupReapplyAfter) : null;
        const isReapplyLocked =
          startupStatus === 'REJECTED' && reapplyDate && !Number.isNaN(reapplyDate.getTime()) && new Date() <= reapplyDate;

        if (startupStatus === 'PENDING') {
          return (
            <Card className="space-y-2 border border-border/60 bg-card p-5 shadow-sm">
              <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                PENDING
              </Badge>
              <p className="text-sm text-body leading-relaxed">{startupStatusMessage || 'Application submitted. Please stay tuned for updates.'}</p>
            </Card>
          );
        }

        if (startupStatus === 'REJECTED' && isReapplyLocked) {
          return (
            <Card className="space-y-2 border border-border/60 bg-card p-5 shadow-sm">
              <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                REJECTED
              </Badge>
              <p className="text-sm text-body leading-relaxed">{startupStatusMessage || 'Your application was denied.'}</p>
              <p className="text-xs text-muted">You can reapply after {reapplyDate.toLocaleString()}.</p>
            </Card>
          );
        }

        if (startupStatus === 'APPROVED' && myStartup) {
          return (
            <div className="space-y-4">
              <Card className="space-y-3 border border-border/60 bg-card p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-body tracking-tight">{myStartup.name}</p>
                    <p className="mt-1 text-xs text-muted">{myStartup.domain || '—'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {myStartup.stage ? (
                      <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                        {myStartup.stage}
                      </Badge>
                    ) : null}
                    <Badge
                      variant={myStartup.active ? 'success' : 'neutral'}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {myStartup.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={myStartup.revenue ? 'primary' : 'neutral'} className="rounded-full px-3 py-1 text-xs font-semibold">
                      {myStartup.revenue ? 'Revenue' : 'No Revenue'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted">What are you solving?</p>
                    <p className="mt-1 text-sm text-body">{myStartup.problem || '—'}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-muted">Total Members</p>
                      <p className="mt-1 text-sm text-body">{myStartup.total_members ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted">Head</p>
                      <p className="mt-1 text-sm text-body">{myStartup.head_name || '—'}</p>
                      <p className="text-xs text-muted">{myStartup.head_email || ''}</p>
                    </div>
                  </div>
                </div>
              </Card>
              {myStartup.id && (
                <Button
                  type="button"
                  size="sm"
                  variant="subtle"
                  className="w-full rounded-full"
                  onClick={() => navigate(`/startup/${myStartup.id}`)}
                >
                  View startup page
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="w-full rounded-full text-danger transition duration-200 hover:bg-surface hover:scale-[1.03] active:scale-[0.97]"
                onClick={handleDeactivateStartup}
                disabled={startupSubmitLoading}
              >
                {startupSubmitLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader size="sm" inline />
                    Please wait…
                  </span>
                ) : (
                  'Deactivate startup'
                )}
              </Button>
              <p className="text-xs text-muted">You can only create one startup.</p>
            </div>
          );
        }

        const disableForm = startupSubmitLoading || startupStatus === 'PENDING' || startupStatus === 'APPROVED' || isReapplyLocked;

        return (
          <form className="space-y-5" onSubmit={handleCreateStartup}>
            {startupStatus === 'REJECTED' ? (
              <Card className="space-y-2 border border-border/60 bg-card p-5 shadow-sm">
                <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                  REJECTED
                </Badge>
                <p className="text-sm text-body leading-relaxed">{startupStatusMessage || 'Your application was denied.'}</p>
                {reapplyDate && !Number.isNaN(reapplyDate.getTime()) ? (
                  <p className="text-xs text-muted">You can reapply after {reapplyDate.toLocaleString()}.</p>
                ) : null}
              </Card>
            ) : null}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Startup Name</label>
              <input
                value={startupName}
                onChange={(event) => {
                  setStartupName(event.target.value);
                  setStartupSubmitError('');
                }}
                required
                disabled={disableForm}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter startup name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">What are you solving?</label>
              <textarea
                value={startupProblem}
                onChange={(event) => {
                  setStartupProblem(event.target.value);
                  setStartupSubmitError('');
                }}
                rows={4}
                disabled={disableForm}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe the problem you are solving"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Domain</label>
                <input
                  value={startupDomain}
                  onChange={(event) => {
                    setStartupDomain(event.target.value);
                    setStartupSubmitError('');
                  }}
                  disabled={disableForm}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. FinTech"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Current Stage</label>
                <select
                  value={startupStage}
                  onChange={(event) => {
                    setStartupStage(event.target.value);
                    setStartupSubmitError('');
                  }}
                  disabled={disableForm}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  {['IDEA', 'MVP', 'SCALING'].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted">Total Members</label>
              <input
                type="number"
                min={1}
                value={startupTotalMembers}
                onChange={(event) => {
                  setStartupTotalMembers(event.target.value);
                  setStartupSubmitError('');
                }}
                disabled={disableForm}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 3"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Head Name</label>
                <input
                  value={startupHeadName}
                  onChange={(event) => {
                    setStartupHeadName(event.target.value);
                    setStartupSubmitError('');
                  }}
                  disabled={disableForm}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Head Email</label>
                <input
                  type="email"
                  value={startupHeadEmail}
                  onChange={(event) => {
                    setStartupHeadEmail(event.target.value);
                    setStartupSubmitError('');
                  }}
                  disabled={disableForm}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted">Revenue Generating?</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={startupRevenue ? 'primary' : 'ghost'}
                    onClick={() => setStartupRevenue(true)}
                    className="flex-1"
                    disabled={disableForm}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!startupRevenue ? 'primary' : 'ghost'}
                    onClick={() => setStartupRevenue(false)}
                    className="flex-1"
                    disabled={disableForm}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted">Active Startup?</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={startupActive ? 'primary' : 'ghost'}
                    onClick={() => setStartupActive(true)}
                    className="flex-1"
                    disabled={disableForm}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!startupActive ? 'primary' : 'ghost'}
                    onClick={() => setStartupActive(false)}
                    className="flex-1"
                    disabled={disableForm}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>

            {startupSubmitError ? <p className="text-xs text-danger">{startupSubmitError}</p> : null}
            <Button
              type="submit"
              variant="primary"
              className="w-full transition duration-200 hover:scale-[1.03] active:scale-[0.97]"
              disabled={disableForm}
            >
              {startupSubmitLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader size="sm" inline />
                  Please wait…
                </span>
              ) : (
                'Create startup'
              )}
            </Button>
            <p className="text-xs text-muted">You can only create one startup.</p>
          </form>
        );
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-body">Skills</h3>
              {isEditingSkills ? null : (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setIsEditingSkills(true);
                    const nextSkills = Array.isArray(profile.skills) ? profile.skills : [];
                    setSkillsDraft(nextSkills);
                    setSkillInputValue('');
                    setSkillsError('');
                  }}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditingSkills ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skillsDraft.length ? (
                    skillsDraft.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-body"
                      >
                        {skill}
                        <button
                          type="button"
                          className="rounded-full px-2 py-1 text-xs text-danger transition hover:bg-surface"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No skills added yet.</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={skillInputValue}
                    onChange={(event) => {
                      setSkillInputValue(event.target.value);
                      setSkillsError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a skill and press enter"
                    className="flex-1 min-w-[180px] rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" variant="primary" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>

                {skillsError ? <p className="text-xs text-danger">{skillsError}</p> : null}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="transition duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    onClick={handleSaveSkills}
                    disabled={skillsLoading}
                  >
                    {skillsLoading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader size="sm" inline />
                        Please wait…
                      </span>
                    ) : (
                      'Save skills'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="transition duration-200 hover:bg-surface hover:scale-[1.03] active:scale-[0.97]"
                    onClick={handleCancelSkillsEdit}
                    disabled={skillsLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="grid gap-2 text-sm text-muted">
                {(profile.skills || []).map((skill) => (
                  <li key={skill} className="rounded-2xl bg-surface px-4 py-3 text-body">
                    {skill}
                  </li>
                ))}
                {!(profile.skills || []).length ? <p>No skills added yet.</p> : null}
              </ul>
            )}
          </div>
        );
      case 'teams':
        return (
          <div className="space-y-3 text-sm text-muted">
            {teamsJoined.length ? (
              teamsJoined.map((team) => (
                <Card
                  key={team.id || team.team_id || team.name}
                  className="space-y-1 border border-border/60 bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <p className="text-body font-semibold">{team.name || team.team_name}</p>
                  {team.event_name && <p className="text-xs text-muted">Event: {team.event_name}</p>}
                  {team.role && <p className="text-xs text-muted">Role: {team.role}</p>}
                </Card>
              ))
            ) : (
              <p>No teams yet. Join events to collaborate with fellow builders.</p>
            )}
          </div>
        );
      case 'applied':
        return (
          <div className="space-y-6">
            {/* Resume Section */}
            <div className="space-y-3">
              <div
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-border/60 bg-surface p-4 transition hover:bg-surface/80"
                onClick={() => setIsEditingResume(!isEditingResume)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <h3 className="text-sm font-semibold text-body">Your Resume</h3>
                    <p className="text-xs text-muted">
                      {profile?.resume_link ? 'Link added' : 'No resume link added yet'}
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: isEditingResume ? 180 : 0 }}
                  className="text-muted"
                >
                  ▼
                </motion.span>
              </div>

              {isEditingResume && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
                >
                  <p className="text-xs text-muted mb-2">Provide a public link to your resume (Drive, Dropbox, etc.)</p>
                  <input
                    value={resumeInput}
                    onChange={(e) => {
                      setResumeInput(e.target.value);
                      setResumeError('');
                    }}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                  />
                  {resumeError && <p className="text-xs text-danger">{resumeError}</p>}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveResume}
                      disabled={resumeLoading}
                    >
                      {resumeLoading ? <Loader size="sm" inline /> : 'Save Link'}
                    </Button>
                    {profile?.resume_link && (
                      <Button
                        size="sm"
                        variant="ghost"
                        as="a"
                        href={profile.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Internships Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-body px-1">Applied Internships</h3>
              {applicationsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader />
                </div>
              ) : myApplications.length ? (
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <Card
                      key={app.id}
                      className="space-y-2 border border-border/60 bg-card p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-body">{app.job?.role_title || 'Internship'}</p>
                          <p className="text-xs text-muted">{app.job?.company_name || 'Project Team'}</p>
                        </div>
                        <Badge
                          variant={
                            app.status === 'Accepted'
                              ? 'success'
                              : app.status === 'Rejected'
                                ? 'danger'
                                : 'primary'
                          }
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        >
                          {app.status}
                        </Badge>
                      </div>

                      <div className="mt-2 rounded-xl bg-surface/50 p-3">
                        {app.status === 'Accepted' ? (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-success">
                              🎉 Congratulations! You have been selected.
                            </p>
                            <p className="text-[11px] leading-relaxed text-muted">
                              The admin will contact you shortly on your registered email id.
                            </p>
                          </div>
                        ) : app.status === 'Rejected' ? (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-danger">
                              Sorry, your application has been rejected.
                            </p>
                            {app.rejection_reason && (
                              <p className="text-[11px] leading-relaxed text-muted">
                                <span className="font-semibold">Reason:</span> {app.rejection_reason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted italic">
                            Applied for, please wait for updates.
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted">You haven't applied to any internships yet.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-primary"
                    onClick={() => navigate('/hire')}
                  >
                    Browse Internships
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-3 text-sm text-muted">
            {eventsParticipated.length ? (
              eventsParticipated.map((event) => (
                <Card
                  key={event.id || event.event_id || event.title}
                  className="space-y-1 border border-border/60 bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <p className="text-body font-semibold">{event.title || event.name}</p>
                  {event.role && <p className="text-xs text-muted">Role: {event.role}</p>}
                  {event.stage && <p className="text-xs text-muted">Stage: {event.stage}</p>}
                  {event.result && <p className="text-xs text-success">Outcome: {event.result}</p>}
                </Card>
              ))
            ) : (
              <p>No event participation recorded yet. Explore events to start building your track record.</p>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-body">About</h3>
                {isEditingBio ? null : (
                  <Button size="xs" variant="ghost" onClick={() => setIsEditingBio(true)}>
                    Edit
                  </Button>
                )}
              </div>
              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={bioInput}
                    onChange={(event) => {
                      setBioInput(event.target.value);
                      setBioError('');
                    }}
                    rows={4}
                    placeholder="Share your passions, projects, and what you're looking to build."
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed outline-none transition focus:ring-2 focus:ring-primary"
                  />
                  {bioError ? <p className="text-xs text-danger">{bioError}</p> : null}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="transition duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      onClick={handleSaveBio}
                      disabled={bioLoading}
                    >
                      {bioLoading ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Loader size="sm" inline />
                          Please wait…
                        </span>
                      ) : (
                        'Save about'
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition duration-200 hover:bg-surface hover:scale-[1.03] active:scale-[0.97]"
                      onClick={handleCancelBioEdit}
                      disabled={bioLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  {profile.bio ||
                    profile.about ||
                    'Add a short bio to tell others about your passions, projects, and what you are looking to build.'}
                </p>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-body">Work Availability</h3>
              <AvailabilityToggle
                isAvailable={isAvailable}
                onToggle={toggleAvailability}
                loading={availabilityLoading}
                disabled={!profile?.id}
              />
            </div>
          </div>
        );
    }
  };

  const handleAdminUpgrade = async (password) => {
    setAdminUpgradeLoading(true);
    setAdminUpgradeMessage('');
    setAdminUpgradeSuccess(false);
    setError(null);

    try {
      const response = await requestAdminUpgrade(password);
      setAdminUpgradeMessage(response.message);
      setAdminUpgradeSuccess(response.success);

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
      setAdminUpgradeMessage(err.message || 'Failed to process admin upgrade request');
      setAdminUpgradeSuccess(false);
    } finally {
      setAdminUpgradeLoading(false);
    }
  };

  const openAdminPasswordModal = () => {
    setAdminPasswordInput('');
    setAdminPasswordError('');
    setIsAdminPasswordModalOpen(true);
  };

  const closeAdminPasswordModal = () => {
    setIsAdminPasswordModalOpen(false);
    setAdminPasswordInput('');
    setAdminPasswordError('');
  };

  const submitAdminPassword = async () => {
    const password = adminPasswordInput;
    if (!password) {
      setAdminPasswordError('Password is required.');
      return;
    }

    if (password !== 'iamanadmin') {
      setAdminPasswordError('Incorrect admin password.');
      return;
    }

    closeAdminPasswordModal();
    await handleAdminUpgrade(password);
  };

  // Create Post Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const postData = {
        title: form.title,
        description: form.description,
        post_type: form.post_type,
      };
      if (form.post_type !== 'work_update') {
        postData.stage = form.stage;
        postData.required_skills = form.required_skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      const newPost = await createFeedPost(postData);

      // Optimistic update
      setActivityPosts((prev) => [newPost, ...prev]);

      setShowForm(false);
      setForm(initialFormState);

      // Switch tab to the relevant one
      if (form.post_type === 'work_update') {
        setActivityTab('updates');
      } else {
        setActivityTab('projects');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create post');
    }
    setFormLoading(false);
  };

  const getFormTitle = () => {
    const types = { startup_idea: 'Share Idea', project: 'Share Project', work_update: 'Post Update' };
    return types[form.post_type] || 'Create Post';
  };

  if (loading) {
    return <ProfileSkeleton />;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-md space-y-6 px-3 py-4"
    >
      <header className="space-y-4">
        <AnimatedCard
          delay={0}
          className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-surface to-accent/10 p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-4">
              <div className="relative">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-border/60 bg-surface shadow-md">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-2xl font-bold text-white">
                      {getDisplayName(profile)[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1">
                  <OnlineStatusDot isOnline={isOnline} size="small" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="level" className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-body">
                    Level {profile.level_badge || profile.level || formatLevel(profile.level) || 'Explorer'}
                  </Badge>
                  <Badge variant="primary" className="rounded-full px-3 py-1 text-xs font-semibold">
                    {profile.role?.toUpperCase()}
                  </Badge>
                  {typeof profile.xp_points === 'number' && (
                    <Badge variant="neutral" className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-body">
                      {profile.xp_points} XP
                    </Badge>
                  )}
                </div>

                {!isEditingName ? (
                  <div className="mt-2 flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-body tracking-tight">{getDisplayName(profile)}</h1>
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
                        {nameLoading ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <Loader size="sm" inline />
                            Please wait…
                          </span>
                        ) : (
                          'Save'
                        )}
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

                <p className="mt-1 text-sm text-muted leading-relaxed">
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
              {role === 'student' && (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="rounded-full px-5 py-2.5 shadow-sm transition duration-200 hover:shadow hover:scale-[1.03] active:scale-[0.97]"
                    onClick={openAdminPasswordModal}
                    disabled={adminUpgradeLoading}
                  >
                    {adminUpgradeLoading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader size="sm" inline />
                        Please wait…
                      </span>
                    ) : (
                      'Become an Admin'
                    )}
                  </Button>
                  {adminUpgradeMessage && (
                    <p className={`text-xs text-center ${adminUpgradeSuccess ? 'text-green-600' : 'text-red-600'}`}>
                      {adminUpgradeMessage}
                    </p>
                  )}
                </div>
              )}

              <Button variant="ghost" size="icon" onClick={signOut}>
                Log out
              </Button>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard
          delay={0.1}
          className="grid grid-cols-3 gap-2 rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg"
        >
          <div className="space-y-1 text-center">
            <Badge variant="trust" className="mx-auto w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-body">
              {formatTrustScore(profile.trust_score)} Trust
            </Badge>
            <p className="text-xs text-muted">Based on activity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-body tracking-tight">{profile.projects_joined ?? teamsJoined.length ?? 0}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Teams</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-body tracking-tight">{profile.events_attended ?? eventsParticipated.length ?? 0}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Events Joined</p>
          </div>
        </AnimatedCard>
      </header>

      {profile.college && profile.course && profile.branch && profile.year && (
        <AnimatedCard delay={0.2}>
          <Card className="space-y-3 border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg">
            <h3 className="text-sm font-semibold text-body">Academic Information</h3>
            <div className="space-y-2 text-sm text-muted">
              <p>
                <span className="font-semibold text-body">College:</span> {profile.college}
              </p>
              <p>
                <span className="font-semibold text-body">Course:</span> {profile.course}
              </p>
              <p>
                <span className="font-semibold text-body">Branch:</span> {profile.branch}
              </p>
              <p>
                <span className="font-semibold text-body">Year:</span> {profile.year}
              </p>
            </div>
          </Card>
        </AnimatedCard>
      )}

      <AnimatedCard delay={0.3}>
        <Card className="space-y-5 border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            {tabsToRender.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-[0.97] ${tab.key === activeTab
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-muted hover:bg-surface/80 hover:text-body'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </AnimatedCard>

      {/* Activity Section */}
      <AnimatedCard delay={0.4}>
        <Card className="space-y-5 border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivityTab('projects')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-[0.97] ${activityTab === 'projects'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-muted hover:bg-surface/80 hover:text-body'
                  }`}
              >
                Projects Posted
              </button>
              <button
                type="button"
                onClick={() => setActivityTab('updates')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-[0.97] ${activityTab === 'updates'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-muted hover:bg-surface/80 hover:text-body'
                  }`}
              >
                Updates Posted
              </button>
            </div>
            {role === 'student' && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 transition active:scale-95"
              >
                <PlusIcon className="w-4 h-4" />
                Add
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm min-h-[200px]">
            {activityLoading ? (
              <div className="flex justify-center py-10">
                <Loader label="Loading activity..." />
              </div>
            ) : activityError ? (
              <p className="text-center text-sm text-danger">{activityError}</p>
            ) : (
              <div className="space-y-4">
                {activityTab === 'projects' ? (
                  projectsPosted.length > 0 ? (
                    projectsPosted.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onPostDeleted={(deletedId) => {
                          setActivityPosts((prev) => prev.filter((p) => p.id !== deletedId && p.post_id !== deletedId));
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted py-8">No projects posted yet.</p>
                  )
                ) : (
                  updatesPosted.length > 0 ? (
                    updatesPosted.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onPostDeleted={(deletedId) => {
                          setActivityPosts((prev) => prev.filter((p) => p.id !== deletedId && p.post_id !== deletedId));
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted py-8">No updates posted yet.</p>
                  )
                )}
              </div>
            )}
          </div>
        </Card>
      </AnimatedCard>

      {
        isAdminPasswordModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-sm"
            >
              <Card className="space-y-4 border border-border/60 bg-card p-6 shadow-lg">
                <div>
                  <h2 className="text-lg font-semibold text-body tracking-tight">Admin verification</h2>
                  <p className="mt-1 text-sm text-muted">To become an admin you must enter the admin only password.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted">Password</label>
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(event) => {
                      setAdminPasswordInput(event.target.value);
                      setAdminPasswordError('');
                    }}
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter password"
                    autoFocus
                  />
                  {adminPasswordError ? <p className="text-xs text-danger">{adminPasswordError}</p> : null}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-full transition duration-200 hover:bg-surface hover:scale-[1.03] active:scale-[0.97]"
                    onClick={closeAdminPasswordModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1 rounded-full shadow-sm transition duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    onClick={submitAdminPassword}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : null
      }

      {/* Create Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-[480px] bg-white rounded-t-3xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <h2 className="text-lg font-bold text-body">{getFormTitle()}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-surface">
                <CloseIcon className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Post Type */}
              <div className="flex gap-2">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, post_type: type.value }))}
                    className={`flex-1 py-2 text-xs font-semibold rounded-full transition ${form.post_type === type.value
                      ? 'bg-primary text-white'
                      : 'bg-surface text-muted hover:bg-surface/80 hover:text-body'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Title */}
              <input
                name="title"
                required
                value={form.title}
                onChange={handleFormChange}
                placeholder={form.post_type === 'work_update' ? "What's the update?" : "Project Title"}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Description */}
              <textarea
                name="description"
                rows={3}
                required
                value={form.description}
                onChange={handleFormChange}
                placeholder="Tell us more..."
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Stage & Skills */}
              {form.post_type !== 'work_update' && (
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleFormChange}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="MVP">MVP</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                  <input
                    name="required_skills"
                    value={form.required_skills}
                    onChange={handleFormChange}
                    placeholder="Skills (comma sep)"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {formError && <p className="text-sm text-danger">{formError}</p>}

              <Button type="submit" variant="primary" className="w-full" disabled={formLoading}>
                {formLoading ? <Loader size="sm" inline /> : 'Publish'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </motion.div >
  );
};

export default StudentProfile;
