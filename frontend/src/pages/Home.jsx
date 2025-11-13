import React, {useEffect, useState} from 'react';

export default function Home({api, token}){
  const [blogs, setBlogs] = useState([]);

  useEffect(()=>{
    fetch(api+'/blogs/all')
      .then(r=>r.json())
      .then(setBlogs)
      .catch(console.error);
  },[]);

  return (
    <div style={{paddingTop:20}}>
      <h2 style={{textAlign:'center'}}>Home</h2>
      <div style={{maxWidth:920, margin:'16px auto'}}>
        {blogs.length===0 && <div className="card">No blogs yet</div>}
        {blogs.map(b=>(
          <div key={b.id} className="card">
            <h3>{b.title}</h3>
            {b.image && <img src={api+'/uploads/'+b.image} alt="blog" style={{maxWidth: '100%', height:'auto'}}/>}
            <p>{b.body}</p>
            <div style={{fontSize:12, color:'#555'}}>By: {b.author} • {new Date(b.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
