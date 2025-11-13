import React, {useState} from 'react';

export default function Login({onLogin, api}){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  async function doLogin(e){
    e.preventDefault();
    const res = await fetch(api+'/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password})
    });
    const data = await res.json();
    if(res.ok && data.access_token){
      onLogin(data.access_token, data.username);
    } else {
      alert(data.msg || 'Login failed');
    }
  }

  return (
    <div className="card" style={{maxWidth:420, margin:'60px auto'}}>
      <h2 className="center">Login</h2>
      <form onSubmit={doLogin}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button type="submit">Login</button>
          <button type="button" onClick={()=>window.location.href='/signup'}>Signup</button>
        </div>
      </form>
    </div>
  )
}
