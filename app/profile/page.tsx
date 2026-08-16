'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [name,setName]=useState(''); const [city,setCity]=useState('');
  const [goal,setGoal]=useState('Serious relationship'); const [bio,setBio]=useState('');
  const [email,setEmail]=useState(''); const [saved,setSaved]=useState(false); const [error,setError]=useState(''); const [busy,setBusy]=useState(true);

  useEffect(()=>{ (async()=>{ const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace('/auth');return;} setEmail(user.email ?? ''); const p=user.user_metadata ?? {}; setName(p.name ?? ''); setCity(p.city ?? ''); setGoal(p.goal ?? 'Serious relationship'); setBio(p.bio ?? ''); setBusy(false); })(); },[router]);

  async function saveProfile(e:FormEvent){ e.preventDefault(); setError(''); setSaved(false); if(!name.trim()||!city.trim()) return; setBusy(true); const {error}=await supabase.auth.updateUser({data:{name:name.trim(),city:city.trim(),goal,bio:bio.trim()}}); if(error)setError(error.message); else setSaved(true); setBusy(false); }
  async function signOut(){await supabase.auth.signOut(); router.replace('/');}
  if(busy && !email) return <main className="profile-page"><section className="profile-card"><p>Loading your account…</p></section></main>;

  return <main className="profile-page"><section className="profile-card">
    <div className="badge">YOUR PROFILE</div><h1>Tell people what makes you, you.</h1><p>Signed in as {email}. Your profile is saved to your account.</p>
    <form onSubmit={saveProfile}>
      <label htmlFor="name">First name</label><input id="name" value={name} onChange={e=>setName(e.target.value)} required />
      <label htmlFor="city">City</label><input id="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Benin City" required />
      <label htmlFor="goal">Relationship goal</label><select id="goal" value={goal} onChange={e=>setGoal(e.target.value)}><option>Serious relationship</option><option>Dating</option><option>Friendship</option></select>
      <label htmlFor="bio">Short bio</label><textarea id="bio" value={bio} onChange={e=>setBio(e.target.value)} maxLength={300} placeholder="A few things you'd like a match to know..." />
      {error&&<p className="error">{error}</p>}{saved&&<div className="success">Profile saved to your account.</div>}
      <button className="primary button" disabled={busy}>{busy?'Saving…':'Save profile'}</button>
    </form>
    <button className="secondary button" onClick={signOut}>Sign out</button>
  </section></main>;
}
