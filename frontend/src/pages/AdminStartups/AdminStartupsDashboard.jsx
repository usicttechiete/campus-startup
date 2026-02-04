import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Button from '../../components/Button/Button.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import { adminApproveStartup, adminListStartups, adminRejectStartup } from '../../services/adminStartup.api.js';
import { useRole } from '../../context/RoleContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminStartupsDashboard = () => {
  const { role } = useRole();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startups, setStartups] = useState([]);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const isAllowed = role === 'admin';

  useEffect(() => {
    if (!isAllowed) {
      navigate('/');
    }
  }, [isAllowed, navigate]);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminListStartups({ status: 'PENDING' });
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setStartups(results);
    } catch (err) {
      setError(err.message || 'Failed to load startups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAllowed) return;
    loadPending();
  }, [isAllowed, loadPending]);

  const handleApprove = async (startupId) => {
    setActionLoadingId(startupId);
    setError('');
    try {
      await adminApproveStartup(startupId);
      await loadPending();
    } catch (err) {
      setError(err.message || 'Failed to approve startup');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (startupId) => {
    const reason = rejectionReason.trim();
    if (!reason) {
      setError('Rejection reason is required');
      return;
    }

    setActionLoadingId(startupId);
    setError('');
    try {
      await adminRejectStartup(startupId, { rejection_reason: reason });
      setRejectingId(null);
      setRejectionReason('');
      await loadPending();
    } catch (err) {
      setError(err.message || 'Failed to reject startup');
    } finally {
      setActionLoadingId(null);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader label="Loading startup applications" />
        </div>
      );
    }

    if (!startups.length) {
      return <Card className="text-sm text-muted">No pending startup applications.</Card>;
    }

    return (
      <div className="space-y-3">
        {startups.map((startup) => {
          const id = startup.id;
          const isActing = actionLoadingId === id;

          return (
            <Card key={id} className="space-y-3 border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-body">{startup.name}</p>
                  <p className="mt-1 text-xs text-muted">User: {startup.user_id}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="neutral">{startup.stage || '—'}</Badge>
                    <Badge variant="neutral">{startup.domain || '—'}</Badge>
                  </div>
                </div>
                <Badge variant="neutral">PENDING</Badge>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-xs font-semibold text-muted">Problem</p>
                <p className="text-sm text-body">{startup.problem || '—'}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted">Head</p>
                  <p className="mt-1 text-sm text-body">{startup.head_name || '—'}</p>
                  <p className="text-xs text-muted">{startup.head_email || ''}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted">Members</p>
                  <p className="mt-1 text-sm text-body">{startup.total_members ?? '—'}</p>
                </div>
              </div>

              {rejectingId === id ? (
                <div className="space-y-2">
                  <input
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Rejection reason"
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="rounded-full px-4"
                      onClick={() => handleReject(id)}
                      disabled={isActing}
                    >
                      {isActing ? <Loader size="sm" inline /> : 'Confirm reject'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full px-4"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectionReason('');
                      }}
                      disabled={isActing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="rounded-full px-4"
                    onClick={() => handleApprove(id)}
                    disabled={isActing}
                  >
                    {isActing ? <Loader size="sm" inline /> : 'Approve'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full px-4 text-danger"
                    onClick={() => {
                      setRejectingId(id);
                      setRejectionReason('');
                    }}
                    disabled={isActing}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  }, [actionLoadingId, loading, startups, rejectingId, rejectionReason]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-body">Startup Applications</h1>
          <p className="text-sm text-muted">Review and approve student startup requests.</p>
        </div>
        <Button size="sm" variant="ghost" className="rounded-full px-4" onClick={loadPending} disabled={loading}>
          Refresh
        </Button>
      </header>

      {error ? <Card className="border border-danger/20 bg-danger/5 text-danger">{error}</Card> : null}

      {content}
    </div>
  );
};

export default AdminStartupsDashboard;
