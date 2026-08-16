'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [goal, setGoal] = useState('Serious relationship');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('adult_age_verified') !== 'true') router.replace('/age-gate');
  }, [router]);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;
    localStorage.setItem('adult_profile', JSON.stringify({ name, city, goal, bio }));
    setSaved(true);
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="badge">YOUR PROFILE</div>
        <h1>Tell people what makes you, you.</h1>
        <p>Start with the basics. We will use your preferences later to improve compatibility.</p>
        <form onSubmit={saveProfile}>
          <label htmlFor="name">First name</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your first name" required />
          <label htmlFor="city">City</label>
          <input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Benin City" required />
          <label htmlFor="goal">Relationship goal</label>
          <select id="goal" value={goal} onChange={e => setGoal(e.target.value)}>
            <option>Serious relationship</option>
            <option>Dating</option>
            <option>Friendship</option>
          </select>
          <label htmlFor="bio">Short bio</label>
          <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} maxLength={300} placeholder="A few things you'd like a match to know..." />
          <button className="primary button" type="submit">Save profile</button>
        </form>
        {saved && <div className="success">Profile saved on this device. Next we'll connect this to your account and database.</div>}
      </section>
    </main>
  );
}
