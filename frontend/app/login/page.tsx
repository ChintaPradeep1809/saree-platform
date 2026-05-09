'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function LoginForm() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(regData.name, regData.email, regData.password, regData.phone || undefined);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-primary/20 px-4 py-3 text-sm text-foreground bg-transparent focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-light tracking-wide text-center mb-2">
        {tab === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p className="text-xs text-foreground/40 text-center tracking-wide mb-8">
        {tab === 'login' ? 'Sign in to your account' : 'Join Silk & Grace'}
      </p>

      <div className="flex border-b border-primary/10 mb-8">
        {(['login', 'register'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(''); }}
            className={`flex-1 py-2.5 text-xs tracking-[0.2em] uppercase transition-colors ${
              tab === t ? 'border-b-2 border-primary text-primary' : 'text-foreground/40 hover:text-primary'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-4 text-center">{error}</p>
      )}

      {tab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" placeholder="Email address" required
            value={loginData.email}
            onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
            className={inputCls}
          />
          <input
            type="password" placeholder="Password" required
            value={loginData.password}
            onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
            className={inputCls}
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-primary-dark transition-colors disabled:opacity-40"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text" placeholder="Full name" required
            value={regData.name}
            onChange={e => setRegData(p => ({ ...p, name: e.target.value }))}
            className={inputCls}
          />
          <input
            type="email" placeholder="Email address" required
            value={regData.email}
            onChange={e => setRegData(p => ({ ...p, email: e.target.value }))}
            className={inputCls}
          />
          <input
            type="password" placeholder="Password (min 6 chars)" required minLength={6}
            value={regData.password}
            onChange={e => setRegData(p => ({ ...p, password: e.target.value }))}
            className={inputCls}
          />
          <input
            type="tel" placeholder="Phone number (optional)"
            value={regData.phone}
            onChange={e => setRegData(p => ({ ...p, phone: e.target.value }))}
            className={inputCls}
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-primary-dark transition-colors disabled:opacity-40"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-foreground/30 mt-6">
        <Link href="/" className="hover:text-primary transition-colors">← Back to home</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
