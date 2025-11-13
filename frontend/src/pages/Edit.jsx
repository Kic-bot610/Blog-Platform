import React, {useEffect, useState} from 'react';

export default function Edit({api, token, onDone}){
  const [blogs, setBlogs] = useState([]);

  useEffect(()=>{
    fetch(api+'/blogs', {headers: { Authorization:'Bearer '+token }})
      .then(r=>r.json())
      .then(setBlogs)
      .catch(console.error);
  },[token]);

  async function doDelete(id){
    if(!confirm('Delete this blog?')) return;
    const res = await fetch(api+'/blogs/'+id, { method:'DELETE', headers:{ Authorization:'Bearer '+token }});
    if(res.ok) setBlogs(blogs.filter(b=>b.id!==id));
    else alert('Delete failed');
  }

  return (
    <div style={{paddingTop:20}}>
      <h2 style={{textAlign:'center'}}>Edit / Delete</h2>
      <div style={{maxWidth:920, margin:'16px auto'}}>
        {blogs.map(b=>(
          <div key={b.id} className="card">
            <h3>{b.title}</h3>
            <p>{b.body}</p>
            <div className="blog-actions">
              <button onClick={()=>{ const newTitle = prompt('New title', b.title); if(newTitle){ fetch(api+'/blogs/'+b.id,{method:'PUT', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token}, body: JSON.stringify({title:newTitle}) }).then(r=>r.ok? alert('Updated'):alert('Update failed')); } }}>Edit</button>
              <button onClick={()=>doDelete(b.id)} style={{marginLeft:8}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
