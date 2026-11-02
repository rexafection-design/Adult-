"use client";

import { useMemo, useState } from "react";

type Category = "For You" | "Entertainment" | "Relationships" | "Community" | "Events";
type Post = { id: number; category: Exclude<Category, "For You">; label: string; title: string; body: string; author: string; time: string; likes: number; comments: number; };

const seedPosts: Post[] = [
  { id: 1, category: "Entertainment", label: "CULTURE DESK", title: "The sound of a new Nigerian weekend", body: "From Afrobeats to street-pop and emerging sounds, what song has been on repeat for you this week? Tell us what deserves a place on the weekend playlist.", author: "Pulse Editorial", time: "Today · 10:20 AM", likes: 128, comments: 34 },
  { id: 2, category: "Relationships", label: "THE CONVERSATION", title: "Can friendship survive different life timelines?", body: "One friend is getting married, another is building a business, and someone else is still figuring things out. How do adults keep friendships healthy when life moves at different speeds?", author: "Pulse Editorial", time: "Today · 9:05 AM", likes: 86, comments: 52 },
  { id: 3, category: "Community", label: "COMMUNITY QUESTION", title: "What is one thing your city needs more of?", body: "Better public spaces, safer roads, affordable recreation, more jobs, or something else? Share a practical idea that could improve everyday life where you live.", author: "Pulse Editorial", time: "Yesterday", likes: 63, comments: 19 },
  { id: 4, category: "Events", label: "EVENT SPOTLIGHT", title: "Your guide to finding something to do", body: "Discover live music, comedy, food fairs and community events. Event listings on this preview are examples; organisers will be able to submit real events for review.", author: "Pulse Editorial", time: "Yesterday", likes: 41, comments: 12 },
];

const categories: Category[] = ["For You", "Entertainment", "Relationships", "Community", "Events"];

export default function FeedApp() {
  const [active, setActive] = useState<Category>("For You");
  const [liked, setLiked] = useState<number[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [kind, setKind] = useState<"Story" | "Event" | "Poll">("Story");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const visible = useMemo(() => active === "For You" ? seedPosts : seedPosts.filter(p => p.category === active), [active]);

  function submitPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitted(true);
    setTitle("");
    setBody("");
    setShowComposer(false);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Pulse Naija home"><span className="brand-mark">P</span><span>pulse<span className="brand-accent">naija</span></span></a>
        <nav className="desktop-nav"><a href="#feed">Explore</a><a href="#events">Events</a><a href="#community">Community</a></nav>
        <div className="top-actions"><span className="adult-tag">18+ COMMUNITY</span><a className="login-link" href="#join">Join the conversation</a></div>
      </header>

      <section className="welcome">
        <div className="welcome-copy"><p className="eyebrow">CULTURE. PEOPLE. WHAT’S NEXT.</p><h1>What’s happening<br/><em>around you?</em></h1><p className="welcome-text">Your home for Nigerian entertainment, real conversations, community voices and events worth showing up for.</p><button className="primary-btn" onClick={() => { setShowComposer(true); setSubmitted(false); }}>＋ Share something</button></div>
        <div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-core">P!</div><span className="art-word word-one">GIST</span><span className="art-word word-two">VIBE</span><span className="art-word word-three">CONNECT</span></div>
      </section>

      <section className="ticker"><span className="ticker-label">THE PULSE</span><span>Fresh stories • Local voices • Music • Relationships • Events • Culture</span><span className="ticker-dot">●</span></section>

      <div className="content-layout" id="feed">
        <section className="feed-column">
          <div className="section-heading"><div><p className="eyebrow">YOUR DAILY SCROLL</p><h2>Explore the pulse</h2></div><span className="preview-note">Preview feed</span></div>
          <div className="category-tabs" role="tablist" aria-label="Feed categories">
            {categories.map(c => <button key={c} role="tab" aria-selected={active === c} className={active === c ? "tab active-tab" : "tab"} onClick={() => setActive(c)}>{c}</button>)}
          </div>

          {showComposer && <form className="composer" onSubmit={submitPost}>
            <div className="composer-head"><div><p className="eyebrow">COMMUNITY CONTRIBUTION</p><h3>Share with the community</h3></div><button type="button" className="close-btn" onClick={() => setShowComposer(false)} aria-label="Close">×</button></div>
            <p className="notice">Submissions are saved as a local preview only. In the live product, an editor must approve content before it appears publicly.</p>
            <div className="kind-tabs">{(["Story", "Event", "Poll"] as const).map(k => <button type="button" key={k} className={kind === k ? "kind active-kind" : "kind"} onClick={() => setKind(k)}>{k}</button>)}</div>
            <label htmlFor="post-title">Headline</label><input id="post-title" value={title} onChange={e => setTitle(e.target.value)} maxLength={90} placeholder={kind === "Event" ? "What is the event called?" : "Give your post a clear headline"} required/>
            <label htmlFor="post-body">{kind === "Event" ? "Event details" : kind === "Poll" ? "Question and options" : "Your contribution"}</label><textarea id="post-body" value={body} onChange={e => setBody(e.target.value)} maxLength={1200} placeholder="Write something useful, interesting or worth discussing…" required/>
            <div className="form-foot"><span>Be respectful. No harassment, scams or non-consensual content.</span><button className="primary-btn" type="submit">Send for review</button></div>
          </form>}

          {submitted && <div className="success-note"><strong>Submission captured in this preview.</strong> It has not been published or sent to a moderator because the backend is not connected yet.</div>}

          <div className="post-list">
            {visible.map(post => <article className="post-card" key={post.id}>
              <div className="post-meta"><span className="post-label">{post.label}</span><span>{post.time}</span></div>
              <p className="post-category">{post.category}</p><h3>{post.title}</h3><p className="post-body">{post.body}</p>
              <div className="post-footer"><span className="author"><span className="author-avatar">{post.author === "Pulse Editorial" ? "P" : "U"}</span>{post.author}</span><div className="post-actions"><button className={liked.includes(post.id) ? "react reacted" : "react"} onClick={() => setLiked(prev => prev.includes(post.id) ? prev.filter(x => x !== post.id) : [...prev, post.id])}>♡ {post.likes + (liked.includes(post.id) ? 1 : 0)}</button><span>◌ {post.comments}</span><button className="share-btn" onClick={() => navigator.clipboard?.writeText(post.title)}>Share ↗</button></div></div>
            </article>)}
          </div>
          <p className="demo-disclaimer">Editorial demonstration content only. These are not live user posts, verified events or real-time trending stories.</p>
        </section>

        <aside className="side-column">
          <section className="side-card" id="events"><div className="side-title"><span className="side-icon">✦</span><h3>What’s on</h3></div><p className="side-intro">A place for gigs, pop-ups, comedy, festivals and local happenings.</p><div className="event-placeholder"><span className="event-date">EVENTS</span><strong>Discover what’s happening near you</strong><small>Real listings will appear after organiser submissions are reviewed.</small></div><button className="outline-btn" onClick={() => { setKind("Event"); setShowComposer(true); setSubmitted(false); }}>＋ Submit an event</button></section>
          <section className="side-card" id="community"><div className="side-title"><span className="side-icon">◎</span><h3>Community rules</h3></div><ul className="rules"><li>Adults 18 and over only.</li><li>Respect consent and personal boundaries.</li><li>No harassment, threats or hate.</li><li>No scams, illegal drug sales or exploitation.</li><li>Never share someone’s private or intimate content without consent.</li></ul><a className="text-link" href="mailto:hello@pulsen.ai?subject=Safety%20report">Report a safety concern ↗</a></section>
          <section className="side-card sponsor-card"><p className="eyebrow">FOR BRANDS & ORGANISERS</p><h3>Reach people who care about culture.</h3><p>Sponsored stories and promoted event listings will be available after launch.</p><a className="text-link" href="mailto:partnerships@pulsen.ai">Explore partnerships ↗</a></section>
        </aside>
      </div>
      <footer className="footer"><a className="brand" href="/"><span className="brand-mark">P</span><span>pulse<span className="brand-accent">naija</span></span></a><span>Made for conversations that move culture.</span><span>18+ · Community guidelines · Privacy</span></footer>
    </main>
  );
}
