'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgeGate(){
 const router=useRouter(); const [error,setError]=useState('');
 function enter(){const year=Number((document.getElementById('birthYear') as HTMLInputElement).value);const max=new Date().getFullYear()-18;if(!year||year<1900||year>max){setError('You must be at least 18 years old to continue.');return;} localStorage.setItem('adult_age_verified','true');router.push('/auth');}
 return <main className="gate-page"><div className="gate-card"><div className="badge">18+ ONLY</div><h1>Adults only.</h1><p>Adult is an 18+ dating and matchmaking service. Please confirm your age before creating an account.</p><label htmlFor="birthYear">Year of birth</label><input id="birthYear" type="number" min="1900" max={new Date().getFullYear()-18} placeholder="e.g. 1992" />{error&&<p className="error">{error}</p>}<button className="primary button" onClick={enter}>Continue</button><a className="secondary" href="/">Back</a><p className="small">Age confirmation is required to enter this 18+ service.</p></div></main>;
}
