'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgeGate() {
  const router = useRouter();
  const [error, setError] = useState('');

  function enter() {
    const year = Number((document.getElementById('birthYear') as HTMLInputElement).value);
    const currentYear = new Date().getFullYear();
    if (!year || year < 1900 || year > currentYear - 18) {
      setError('You must be at least 18 years old to continue.');
      return;
    }
    localStorage.setItem('adult_age_verified', 'true');
    router.push('/profile');
  }

  return (
    <main className="gate-page">
      <div className="gate-card">
        <div className="badge">18+ ONLY</div>
        <h1>Adults only.</h1>
        <p>Adult is an 18+ dating and matchmaking service. Please confirm your age before continuing.</p>
        <label htmlFor="birthYear">Year of birth</label>
        <input id="birthYear" type="number" min="1900" max={new Date().getFullYear() - 18} placeholder="e.g. 1992" />
        {error && <p className="error">{error}</p>}
        <button className="primary button" onClick={enter}>Continue</button>
        <a className="secondary" href="/">Back</a>
        <p className="small">By continuing, you confirm that you are 18 or older.</p>
      </div>
    </main>
  );
}
