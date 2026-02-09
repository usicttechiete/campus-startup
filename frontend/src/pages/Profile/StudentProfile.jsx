import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { getMyNotifications, markNotificationRead } from '../../services/notification.api.js';
import PostCard from '../../components/PostCard/PostCard.jsx';

const tabConfig = [
  { key: 'startup', label: 'My Startup' },
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

const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Column Skeleton */}
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="sticky top-24 space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl h-[500px] relative">
            <div className="h-32 bg-gray-200/20 animate-pulse" />
            <div className="absolute top-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-gray-200/50 animate-pulse border-4 border-white/50" />
            <div className="mt-20 px-6 space-y-4">
              <div className="h-8 w-3/4 mx-auto rounded-full bg-gray-200/30 animate-pulse" />
              <div className="h-4 w-1/2 mx-auto rounded-full bg-gray-200/30 animate-pulse" />
              <div className="pt-8 space-y-3">
                <div className="h-12 w-full rounded-2xl bg-gray-200/20 animate-pulse" />
                <div className="h-12 w-full rounded-2xl bg-gray-200/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column Skeleton */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-8">
        {/* Tabs Skeleton */}
        <div className="rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md shadow-xl p-8">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-200/20 animate-pulse" />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full rounded bg-gray-200/20 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-gray-200/20 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-gray-200/20 animate-pulse" />
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className="rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md shadow-xl p-8 h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 rounded-full bg-gray-200/20 animate-pulse" />
            <div className="h-10 w-32 rounded-full bg-gray-200/20 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-48 rounded-3xl bg-gray-200/10 animate-pulse" />
            <div className="h-48 rounded-3xl bg-gray-200/10 animate-pulse" />
          </div>
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
  const [activeTab, setActiveTab] = useState('startup');

  // Ref for scrolling to activity section when notification is clicked
  const activitySectionRef = useRef(null);

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

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
    // Only showing startup tab for now as per new design
    return tabConfig;
  }, [role]);

  // Notifications section state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');

  useEffect(() => {
    if (activeTab === 'applied') {
      loadApplications();
    }
  }, [activeTab]);

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError('');
    try {
      const res = await getMyNotifications();
      setNotifications(Array.isArray(res?.results) ? res.results : []);
    } catch (err) {
      setNotificationsError(err?.message || 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'notifications') {
      loadNotifications();
    }
  }, [activeTab, loadNotifications]);

  useEffect(() => {
    if (role !== 'student' && activeTab === 'startup') {
      // Handle non-student role if necessary
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
  }, [profile]);

  const { projectsPosted, updatesPosted, appliedJobs } = useMemo(() => {
    const projects = [];
    const updates = [];
    activityPosts.forEach((post) => {
      if (post.post_type === 'project' || post.post_type === 'startup_idea') {
        projects.push(post);
      } else if (post.post_type === 'work_update') {
        updates.push(post);
      }
    });
    return { projectsPosted: projects, updatesPosted: updates, appliedJobs: myApplications };
  }, [activityPosts, myApplications]);

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

    if (activeTab === 'startup') {
      // Startup Logic (Register or View)
      // Note: Logic copied and simplified from previous 'startup' case
      const reapplyDate = startupReapplyAfter ? new Date(startupReapplyAfter) : null;
      const isReapplyLocked =
        startupStatus === 'REJECTED' && reapplyDate && !Number.isNaN(reapplyDate.getTime()) && new Date() <= reapplyDate;

      if (startupLoading) {
        return (
          <div className="flex h-64 items-center justify-center">
            <Loader label="Loading startup details..." />
          </div>
        );
      }

      if (startupError) {
        return (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6 text-center text-danger">
            <p className="font-medium">{startupError}</p>
          </div>
        );
      }

      if (startupStatus === 'PENDING') {
        return (
          <div className="rounded-[2rem] border border-blue-500/20 bg-blue-500/5 p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-blue-600">Application Under Review</h3>
              <p className="text-body/80">{startupStatusMessage || 'Your startup application is currently being reviewed by the administration.'}</p>
            </div>
          </div>
        );
      }

      if (startupStatus === 'REJECTED' && isReapplyLocked) {
        return (
          <div className="rounded-[2rem] border border-danger/20 bg-danger/5 p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-danger">Application Declined</h3>
              <p className="text-body/80">{startupStatusMessage || 'Your application was not approved at this time.'}</p>
              <p className="text-sm text-muted pt-2">You can reapply after {reapplyDate.toLocaleString()}.</p>
            </div>
          </div>
        );
      }

      if (startupStatus === 'APPROVED' && myStartup) {
        return (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row justify-between gap-4 sm:items-start">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-body tracking-tight">{myStartup.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral" className="bg-white/50 backdrop-blur border border-white/20">
                      {myStartup.domain || 'Tech'}
                    </Badge>
                    <Badge variant="primary" className="bg-primary/10 text-primary border border-primary/20">
                      {myStartup.stage || 'Early Stage'}
                    </Badge>
                    {myStartup.revenue && (
                      <Badge variant="success" className="bg-success/10 text-success border border-success/20">
                        Generating Revenue
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/startup/${myStartup.id}`)} className="rounded-xl border border-white/10 hover:bg-white/20">
                    View Page
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl text-danger hover:bg-danger/10 border border-danger/10" onClick={handleDeactivateStartup} disabled={startupSubmitLoading}>
                    {startupSubmitLoading ? <Loader size="sm" inline /> : 'Deactivate'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">Problem Solved</p>
                  <p className="text-sm text-body leading-relaxed">{myStartup.problem}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-body">
                      {myStartup.total_members || 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">Team Size</p>
                      <p className="text-sm font-semibold text-body opacity-0">Hidden</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      👤
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">Lead</p>
                      <p className="text-sm font-bold text-body truncate">{myStartup.head_name}</p>
                      <p className="text-xs text-muted truncate">{myStartup.head_email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      const disableForm = startupSubmitLoading || startupStatus === 'PENDING' || startupStatus === 'APPROVED' || isReapplyLocked;

      return (
        <div className="space-y-6">
          {startupStatus === 'REJECTED' && (
            <div className="rounded-2xl bg-danger/5 border border-danger/10 p-4 flex gap-4 items-start">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-bold text-danger">Previous Application Rejected</p>
                <p className="text-sm text-body/80 mt-1">{startupStatusMessage}</p>
                {reapplyDate && <p className="text-xs text-muted mt-2">Reapply available after {reapplyDate.toLocaleDateString()}</p>}
              </div>
            </div>
          )}

          <form onSubmit={handleCreateStartup} className="space-y-6">
            <div className="rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-sm p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  🚀
                </div>
                <div>
                  <h3 className="text-lg font-bold text-body">Register Your Startup</h3>
                  <p className="text-sm text-muted">Take the first step towards building your empire.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Venture Name</label>
                  <input
                    value={startupName}
                    onChange={(e) => { setStartupName(e.target.value); setStartupSubmitError(''); }}
                    required
                    disabled={disableForm}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all font-medium"
                    placeholder="Next Big Thing"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Domain / Industry</label>
                  <input
                    value={startupDomain}
                    onChange={(e) => { setStartupDomain(e.target.value); setStartupSubmitError(''); }}
                    disabled={disableForm}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                    placeholder="e.g. EdTech, AI, Logistics"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Problem Statement</label>
                <textarea
                  value={startupProblem}
                  onChange={(e) => { setStartupProblem(e.target.value); setStartupSubmitError(''); }}
                  rows={4}
                  disabled={disableForm}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all resize-none"
                  placeholder="What burning problem are you solving? Be specific."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Current Stage</label>
                  <div className="relative">
                    <select
                      value={startupStage}
                      onChange={(e) => { setStartupStage(e.target.value); setStartupSubmitError(''); }}
                      disabled={disableForm}
                      className="w-full appearance-none rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="IDEA">Idea Phase</option>
                      <option value="MVP">MVP Ready</option>
                      <option value="SCALING">Scaling Up</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={startupTotalMembers}
                    onChange={(e) => { setStartupTotalMembers(e.target.value); setStartupSubmitError(''); }}
                    disabled={disableForm}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                    placeholder="Ex: 3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Revenue?</label>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setStartupRevenue(true)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${startupRevenue ? 'bg-white shadow-sm text-success' : 'text-muted hover:text-body'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setStartupRevenue(false)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!startupRevenue ? 'bg-white shadow-sm text-body' : 'text-muted hover:text-body'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Head Name</label>
                  <input
                    value={startupHeadName}
                    onChange={(e) => { setStartupHeadName(e.target.value); setStartupSubmitError(''); }}
                    disabled={disableForm}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Head Email</label>
                  <input
                    type="email"
                    value={startupHeadEmail}
                    onChange={(e) => { setStartupHeadEmail(e.target.value); setStartupSubmitError(''); }}
                    disabled={disableForm}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                  />
                </div>
              </div>

              {startupSubmitError && (
                <div className="p-4 bg-danger/5 border border-danger/10 rounded-xl">
                  <p className="text-xs font-bold text-danger flex items-center gap-2">
                    <span>⚠️</span> {startupSubmitError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-6 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all"
                disabled={disableForm}
              >
                {startupSubmitLoading ? <Loader size="sm" inline /> : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      );
    }
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
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Sidebar - Left Column (Fixed Width & Sticky) */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden backdrop-blur-xl shadow-2xl rounded-[1.5rem] sm:rounded-[2rem]">
                  {/* Profile Header Background */}
                  <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary/40 via-primary/20 to-accent/40">
                    <button
                      onClick={toggleTheme}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-lg border border-white/20"
                      aria-label="Toggle Dark Mode"
                    >
                      {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative px-4 pb-6 sm:px-6 sm:pb-8">
                    {/* Avatar */}
                    <div className="-mt-12 sm:-mt-16 mb-3 sm:mb-4 flex justify-center">
                      <div className="relative group">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white/50 bg-white dark:bg-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-accent text-3xl sm:text-4xl font-bold text-white uppercase">
                              {getDisplayName(profile)[0]}
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 ring-3 sm:ring-4 ring-white/50 rounded-full">
                          <OnlineStatusDot isOnline={isOnline} size="large" />
                        </div>
                      </div>
                    </div>

                    {/* User Info & Badges */}
                    <div className="text-center space-y-4 px-4 sm:px-6">
                      <div className="space-y-1">
                        {!isEditingName ? (
                          <div className="flex items-center justify-center gap-2 group">
                            <h1 className="text-2xl sm:text-3xl font-bold text-body tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent break-words max-w-full">
                              {getDisplayName(profile)}
                            </h1>
                            <button
                              type="button"
                              onClick={() => setIsEditingName(true)}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                              aria-label="Edit name"
                            >
                              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2 space-y-3 px-2 sm:px-4">
                            <input
                              value={nameInput}
                              onChange={(event) => {
                                const value = event.target.value;
                                if (!/^[A-Za-z ]*$/.test(value)) return;
                                setNameInput(value);
                                setNameError('');
                              }}
                              className="w-full rounded-2xl border border-primary/30 bg-white/50 px-4 py-2 text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
                              autoFocus
                            />
                            {nameError && <p className="text-xs text-danger font-medium">{nameError}</p>}
                            <div className="flex gap-2 justify-center">
                              <Button size="xs" variant="primary" onClick={handleSaveName} disabled={nameLoading} className="rounded-full px-6">
                                {nameLoading ? <Loader size="sm" inline /> : 'Save'}
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                className="rounded-full px-6 border border-border/60"
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
                          </div>
                        )}
                        <p className="text-sm font-medium text-primary/80">{profile.tagline || profile.headline || "Ready to change the world"}</p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1 font-semibold text-xs tracking-wide shadow-sm">
                          LEVEL {profile.level_badge || profile.level || formatLevel(profile.level) || 'EXPLORER'}
                        </Badge>
                        <Badge className="bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1 font-semibold text-xs tracking-wide shadow-sm">
                          {profile.role?.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="absolute top-4 left-4">
                        <button
                          onClick={() => navigate('/notifications')}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-lg border border-white/20"
                          aria-label="Notifications"
                        >
                          <BellIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Bio Section Integrated */}
                    <div className="relative group text-left">
                      {isEditingBio ? (
                        <div className="space-y-2">
                          <textarea
                            value={bioInput}
                            onChange={(e) => { setBioInput(e.target.value); setBioError(''); }}
                            rows={4}
                            className="w-full rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"
                            placeholder="Tell your story..."
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="xs" variant="ghost" onClick={handleCancelBioEdit}>Cancel</Button>
                            <Button size="xs" variant="primary" onClick={handleSaveBio} disabled={bioLoading}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => setIsEditingBio(true)} className="cursor-pointer hover:bg-black/5 p-2 rounded-xl transition-all">
                          <p className="text-sm text-body/90 leading-relaxed text-center">
                            {profile.bio || profile.about || "Add a bio to introduce yourself..."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Skills Section Integrated */}
                    <div className="space-y-2 pt-2 border-t border-dashed border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted">Skills</span>
                        <button onClick={() => setIsEditingSkills(!isEditingSkills)} className="text-xs text-primary font-bold hover:underline">
                          {isEditingSkills ? 'Done' : 'Edit'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {(isEditingSkills ? skillsDraft : (profile.skills || [])).map((skill) => (
                          <span key={skill} className="px-2 py-1 rounded-lg bg-white/50 border border-white/20 text-xs font-medium text-body shadow-sm flex items-center gap-1">
                            {skill}
                            {isEditingSkills && (
                              <button onClick={() => handleRemoveSkill(skill)} className="text-danger hover:scale-110 transition-transform">×</button>
                            )}
                          </span>
                        ))}
                        {isEditingSkills && (
                          <div className="flex items-center gap-1">
                            <input
                              value={skillInputValue}
                              onChange={(e) => setSkillInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                              className="w-20 px-2 py-1 rounded-lg bg-white/50 border border-white/20 text-xs outline-none focus:border-primary"
                              placeholder="Add..."
                            />
                          </div>
                        )}
                        {isEditingSkills && skillsDraft.length !== (profile.skills || []).length && (
                          <Button size="xs" variant="primary" onClick={handleSaveSkills} disabled={skillsLoading} className="scale-75 origin-left">
                            Save
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Academic Info Integrated */}
                    {profile.college && (
                      <div className="pt-2 border-t border-dashed border-white/20 space-y-2 text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted text-center">Academic</p>
                        <div className="text-sm text-body text-center space-y-0.5">
                          <p className="font-bold">{profile.college}</p>
                          <p className="text-muted text-xs">{profile.course} • {profile.year}</p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Availability & Actions */}
                  <div className="mt-6 space-y-4 px-4 sm:px-6 pb-6">
                    <div className="p-3 rounded-2xl bg-white/40 border border-white/50 shadow-inner backdrop-blur-sm flex items-center justify-between">
                      <span className="text-xs font-bold text-body">Available to Work</span>
                      <AvailabilityToggle
                        isAvailable={isAvailable}
                        onToggle={toggleAvailability}
                        loading={availabilityLoading}
                        disabled={!profile?.id}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full rounded-xl py-3 border border-danger/10 text-danger hover:bg-danger/5 transition-all text-xs font-bold uppercase tracking-wide"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </Card>
              </motion.div>

            </div>
          </aside>

          {/* Main Content - Right Column */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-8 min-w-0">
            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="backdrop-blur-md shadow-xl rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-6 lg:p-8">
                <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                  <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full bg-body/5 w-fit min-w-max">
                    {tabsToRender.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${tab.key === activeTab
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                          : 'text-muted hover:text-body hover:bg-body/5'
                          }`}
                      >
                        {tab.label}
                        {tab.key === activeTab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-primary -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>


                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderTabContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>

            {/* Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card ref={activitySectionRef} className="backdrop-blur-md shadow-xl rounded-[2rem] p-4 sm:p-6 lg:p-10 space-y-6 w-full overflow-hidden">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-body tracking-tight">Your Activity</h2>
                    <p className="text-sm text-muted">Showcase your progress and contributions</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-body/5">
                      <button
                        type="button"
                        onClick={() => setActivityTab('projects')}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activityTab === 'projects'
                          ? 'bg-white text-primary shadow-md scale-105'
                          : 'text-muted hover:text-body'
                          }`}
                      >
                        Projects
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivityTab('updates')}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activityTab === 'updates'
                          ? 'bg-white text-primary shadow-md scale-105'
                          : 'text-muted hover:text-body'
                          }`}
                      >
                        Updates
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivityTab('applied')}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activityTab === 'applied'
                          ? 'bg-white text-primary shadow-md scale-105'
                          : 'text-muted hover:text-body'
                          }`}
                      >
                        Applied
                      </button>
                    </div>

                    {role === 'student' && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition active:scale-95 whitespace-nowrap"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        Create
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative w-full overflow-hidden">
                  {activityLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader />
                      <p className="text-sm font-medium text-muted animate-pulse">Synchronizing your workspace...</p>
                    </div>
                  ) : activityError ? (
                    <div className="p-8 rounded-3xl bg-danger/5 border border-danger/10 text-center">
                      <p className="text-sm font-semibold text-danger">{activityError}</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 w-full overflow-hidden">
                      {activityTab === 'projects' && (
                        projectsPosted.length > 0 ? (
                          <div className="grid gap-6 sm:grid-cols-2 w-full overflow-hidden">
                            {projectsPosted.map((post) => (
                              <div key={post.id} className="transition-transform duration-300 hover:-translate-y-1 min-w-0 w-full overflow-hidden">
                                <PostCard
                                  post={post}
                                  onPostDeleted={(deletedId) => {
                                    setActivityPosts((prev) => prev.filter((p) => p.id !== deletedId && p.post_id !== deletedId));
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/20">
                            <span className="text-4xl mb-4">🚀</span>
                            <p className="text-sm font-bold text-muted tracking-tight">Zero projects found. Time to build something!</p>
                          </div>
                        )
                      )}

                      {activityTab === 'updates' && (
                        updatesPosted.length > 0 ? (
                          <div className="space-y-6 w-full overflow-hidden">
                            {updatesPosted.map((post) => (
                              <PostCard
                                key={post.id}
                                post={post}
                                onPostDeleted={(deletedId) => {
                                  setActivityPosts((prev) => prev.filter((p) => p.id !== deletedId && p.post_id !== deletedId));
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/20">
                            <span className="text-4xl mb-4">📝</span>
                            <p className="text-sm font-bold text-muted tracking-tight">No updates yet. Keep the community posted!</p>
                          </div>
                        )
                      )}

                      {activityTab === 'applied' && (
                        <div className="space-y-4 w-full overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-body px-2 tracking-tight">Active Applications</h3>
                            <div
                              className="cursor-pointer text-xs font-bold text-primary flex items-center gap-1"
                              onClick={() => setIsEditingResume(!isEditingResume)}
                            >
                              {profile?.resume_link ? 'Update Resume' : 'Add Resume'}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isEditingResume && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-md p-6 shadow-inner space-y-4 mb-4">
                                  <div className="flex gap-2">
                                    <input
                                      value={resumeInput}
                                      onChange={(e) => { setResumeInput(e.target.value); setResumeError(''); }}
                                      placeholder="https://..."
                                      className="flex-1 rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                    <Button variant="primary" onClick={handleSaveResume} disabled={resumeLoading} className="rounded-xl px-6">
                                      {resumeLoading ? <Loader size="sm" inline /> : 'Save'}
                                    </Button>
                                  </div>
                                  {resumeError && <p className="text-xs font-bold text-danger px-1">{resumeError}</p>}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {applicationsLoading ? (
                            <div className="py-12"><Loader center /></div>
                          ) : appliedJobs.length ? (
                            <div className="grid gap-4 w-full overflow-hidden">
                              {appliedJobs.map((app) => (
                                <div
                                  key={app.id}
                                  className="group rounded-[2rem] border border-white/20 bg-white/5 p-6 shadow-sm hover:shadow-md hover:bg-white/10 transition-all"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div>
                                      <p className="text-lg font-bold text-body">{app.job?.role_title || 'Role'}</p>
                                      <p className="text-sm font-medium text-muted">{app.job?.company_name}</p>
                                    </div>
                                    <Badge
                                      variant={app.status === 'Accepted' ? 'success' : app.status === 'Rejected' ? 'danger' : 'neutral'}
                                      className="uppercase tracking-wider font-bold rounded-lg px-3 py-1 text-[10px]"
                                    >
                                      {app.status}
                                    </Badge>
                                  </div>

                                  {(app.status === 'Accepted' || app.status === 'Rejected') && (
                                    <div className={`mt-4 rounded-xl p-4 ${app.status === 'Accepted' ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'}`}>
                                      <p className="text-sm font-semibold">
                                        {app.status === 'Accepted' ? '🎉 Offer Received!' : 'Application Update'}
                                      </p>
                                      {app.rejection_reason && <p className="text-xs opacity-90 mt-1">{app.rejection_reason}</p>}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-16 rounded-[2.5rem] border border-dashed border-white/20 bg-surface/30">
                              <p className="text-muted font-medium">No active applications found.</p>
                              <Button variant="ghost" onClick={() => navigate('/hire')} className="mt-2 text-primary hover:text-primary-dark">Find Opportunities</Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md px-4" onClick={() => setShowForm(false)}>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-xl bg-bg-elevated rounded-[3rem] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-border/10 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-body tracking-tight">{getFormTitle()}</h2>
                  <p className="text-sm text-muted px-0.5">Share your brilliance with the community</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-3 rounded-full hover:bg-surface transition-colors" aria-label="Close modal">
                  <CloseIcon className="w-5 h-5 text-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreatePost} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Post Type Selector */}
                <div className="grid grid-cols-3 gap-3 p-1.5 rounded-[1.5rem] bg-body/5">
                  {postTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, post_type: type.value }))}
                      className={`py-3 text-xs font-bold rounded-2xl transition-all ${form.post_type === type.value
                        ? 'bg-white text-primary shadow-sm scale-[1.02]'
                        : 'text-muted hover:text-body'
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Headline</label>
                    <input
                      name="title"
                      required
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder={form.post_type === 'work_update' ? "What did you achieve today?" : "Ex: Decentralized Campus Marketplace"}
                      className="w-full rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Detailed Insight</label>
                    <textarea
                      name="description"
                      rows={4}
                      required
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Deep dive into your project or update..."
                      className="w-full rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm resize-none outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  {form.post_type !== 'work_update' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Development Phase</label>
                        <select
                          name="stage"
                          value={form.stage}
                          onChange={handleFormChange}
                          className="w-full rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                          <option value="Ideation">Ideation</option>
                          <option value="MVP">MVP</option>
                          <option value="Scaling">Scaling</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted px-1">Tech Stack</label>
                        <input
                          name="required_skills"
                          value={form.required_skills}
                          onChange={handleFormChange}
                          placeholder="React, AWS, Node..."
                          className="w-full rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {formError && <p className="text-sm font-semibold text-danger bg-danger/5 p-4 rounded-2xl border border-danger/10">{formError}</p>}

                <Button type="submit" variant="primary" className="w-full rounded-2xl py-6 shadow-xl shadow-primary/20 text-sm font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all" disabled={formLoading}>
                  {formLoading ? <Loader size="sm" inline /> : 'Broadcast to Campus'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProfile;
