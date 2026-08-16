'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setMessage(''); setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { age_confirmed: true } } });
        if (error) throw error;
        if (!data.session) setMessage('Account created. Check your email to confirm your account, then sign in.');
        else router.push('/profile');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/profile');
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setBusy(false); }
  }

  return <main className="profile-page"><section className="profile-card">
    <div className="badge">18+ MEMBERS</div>
    <h1>{mode === 'signup' ? 'Create your account.' : 'Welcome back.'}</h1>
    <p>{mode === 'signup' ? 'Your account lets your profile persist across devices.' : 'Sign in to continue to your Adult profile.'}</p>
    <form onSubmit={submit}>
      <label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" />
      <label htmlFor="password">Password</label><input id="password" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete={mode==='signup'?'new-password':'current-password'} />
      {error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}
      <button className="primary button" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
    </form>
    <button className="secondary button" onClick={()=>{setMode(mode==='signup'?'login':'signup');setError('');setMessage('');}}>{mode==='signup'?'Already have an account? Sign in':'Need an account? Sign up'}</button>
    <a className="secondary" href="/">Back</a>
  </section></main>;
}
