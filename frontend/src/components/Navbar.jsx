import React, {useState} from 'react';

export default function Navbar({username='', onNavigate=()=>{}, onLogout=()=>{}}){
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="logo-section">
        <img src="/logo.png" alt="logo" className="logo"/>
        <span className="brand">Blog</span>
      </div>
      <div className="nav-right">
        <button onClick={()=>onNavigate('home')}>Home</button>
        <div className={"dropdown" + (open? ' open':'')} style={{marginLeft:8}}>
          <button onClick={()=>setOpen(!open)}>Profile {username? `(${username})` : ''}</button>
          <div className="dropdown-content">
            <div style={{padding:'8px 12px'}}>
              <button onClick={()=>{onNavigate('create'); setOpen(false);}}>Create Blog</button><br/><br/>
              <button onClick={()=>{onNavigate('edit'); setOpen(false);}}>Edit/Delete Blog</button><br/><br/>
              <button onClick={()=>{onLogout(); setOpen(false);}}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
