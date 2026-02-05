import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card/Card.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Button from '../../components/Button/Button.jsx';
import { fetchStartupById } from '../../services/startup.api.js';

const StartupDetail = () => {
  const { id: startupId } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!startupId) return;
    let mounted = true;

    const loadStartup = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchStartupById(startupId);
        if (mounted) {
          setStartup(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load startup');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStartup();
    return () => {
      mounted = false;
    };
  }, [startupId]);

  const summary = useMemo(() => {
    if (!startup) return null;
    return (
      <section className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-wide text-white/70">Startup</p>
        <h1 className="mt-2 text-2xl font-semibold">{startup.name}</h1>
        <p className="mt-2 text-sm text-white/80">{startup.domain || 'Domain coming soon'}</p>
        {startup.problem && (
          <p className="mt-3 text-sm leading-relaxed text-white/80">{startup.problem}</p>
        )}
      </section>
    );
  }, [startup]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-primary">
          ← Back
        </button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="rounded-full px-4">
          Go home
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader label="Loading startup" />
        </div>
      )}

      {error && !loading && (
        <Card className="border border-danger/20 bg-danger/5 text-danger">
          {error}
        </Card>
      )}

      {!loading && !error && startup && (
        <div className="space-y-5">
          {summary}

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Stage</h3>
              {startup.stage ? <Badge variant="neutral">{startup.stage}</Badge> : <p className="text-sm text-muted">—</p>}
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Status</h3>
              <p className="text-sm text-muted">{startup.status || 'Active'}</p>
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Head</h3>
              <p className="text-sm text-muted">{startup.head_name || '—'}</p>
              {startup.head_email && <p className="text-xs text-muted">{startup.head_email}</p>}
            </Card>
            <Card className="space-y-2 border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-body">Team size</h3>
              <p className="text-sm text-muted">{startup.total_members ?? '—'}</p>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

export default StartupDetail;
