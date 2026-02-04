import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const { signInWithPassword, signUp, authLoading, authError } = useAuth();
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
        setIsSignUp(false); // Switch to sign-in view
        setPassword('');   // Clear password field
        // Clear additional fields
        setName('');
        setCollege('');
        setCourse('');
        setBranch('');
        setYear('');
      } else {
        await signInWithPassword(email, password);
      }
    } catch (err) {
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
            🎓
          </div>
          <h1 className="text-2xl font-semibold text-body">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isSignUp ? 'Join your campus network.' : 'Sign in to continue.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-2xl bg-primary-light p-4 text-center text-sm text-primary">
              {successMessage}
            </div>
          )}

          {isSignUp && (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-muted">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="college" className="block text-sm font-medium text-muted">
                  College
                </label>
                <input
                  id="college"
                  type="text"
                  required
                  value={college}
                  onChange={(event) => setCollege(event.target.value)}
                  placeholder="Enter your college name"
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="course" className="block text-sm font-medium text-muted">
                  Course
                </label>
                <input
                  id="course"
                  type="text"
                  required
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="e.g., B.Tech, MBA, BCA"
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="branch" className="block text-sm font-medium text-muted">
                  Branch/Specialization
                </label>
                <input
                  id="branch"
                  type="text"
                  required
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  placeholder="e.g., Computer Science, Mechanical"
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-muted">
                  Year of Study
                </label>
                <select
                  id="year"
                  required
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
                >
                  <option value="">Select your year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-muted">
              University Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="yourname@university.edu"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body outline-none ring-primary transition focus:ring"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={authLoading}>
            {authLoading ? (
              <Loader size="sm" label={isSignUp ? 'Creating Account...' : 'Signing In...'} inline />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </Button>

          {authError && <p className="text-sm text-danger">{authError}</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
        </form>

        <div className="mt-6 text-center text-sm">
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:underline">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
