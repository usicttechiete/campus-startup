import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import EventTimeline from '../../components/Events/EventTimeline.jsx';
import TeamCard from '../../components/Events/TeamCard.jsx';
import CreateTeamModal from '../../components/Events/CreateTeamModal.jsx';
import {
  fetchEventDetail,
  fetchEventTimeline,
  fetchEventTeams,
  fetchEventResources,
  fetchEventFaqs,
  requestToJoinTeam,
  createEventTeam,
  applySoloToEvent,
} from '../../services/event.api.js';
import { useRole } from '../../context/RoleContext.jsx';
import { formatRelativeTime } from '../../utils/formatters.js';

const tabConfig = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'teams', label: 'Teams' },
  { key: 'resources', label: 'Resources' },
  { key: 'faq', label: 'FAQ' },
];

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();

  const [activeTab, setActiveTab] = useState('overview');

  const [eventInfo, setEventInfo] = useState(null);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [loadingState, setLoadingState] = useState({
    detail: false,
    timeline: false,
    teams: false,
    resources: false,
    faq: false,
  });

  const [errorState, setErrorState] = useState({});

  const [joinLoadingId, setJoinLoadingId] = useState(null);
  const [teamCreationLoading, setTeamCreationLoading] = useState(false);
  const [soloApplyLoading, setSoloApplyLoading] = useState(false);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const isStudent = role === 'student';
  const isOrganizer = role === 'organizer' || role === 'club';

  const loadDetail = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, detail: true }));
    setErrorState((prev) => ({ ...prev, detail: null }));
    try {
      const data = await fetchEventDetail(eventId);
      setEventInfo(data);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, detail: error.message || 'Failed to load event' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, detail: false }));
    }
  }, [eventId]);

  const loadTimeline = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, timeline: true }));
    setErrorState((prev) => ({ ...prev, timeline: null }));
    try {
      const data = await fetchEventTimeline(eventId);
      setTimelineSteps(Array.isArray(data?.steps) ? data.steps : Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, timeline: error.message || 'Failed to load timeline' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, timeline: false }));
    }
  }, [eventId]);

  const loadTeams = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, teams: true }));
    setErrorState((prev) => ({ ...prev, teams: null }));
    try {
      const data = await fetchEventTeams(eventId);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setTeams(results);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Failed to load teams' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, teams: false }));
    }
  }, [eventId]);

  const loadResources = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, resources: true }));
    setErrorState((prev) => ({ ...prev, resources: null }));
    try {
      const data = await fetchEventResources(eventId);
      setResources(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, resources: error.message || 'Failed to load resources' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, resources: false }));
    }
  }, [eventId]);

  const loadFaqs = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, faq: true }));
    setErrorState((prev) => ({ ...prev, faq: null }));
    try {
      const data = await fetchEventFaqs(eventId);
      setFaqs(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, faq: error.message || 'Failed to load FAQs' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, faq: false }));
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    loadDetail();
    loadTimeline();
    loadTeams();
    loadResources();
    loadFaqs();
  }, [eventId, loadDetail, loadTimeline, loadTeams, loadResources, loadFaqs]);

  const handleJoinTeam = async (teamId) => {
    setJoinLoadingId(teamId);
    setSuccessMessage(null);
    try {
      await requestToJoinTeam(eventId, teamId);
      setSuccessMessage('Request sent successfully. Team lead will review your application.');
      await loadTeams();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Unable to request join.' }));
    } finally {
      setJoinLoadingId(null);
    }
  };

  const handleCreateTeam = async ({ name, requiredSkills, maxSize }) => {
    setTeamCreationLoading(true);
    setSuccessMessage(null);
    try {
      await createEventTeam(eventId, {
        name,
        required_skills: requiredSkills,
        max_size: maxSize,
      });
      setCreateTeamModalOpen(false);
      setSuccessMessage('Team created successfully. You are now the team lead.');
      await loadTeams();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Unable to create team.' }));
    } finally {
      setTeamCreationLoading(false);
    }
  };

  const handleApplySolo = async () => {
    setSoloApplyLoading(true);
    setSuccessMessage(null);
    try {
      await applySoloToEvent(eventId, {});
      setSuccessMessage('You have applied as a solo participant. Organizer will try matching you.');
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Unable to apply solo.' }));
    } finally {
      setSoloApplyLoading(false);
    }
  };

  const timelineContent = useMemo(() => {
    if (loadingState.timeline) {
      return (
        <div className="flex justify-center py-8">
          <Loader label="Loading timeline" />
        </div>
      );
    }

    if (errorState.timeline) {
      return (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{errorState.timeline}</p>
        </Card>
      );
    }

    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#5A47FF] via-[#6A64FF] to-[#78A6FF] p-6 shadow-md">
        <EventTimeline steps={timelineSteps} />
      </div>
    );
  }, [loadingState.timeline, errorState.timeline, timelineSteps]);

  const teamsContent = useMemo(() => {
    if (!isStudent) {
      return (
        <Card className="space-y-3 border border-border bg-card">
          <h3 className="text-lg font-semibold text-body">Team actions unavailable</h3>
          <p className="text-sm text-muted">
            Only student participants can create or join teams. Organizers and admins manage teams from the event dashboard.
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate(`/events/${eventId}/manage`)}>
            Manage teams instead
          </Button>
        </Card>
      );
    }

    if (loadingState.teams) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-card/60 p-5">
              <div className="h-5 w-1/3 rounded-full bg-surface" />
              <div className="mt-3 h-4 w-1/2 rounded-full bg-surface/70" />
              <div className="mt-4 h-16 rounded-2xl bg-surface/50" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {successMessage && (
          <Card className="border border-success/30 bg-success/10 text-success">
            <p>{successMessage}</p>
          </Card>
        )}

        <div className="grid gap-3 rounded-3xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-body">Join an existing team</h3>
          {errorState.teams && <p className="text-sm text-danger">{errorState.teams}</p>}
          <div className="space-y-3">
            {teams.length ? (
              teams.map((team) => (
                <TeamCard
                  key={team.id || team.team_id}
                  team={team}
                  onRequestJoin={handleJoinTeam}
                  actionLoading={joinLoadingId === (team.id || team.team_id)}
                />
              ))
            ) : (
              <p className="text-sm text-muted">No teams are looking for members yet. Create one to lead the charge!</p>
            )}
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-body">Create a new team</h3>
          <p className="text-sm text-muted">Set your rules, define the skills you need, and invite members.</p>
          <Button variant="primary" onClick={() => setCreateTeamModalOpen(true)} className="w-fit rounded-full px-5">
            Start a team
          </Button>
        </div>

        <div className="grid gap-3 rounded-3xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-body">Apply solo</h3>
          <p className="text-sm text-muted">
            Prefer going solo? Let organizers know you are ready to be matched with a team or compete individually.
          </p>
          <Button variant="subtle" onClick={handleApplySolo} disabled={soloApplyLoading} className="w-fit rounded-full px-5">
            {soloApplyLoading ? <Loader size="sm" inline label="Submitting" /> : 'Apply as solo participant'}
          </Button>
        </div>
      </div>
    );
  }, [isStudent, loadingState.teams, successMessage, teams, errorState.teams, joinLoadingId, soloApplyLoading, navigate, eventId]);

  const resourcesContent = useMemo(() => {
    if (loadingState.resources) {
      return (
        <div className="flex justify-center py-10">
          <Loader label="Loading resources" />
        </div>
      );
    }

    if (errorState.resources) {
      return (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{errorState.resources}</p>
        </Card>
      );
    }

    if (!resources.length) {
      return (
        <Card className="text-sm text-muted">
          Organizers will share resources soon. Stay tuned for decks, repo links, or starter kits.
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {resources.map((resource) => (
          <Card key={resource.id || resource.url} className="flex items-start justify-between gap-4 border border-border bg-card p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-body">{resource.title || resource.name || 'Resource'}</h3>
              {resource.description && <p className="text-sm text-muted">{resource.description}</p>}
              <p className="text-xs text-muted">Type: {resource.type || 'Link'}</p>
            </div>
            {resource.url && (
              <Button as="a" href={resource.url} target="_blank" rel="noopener" variant="primary" size="sm" className="rounded-full px-4">
                View
              </Button>
            )}
          </Card>
        ))}
      </div>
    );
  }, [loadingState.resources, errorState.resources, resources]);

  const faqContent = useMemo(() => {
    if (loadingState.faq) {
      return (
        <div className="flex justify-center py-10">
          <Loader label="Loading FAQs" />
        </div>
      );
    }

    if (errorState.faq) {
      return (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{errorState.faq}</p>
        </Card>
      );
    }

    if (!faqs.length) {
      return <Card className="text-sm text-muted">No FAQs added yet. Reach out to organizers for clarifications.</Card>;
    }

    return (
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.id || faq.question} className="rounded-2xl border border-border bg-card p-4">
            <summary className="cursor-pointer text-sm font-semibold text-body">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    );
  }, [loadingState.faq, errorState.faq, faqs]);

  const overviewContent = useMemo(() => {
    if (loadingState.detail) {
      return (
        <div className="flex justify-center py-10">
          <Loader label="Loading event" />
        </div>
      );
    }

    if (errorState.detail) {
      return (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{errorState.detail}</p>
        </Card>
      );
    }

    if (!eventInfo) return null;

    const gradient = eventInfo.theme_gradient || 'from-[#0F2027] via-[#203A43] to-[#2C5364]';
    const organizer = eventInfo.organizer;
    const rewards = eventInfo.rewards || eventInfo.prizes;
    const eligibility = eventInfo.eligibility || eventInfo.eligibility_criteria;
    const deadline = eventInfo.registration_deadline || eventInfo.deadline;

    return (
      <div className="space-y-6">
        <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}>
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="neutral" className="bg-white/20 text-white">
                {eventInfo.status || eventInfo.registration_status || 'Open'}
              </Badge>
              {eventInfo.category && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {eventInfo.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold">{eventInfo.title || eventInfo.name}</h1>
            <p className="text-sm text-white/80">
              {eventInfo.start_time && eventInfo.end_time
                ? `${new Date(eventInfo.start_time).toLocaleDateString()} → ${new Date(eventInfo.end_time).toLocaleDateString()}`
                : eventInfo.date_range || 'Dates coming soon'}
            </p>
            {eventInfo.description && <p className="text-sm leading-relaxed text-white/80">{eventInfo.description}</p>}
            {deadline && (
              <p className="text-xs text-white/70">
                Registration deadline: {new Date(deadline).toLocaleString()} ({formatRelativeTime(deadline)})
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="space-y-2 border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-body">Organizer</h3>
            {organizer ? (
              <div className="space-y-1 text-sm text-muted">
                <p className="text-body font-semibold">{organizer.name || organizer.club_name}</p>
                {organizer.contact && <p>Contact: {organizer.contact}</p>}
                {organizer.email && <p>Email: {organizer.email}</p>}
                <Button
                  variant="subtle"
                  size="sm"
                  className="mt-2 rounded-full px-4"
                  onClick={() => navigate(`/profile?user=${organizer.id || organizer.user_id || ''}`)}
                >
                  View organizer profile
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted">Organizer details will be shared soon.</p>
            )}
          </Card>

          <Card className="space-y-2 border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-body">Rewards & opportunities</h3>
            {rewards ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                {Array.isArray(rewards)
                  ? rewards.map((reward) => <li key={reward}>{reward}</li>)
                  : <li>{rewards}</li>}
              </ul>
            ) : (
              <p className="text-sm text-muted">Rewards will be announced soon.</p>
            )}
          </Card>

          <Card className="space-y-2 border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-body">Eligibility</h3>
            {eligibility ? (
              <p className="text-sm text-muted leading-relaxed">{eligibility}</p>
            ) : (
              <p className="text-sm text-muted">Eligibility criteria will be shared soon.</p>
            )}
          </Card>

          <Card className="space-y-2 border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-body">Quick facts</h3>
            <div className="grid gap-2 text-xs text-muted">
              <div className="flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
                <span>Team size</span>
                <span className="text-body font-semibold">{eventInfo.team_size || eventInfo.max_team_size || 'Flexible'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
                <span>Format</span>
                <span className="text-body font-semibold">{eventInfo.format || 'Hybrid / TBD'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
                <span>Location</span>
                <span className="text-body font-semibold">{eventInfo.location || 'Online'}</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    );
  }, [loadingState.detail, errorState.detail, eventInfo, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return overviewContent;
      case 'timeline':
        return timelineContent;
      case 'teams':
        return teamsContent;
      case 'resources':
        return resourcesContent;
      case 'faq':
        return faqContent;
      default:
        return overviewContent;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary hover:text-primary-dark">
          ← Back to events
        </button>
        {isOrganizer && (
          <Button variant="primary" size="sm" className="rounded-full px-4" onClick={() => navigate(`/events/${eventId}/manage`)}>
            Open management dashboard
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key ? 'bg-primary text-white shadow-md' : 'bg-surface text-muted hover:text-body'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">{renderTabContent()}</div>

      <CreateTeamModal
        isOpen={createTeamModalOpen}
        onClose={() => setCreateTeamModalOpen(false)}
        onSubmit={handleCreateTeam}
        loading={teamCreationLoading}
      />
    </div>
  );
};

export default EventDetail;
