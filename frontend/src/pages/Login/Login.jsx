import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const Login = () => {
  const { signInWithPassword, signUp, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      if (isSignUp) {
        const additionalData = {
          name,
          college,
          course,
          branch,
          year: parseInt(year)
        };
        await signUp(email, password, additionalData);
        setSuccessMessage('Account created! You can now sign in.');
        setIsSignUp(false);
        setPassword('');
        setName('');
        setCollege('');
        setCourse('');
        setBranch('');
        setYear('');
      } else {
        await signInWithPassword(email, password);
        // Redirect to home after successful login (hardcoded for security)
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-app">
        <div className="glass-card p-6 animate-scale-in">
          {/* Logo & Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <RocketIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              {isSignUp ? 'Join Campus Startup' : 'Welcome Back'}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {isSignUp ? 'Start your entrepreneurial journey' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="rounded-xl bg-success-soft p-3 text-center text-sm text-success">
                {successMessage}
              </div>
            )}

            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-text-muted">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="college" className="text-xs font-medium text-text-muted">
                      College
                    </label>
                    <input
                      id="college"
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Your college"
                      className="input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="course" className="text-xs font-medium text-text-muted">
                      Course
                    </label>
                    <input
                      id="course"
                      type="text"
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g., B.Tech"
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="branch" className="text-xs font-medium text-text-muted">
                      Branch
                    </label>
                    <input
                      id="branch"
                      type="text"
                      required
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="e.g., CSE"
                      className="input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="year" className="text-xs font-medium text-text-muted">
                      Year
                    </label>
                    <select
                      id="year"
                      required
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="input"
                    >
                      <option value="">Select</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-text-muted">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-text-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={authLoading}>
              {authLoading ? (
                <Loader size="sm" inline />
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>

            {(authError || error) && (
              <p className="text-center text-sm text-danger">{authError || error}</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-text-muted">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
