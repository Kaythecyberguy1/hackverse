import { Link } from "react-router-dom";

export default function Rooms(){
  const rooms = [
    { id:1, name:'Web Fundamentals', level:'Beginner', desc:'OWASP Top 10 basics' },
    { id:2, name:'Privilege Escalation', level:'Intermediate', desc:'Linux/Windows privesc' },
    { id:3, name:'Red Team Ops', level:'Advanced', desc:'Lateral movement & C2' }
  ];

  return (
    <section className="page">
      <div className="container">
        <h2 style={{textAlign:'center'}}>Rooms & Paths</h2>
        <div className="grid cols-3" style={{marginTop:18}}>
          {rooms.map(r => (
            <article className="card lab-card card-outer" key={r.id}>
              <span className="pill">{r.level}</span>
              <h3 style={{marginTop:10}}>{r.name}</h3>
              <p style={{color:'var(--muted)'}}>{r.desc}</p>
              <div style={{marginTop:12}}>
                <Link to={`/rooms/${r.id}`} className="btn">Enter Room</Link>
                <Link to="/labs" className="btn" style={{marginLeft:8}}>See Labs</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
