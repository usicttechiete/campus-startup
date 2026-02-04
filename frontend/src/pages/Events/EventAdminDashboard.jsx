import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import AdminTeamTable from '../../components/Events/AdminTeamTable.jsx';
import {
  adminFetchEventSummary,
  adminFetchTeams,
  adminFetchParticipants,
  adminAddResource,
  adminDeleteResource,
  adminCreateFaq,
  adminUpdateFaq,
  adminDeleteFaq,
  adminUpdateTeamStatus,
  adminMoveSoloParticipant,
  adminLockTeamFormation,
  fetchEventResources,
  fetchEventFaqs,
} from '../../services/event.api.js';
import { useRole } from '../../context/RoleContext.jsx';

const sectionTabs = [
  { key: 'overview', label: 'Event Overview' },
  { key: 'teams', label: 'Team Management' },
  { key: 'participants', label: 'Participants' },
  { key: 'resources', label: 'Resources' },
  { key: 'faq', label: 'FAQ Editor' },
];

const AdminParticipantRow = ({ participant, teams, onMove, loading }) => {
  const identifier = participant.id || participant.participant_id;
  const [selectedTeam, setSelectedTeam] = useState('');

  return (
    <div className="grid grid-cols-12 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm">
      <div className="col-span-3">
        <p className="font-semibold text-body">{participant.name || participant.email || 'Participant'}</p>
        {participant.email && <p className="text-xs text-muted">{participant.email}</p>}
      </div>
      <div className="col-span-3 text-xs text-muted">
        {participant.skills?.length ? (
          <span>Skills: {participant.skills.join(', ')}</span>
        ) : (
          <span className="italic">No skills listed</span>
        )}
      </div>
      <div className="col-span-3 text-xs text-muted">
        {participant.status || participant.registration_status || 'Solo applicant'}
      </div>
      <div className="col-span-3 flex items-center gap-2">
        <select
          value={selectedTeam}
          onChange={(event) => setSelectedTeam(event.target.value)}
          className="flex-1 rounded-full border border-border bg-surface px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select team</option>
          {teams.map((team) => (
            <option key={team.id || team.team_id} value={team.id || team.team_id}>
              {team.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="primary"
          className="rounded-full px-4"
          disabled={!selectedTeam || loading}
          onClick={() => onMove(identifier, selectedTeam)}
        >
          {loading ? <Loader size="sm" inline /> : 'Move'}
        </Button>
      </div>
    </div>
  );
};

const ResourceForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('Link');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      url: url.trim(),
      type,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-border bg-card p-5">
      <div>
        <h3 className="text-sm font-semibold text-body">Add resource</h3>
        <p className="text-xs text-muted">Share decks, repositories, or any reference material for participants.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder="Resource title"
          className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {['Link', 'PDF', 'Deck', 'Github', 'Drive'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
        placeholder="https://..."
        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
        placeholder="Short description (optional)"
        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" disabled={loading} className="rounded-full px-5">
          {loading ? <Loader size="sm" inline label="Adding" /> : 'Add resource'}
        </Button>
      </div>
    </form>
  );
};

const FaqEditor = ({ faqs, onCreate, onUpdate, onDelete, loading }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      onUpdate(editingId, { question: question.trim(), answer: answer.trim() });
    } else {
      onCreate({ question: question.trim(), answer: answer.trim() });
    }
    setQuestion('');
    setAnswer('');
    setEditingId(null);
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-border bg-card p-5">
        <div>
          <h3 className="text-sm font-semibold text-body">{editingId ? 'Update FAQ' : 'Add FAQ'}</h3>
          <p className="text-xs text-muted">Guide participants with answers to the most common questions.</p>
        </div>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          required
          placeholder="Question"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          required
          rows={3}
          placeholder="Answer"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-end gap-3">
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingId(null);
                setQuestion('');
                setAnswer('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" size="sm" disabled={loading} className="rounded-full px-5">
            {loading ? <Loader size="sm" inline label="Saving" /> : editingId ? 'Update FAQ' : 'Add FAQ'}
          </Button>
        </div>
      </form>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id || faq.question} className="space-y-2 border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-body">{faq.question}</h4>
                <p className="text-sm text-muted">{faq.answer}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button size="sm" variant="subtle" className="rounded-full px-4" onClick={() => startEdit(faq)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full px-4 text-danger"
                  onClick={() => onDelete(faq.id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {!faqs.length && <Card className="text-sm text-muted">No FAQs yet. Add questions to guide participants.</Card>}
      </div>
    </div>
  );
};

const EventAdminDashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();

  const [activeTab, setActiveTab] = useState('overview');

  const [summary, setSummary] = useState(null);
  const [teams, setTeams] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [resources, setResources] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [loadingState, setLoadingState] = useState({
    summary: false,
    teams: false,
    participants: false,
    resources: false,
    faq: false,
    action: false,
  });

  const [errorState, setErrorState] = useState({});
  const [teamActionLoadingId, setTeamActionLoadingId] = useState(null);
  const [participantMoveLoadingId, setParticipantMoveLoadingId] = useState(null);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [faqLoading, setFaqLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

  const isAllowed = ['admin', 'organizer', 'club'].includes(role);

  useEffect(() => {
    if (!isAllowed) {
      navigate('/events');
    }
  }, [isAllowed, navigate]);

  const loadSummary = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, summary: true }));
    setErrorState((prev) => ({ ...prev, summary: null }));
    try {
      const data = await adminFetchEventSummary(eventId);
      setSummary(data);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, summary: error.message || 'Failed to load summary' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, summary: false }));
    }
  }, [eventId]);

  const loadTeams = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, teams: true }));
    setErrorState((prev) => ({ ...prev, teams: null }));
    try {
      const data = await adminFetchTeams(eventId);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setTeams(results);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Failed to load teams' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, teams: false }));
    }
  }, [eventId]);

  const loadParticipants = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, participants: true }));
    setErrorState((prev) => ({ ...prev, participants: null }));
    try {
      const data = await adminFetchParticipants(eventId);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setParticipants(results);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, participants: error.message || 'Failed to load participants' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, participants: false }));
    }
  }, [eventId]);

  const loadResources = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, resources: true }));
    setErrorState((prev) => ({ ...prev, resources: null }));
    try {
      const data = await fetchEventResources(eventId);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setResources(results);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, resources: error.message || 'Failed to load resources' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, resources: false }));
    }
  }, [eventId]);

  const loadFaqsAsync = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, faq: true }));
    setErrorState((prev) => ({ ...prev, faq: null }));
    try {
      const data = await fetchEventFaqs(eventId);
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setFaqs(results);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, faq: error.message || 'Failed to load FAQs' }));
    } finally {
      setLoadingState((prev) => ({ ...prev, faq: false }));
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !isAllowed) return;
    loadSummary();
    loadTeams();
    loadParticipants();
    loadResources();
    loadFaqsAsync();
  }, [eventId, isAllowed, loadSummary, loadTeams, loadParticipants, loadResources, loadFaqsAsync]);

  const handleTeamAction = async (teamId, status) => {
    setTeamActionLoadingId(teamId);
    try {
      await adminUpdateTeamStatus(eventId, teamId, { status });
      await loadTeams();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Failed to update team status' }));
    } finally {
      setTeamActionLoadingId(null);
    }
  };

  const handleMoveParticipant = async (participantId, teamId) => {
    setParticipantMoveLoadingId(participantId);
    try {
      await adminMoveSoloParticipant(eventId, participantId, teamId);
      await Promise.all([loadParticipants(), loadTeams()]);
    } catch (error) {
      setErrorState((prev) => ({ ...prev, participants: error.message || 'Failed to move participant' }));
    } finally {
      setParticipantMoveLoadingId(null);
    }
  };

  const handleLockTeams = async () => {
    setLockLoading(true);
    try {
      await adminLockTeamFormation(eventId);
      await loadTeams();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, teams: error.message || 'Failed to lock teams' }));
    } finally {
      setLockLoading(false);
    }
  };

  const handleAddResource = async (payload) => {
    setResourceLoading(true);
    try {
      await adminAddResource(eventId, payload);
      await loadResources();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, resources: error.message || 'Failed to add resource' }));
    } finally {
      setResourceLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    setResourceLoading(true);
    try {
      await adminDeleteResource(eventId, resourceId);
      await loadResources();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, resources: error.message || 'Failed to delete resource' }));
    } finally {
      setResourceLoading(false);
    }
  };

  const handleCreateFaq = async (payload) => {
    setFaqLoading(true);
    try {
      await adminCreateFaq(eventId, payload);
      await loadFaqsAsync();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, faq: error.message || 'Failed to add FAQ' }));
    } finally {
      setFaqLoading(false);
    }
  };

  const handleUpdateFaq = async (faqId, payload) => {
    setFaqLoading(true);
    try {
      await adminUpdateFaq(eventId, faqId, payload);
      await loadFaqsAsync();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, faq: error.message || 'Failed to update FAQ' }));
    } finally {
      setFaqLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    setFaqLoading(true);
    try {
      await adminDeleteFaq(eventId, faqId);
      await loadFaqsAsync();
    } catch (error) {
      setErrorState((prev) => ({ ...prev, faq: error.message || 'Failed to delete FAQ' }));
    } finally {
      setFaqLoading(false);
    }
  };

  const overviewContent = useMemo(() => {
    if (loadingState.summary) {
      return (
        <div className="flex justify-center py-12">
          <Loader label="Loading event summary" />
        </div>
      );
    }

    if (errorState.summary) {
      return (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          <p>{errorState.summary}</p>
        </Card>
      );
    }

    if (!summary) return null;

    return (
      <div className="space-y-4">
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="space-y-2 border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Registrations</p>
            <p className="text-2xl font-semibold text-body">{summary.registration_count ?? 0}</p>
            <p className="text-xs text-muted">Participants registered so far</p>
          </Card>
          <Card className="space-y-2 border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Teams</p>
            <p className="text-2xl font-semibold text-body">{summary.team_count ?? 0}</p>
            <p className="text-xs text-muted">Active teams + pending requests</p>
          </Card>
          <Card className="space-y-2 border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Solo applicants</p>
            <p className="text-2xl font-semibold text-body">{summary.solo_participants ?? 0}</p>
            <p className="text-xs text-muted">Students awaiting team placement</p>
          </Card>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-body">Key milestones</h3>
          <div className="mt-3 grid gap-3 text-xs text-muted sm:grid-cols-2">
            {summary.milestones?.length ? (
              summary.milestones.map((milestone) => (
                <div key={milestone.label} className="rounded-2xl bg-surface px-3 py-2">
                  <p className="text-body font-semibold">{milestone.label}</p>
                  <p>{milestone.date ? new Date(milestone.date).toLocaleString() : 'TBA'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Milestones will be added soon.</p>
            )}
          </div>
        </section>
      </div>
    );
  }, [loadingState.summary, errorState.summary, summary]);

  const teamsContent = useMemo(() => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-body">Team management</h2>
          <p className="text-sm text-muted">Review teams, approve requests, and lock formation when ready.</p>
        </div>
        <Button variant="primary" size="sm" className="rounded-full px-4" onClick={handleLockTeams} disabled={lockLoading}>
          {lockLoading ? <Loader size="sm" inline label="Locking" /> : 'Lock team formation'}
        </Button>
      </div>

      {errorState.teams && <Card className="border border-danger/20 bg-danger/5 text-danger">{errorState.teams}</Card>}

      {loadingState.teams ? (
        <div className="flex justify-center py-10">
          <Loader label="Loading teams" />
        </div>
      ) : (
        <AdminTeamTable
          teams={teams}
          onApprove={(teamId) => handleTeamAction(teamId, 'approved')}
          onReject={(teamId) => handleTeamAction(teamId, 'rejected')}
          onLock={(teamId) => handleTeamAction(teamId, 'locked')}
          actionLoadingId={teamActionLoadingId}
        />
      )}

      {summary?.join_requests?.length ? (
        <Card className="space-y-3 border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-body">Pending join requests</h3>
          <div className="space-y-2 text-sm text-muted">
            {summary.join_requests.map((request) => (
              <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-surface px-3 py-2">
                <span>
                  {request.user_name} → {request.team_name}
                </span>
                <Badge variant="neutral">{request.status || 'pending'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  ), [teams, teamActionLoadingId, lockLoading, loadingState.teams, errorState.teams, summary]);

  const participantsContent = useMemo(() => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-body">Solo participants</h2>
        <p className="text-sm text-muted">Match solo applicants into teams and keep them engaged.</p>
      </div>

      {errorState.participants && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">{errorState.participants}</Card>
      )}

      {loadingState.participants ? (
        <div className="flex justify-center py-10">
          <Loader label="Loading participants" />
        </div>
      ) : participants.length ? (
        <div className="space-y-3">
          {participants.map((participant) => (
            <AdminParticipantRow
              key={participant.id || participant.participant_id}
              participant={participant}
              teams={teams}
              onMove={handleMoveParticipant}
              loading={participantMoveLoadingId === (participant.id || participant.participant_id)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-sm text-muted">No solo participants pending. Great job keeping students matched!</Card>
      )}
    </div>
  ), [participants, teams, errorState.participants, loadingState.participants, participantMoveLoadingId]);

  const resourcesContent = useMemo(() => (
    <div className="space-y-5">
      <ResourceForm onSubmit={handleAddResource} loading={resourceLoading} />
      {errorState.resources && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">{errorState.resources}</Card>
      )}
      {loadingState.resources ? (
        <div className="flex justify-center py-10">
          <Loader label="Loading resources" />
        </div>
      ) : resources.length ? (
        <div className="space-y-3">
          {resources.map((resource) => (
            <Card key={resource.id || resource.url} className="flex items-start justify-between gap-4 border border-border bg-card p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-body">{resource.title}</p>
                {resource.description && <p className="text-sm text-muted">{resource.description}</p>}
                <p className="text-xs uppercase tracking-wide text-muted">{resource.type}</p>
              </div>
              <div className="flex gap-2">
                {resource.url && (
                  <Button as="a" href={resource.url} target="_blank" rel="noopener" size="sm" variant="subtle" className="rounded-full px-4">
                    Open
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full px-4 text-danger"
                  onClick={() => handleDeleteResource(resource.id)}
                  disabled={resourceLoading}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-sm text-muted">No resources yet. Add starter kits, brief decks, or reference links.</Card>
      )}
    </div>
  ), [resourceLoading, errorState.resources, loadingState.resources, resources]);

  const faqContent = useMemo(
    () => (
      <FaqEditor
        faqs={faqs}
        onCreate={handleCreateFaq}
        onUpdate={handleUpdateFaq}
        onDelete={handleDeleteFaq}
        loading={faqLoading}
      />
    ),
    [faqs, faqLoading],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return overviewContent;
      case 'teams':
        return teamsContent;
      case 'participants':
        return participantsContent;
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
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/events/${eventId}`)}
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            ← Back to event
          </button>
          <h1 className="mt-2 text-2xl font-semibold text-body">Event Management Dashboard</h1>
          <p className="text-sm text-muted">Administer teams, participants, and resources for this event.</p>
        </div>
        {summary?.status && <Badge variant="primary">{summary.status}</Badge>}
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {sectionTabs.map((tab) => (
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
    </div>
  );
};

export default EventAdminDashboard;
