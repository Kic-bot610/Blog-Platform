import React, {useState, useEffect} from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Navbar from './components/Navbar';

const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState(token ? 'home' : 'login');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(()=>{
    if(token) setPage('home');
  },[token]);

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
    setPage('login');
  }

  return (
    <div className="app-bg">
      <Navbar username={username} onNavigate={setPage} onLogout={logout} />
      <main className="main-area">
        {page==='login' && <Login onLogin={(t,u)=>{setToken(t); setUsername(u); localStorage.setItem('token',t); localStorage.setItem('username',u); setPage('home');}} api={API}/>}
        {page==='signup' && <Signup api={API} onDone={()=>setPage('login')} />}
        {page==='home' && <Home api={API} token={token} />}
        {page==='create' && <Create api={API} token={token} onDone={()=>setPage('home')} />}
        {page==='edit' && <Edit api={API} token={token} onDone={()=>setPage('home')} />}
      </main>
    </div>
  )
}
