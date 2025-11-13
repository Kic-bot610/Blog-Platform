import React, {useState} from 'react';

export default function Signup({api, onDone}){
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  async function doSignup(e){
    e.preventDefault();
    const res = await fetch(api+'/signup', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username,email,password})
    });
    const data = await res.json();
    if(res.ok){
      alert('Registered. Please login.');
      onDone && onDone();
    } else {
      alert(data.msg || 'Signup failed');
    }
  }

  return (
    <div className="card" style={{maxWidth:420, margin:'60px auto'}}>
      <h2 className="center">Signup</h2>
      <form onSubmit={doSignup}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/>
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}
