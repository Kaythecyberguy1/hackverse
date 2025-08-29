export default function Features(){
    return (
      <section className="section">
        <div className="container">
          <h2>Why HackVerse</h2>
          <div className="grid cols-3" style={{marginTop:18}}>
            <article className="card">
              <div className="icon">🖥️</div>
              <h3>Browser Attack Box</h3>
              <p>Launch a full Linux desktop with tools via web VNC. No setup required.</p>
            </article>
            <article className="card">
              <div className="icon">🧠</div>
              <h3>Guided Rooms</h3>
              <p>Practice real-world scenarios with hints, writeups, and auto-graded flags.</p>
            </article>
            <article className="card">
              <div className="icon">🏆</div>
              <h3>Challenges & Leaderboards</h3>
              <p>Compete in CTFs, climb rankings, and showcase skills with profiles.</p>
            </article>
          </div>
        </div>
      </section>
    );
  }
  