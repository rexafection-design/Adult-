'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type Candidate = { id: string; name: string; age: number; city: string; goal: string; bio: string; emoji: string };

const candidates: Candidate[] = [
  { id: 'maya', name: 'Maya', age: 28, city: 'Benin City', goal: 'Serious relationship', bio: 'Warm, ambitious and looking for a genuine connection.', emoji: 'M' },
  { id: 'jordan', name: 'Jordan', age: 31, city: 'Warri', goal: 'Dating', bio: 'Good conversations, good energy and a love for new places.', emoji: 'J' },
  { id: 'alex', name: 'Alex', age: 26, city: 'Benin City', goal: 'Friendship', bio: 'Creative, social and always up for something interesting.', emoji: 'A' },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.replace('/auth'); });
    try { setLiked(JSON.parse(localStorage.getItem('adult-liked') || '[]')); } catch {}
  }, [router]);

  const current = candidates[index];
  const remaining = useMemo(() => candidates.length - index, [index]);

  function decide(type: 'like' | 'pass') {
    if (!current) return;
    if (type === 'like') {
      const next = Array.from(new Set([...liked, current.id]));
      setLiked(next); localStorage.setItem('adult-liked', JSON.stringify(next));
      if (current.id === 'maya') setNotice(`It's a match! ${current.name} liked you too.`);
      else setNotice(`You liked ${current.name}.`);
    } else setNotice(`Passed on ${current.name}.`);
    setTimeout(() => { setNotice(''); setIndex(i => i + 1); }, 650);
  }

  if (!current) return <main className="profile-page"><section className="profile-card"><div className="badge">DISCOVER</div><h1>You’re all caught up.</h1><p>New profiles will appear as the community grows.</p><a className="primary button" href="/profile">Edit profile</a><a className="secondary button" href="/">Home</a></section></main>;

  return <main className="profile-page"><section className="discover-card">
    <div className="discover-top"><span className="badge">DISCOVER</span><span>{remaining} left</span></div>
    <div className="avatar">{current.emoji}</div>
    <h1>{current.name}, {current.age}</h1>
    <p className="location">{current.city} · {current.goal}</p>
    <p className="bio">{current.bio}</p>
    {notice && <div className="success">{notice}</div>}
    <div className="discover-actions"><button className="pass" onClick={() => decide('pass')} aria-label="Pass">✕</button><button className="like" onClick={() => decide('like')} aria-label="Like">♥</button></div>
    <a className="secondary button" href="/profile">My profile</a>
  </section></main>;
}
