import React, { useState } from 'react';
import axios from 'axios';

function App(){
  const [form, setForm] = useState({ name: '', email: '', date: '', from: '', to: '', seats: 1 });
  const [status, setStatus] = useState(null);

  const base = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  async function submit(e){
    e.preventDefault();
    setStatus({loading: true});
    try {
      const r = await axios.post(`${base}/api/book`, form);
      setStatus({ success: true, data: r.data });
    } catch(err){
      setStatus({ error: err.response?.data || err.message });
    }
  }

  return (
    <div style={{maxWidth:600, margin:'2rem auto', fontFamily:'sans-serif'}}>
      <h1>Journey App — Book Ticket</h1>
      {status?.success ? (
        <div style={{border:'1px solid #3c3', padding:16, borderRadius:8}}>
          <h2>Booking Confirmed</h2>
          <p>Booking ID: {status.data.booking.id}</p>
          <p>{status.data.message}</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><br/><br/>
          <input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><br/><br/>
          <input placeholder="From" required value={form.from} onChange={e=>setForm({...form,from:e.target.value})} /> <input placeholder="To" required value={form.to} onChange={e=>setForm({...form,to:e.target.value})} /><br/><br/>
          <input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /><br/><br/>
          <input type="number" min="1" value={form.seats} onChange={e=>setForm({...form,seats:Number(e.target.value)})} /><br/><br/>
          <button type="submit">Book</button>
        </form>
      )}
      {status?.loading && <p>Booking…</p>}
      {status?.error && <div style={{color:'crimson'}}>{JSON.stringify(status.error)}</div>}
    </div>
  );
}

export default App;
