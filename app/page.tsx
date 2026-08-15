export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="badge">18+ ONLY</div>
        <h1>Meet someone who actually matches you.</h1>
        <p>
          Adult is a modern dating experience built around compatibility,
          genuine connections, and safety.
        </p>
        <div className="actions">
          <a className="primary" href="#join">Join free</a>
          <a className="secondary" href="#how">How it works</a>
        </div>
        <p className="small">You must be 18 or older to use Adult.</p>
      </section>

      <section id="how" className="features">
        <article>
          <span>01</span>
          <h2>Build your profile</h2>
          <p>Tell us what matters to you, from interests to relationship goals.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Discover better matches</h2>
          <p>Explore people using preferences designed to go beyond location alone.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Connect safely</h2>
          <p>Block and report tools are part of the product from the beginning.</p>
        </article>
      </section>

      <section id="join" className="join">
        <h2>Ready to meet someone compatible?</h2>
        <p>The first version is free to join. Premium features will unlock more discovery and matching tools.</p>
        <a className="primary" href="#">Create your profile</a>
      </section>
    </main>
  );
}
