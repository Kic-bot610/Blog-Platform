import React, {useState} from 'react';

export default function Create({api, token, onDone}){
  const [title,setTitle]=useState('');
  const [body,setBody]=useState('');
  const [image,setImage]=useState(null);

  async function submit(e){
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('body', body);
    if(image) form.append('image', image);
    const res = await fetch(api+'/blogs', {
      method:'POST',
      headers:{ Authorization:'Bearer '+token },
      body: form
    });
    if(res.ok){
      alert('Created');
      onDone && onDone();
    } else {
      const d = await res.json();
      alert(d.msg || 'Create failed');
    }
  }

  return (
    <div className="card" style={{maxWidth:720, margin:'20px auto'}}>
      <h2 className="center">Hello, blogger</h2>
      <p className="center">Create your blogs easily</p>
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Body" rows={6} required/>
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
        <div style={{marginTop:12}}>
          <button type="submit">create your blog</button>
        </div>
      </form>
    </div>
  )
}
