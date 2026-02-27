import React, { useState } from 'react';
import './App.css';

// Mock recipe data for display (replace with props or context as needed)
const mockRecipe = {
  image: '', // Placeholder, can use a default image or emoji
  title: 'Spinach Chicken Stir-Fry',
  stars: 5,
  calories: 264,
  carbs: 8,
  protein: 18,
  tips: [
    'High in protein, great for weight loss!'
  ]
};

export default function FeedbackRating({ onSubmit }) {
  // Only handle rating and commenting
  const [like, setLike] = useState(null); // true = like, false = not for me
  const [comment, setComment] = useState('');

  const handleRate = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ type: 'rate', like, comment });
    setLike(null); setComment('');
  };

  return (
    <div className="card" style={{maxWidth:600,margin:'40px auto',padding:'40px 32px',boxShadow:'0 16px 64px #ff1e5633, 0 2px 24px #23c48333'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:24}}>
        <div style={{width:64,height:64,background:'#eee',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>
          {mockRecipe.image || <span role="img" aria-label="food">🍲</span>}
        </div>
        <div>
          <div style={{fontFamily:'Fredoka One',fontSize:'1.5rem',color:'#2d7a46'}}>{mockRecipe.title}</div>
          <div style={{color:'#ffb36a',fontSize:'1.2rem',margin:'4px 0'}}>
            {'★'.repeat(mockRecipe.stars)}{'☆'.repeat(5-mockRecipe.stars)}
          </div>
        </div>
      </div>
      {/* Nutrition Info */}
      <div style={{fontFamily:'Quicksand',fontSize:'1rem',color:'#444',marginBottom:8}}>
        <b>Calories:</b> {mockRecipe.calories}kcal &nbsp;|&nbsp; <b>Carbohydrates:</b> {mockRecipe.carbs}g &nbsp;|&nbsp; <b>Protein:</b> {mockRecipe.protein}g
      </div>
      {/* Tips */}
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:'bold',fontFamily:'Quicksand',marginBottom:4}}>Tips:</div>
        <ul style={{margin:0,paddingLeft:20}}>
          {mockRecipe.tips.map((tip,i)=>(
            <li key={i} style={{fontFamily:'Quicksand',fontSize:'1rem',marginBottom:2}}>
              {tip} <span role="img" aria-label="tip" style={{fontSize:'1.1rem',marginLeft:4}}>💡</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Feedback Form */}
      <form onSubmit={handleRate}>
        <h2 style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:24}}>Rate this Recipe</h2>
        <div style={{display:'flex',gap:16,marginBottom:24}}>
          <button type="button" className="button-main" style={{background:like===true?'#23c483':'#fff',color:like===true?'#fff':'#2d7a46',border:like===true?'2px solid #23c483':'2px solid #eee'}} onClick={()=>setLike(true)}>
            <span style={{fontSize:'1.5rem',marginRight:8}}>👍</span> Like it
          </button>
          <button type="button" className="button-main" style={{background:like===false?'#ff1e56':'#fff',color:like===false?'#fff':'#2d7a46',border:like===false?'2px solid #ff1e56':'2px solid #eee'}} onClick={()=>setLike(false)}>
            <span style={{fontSize:'1.5rem',marginRight:8}}>👎</span> Not For Me
          </button>
        </div>
        <input type="text" placeholder="Leave a comment..." value={comment} onChange={e=>setComment(e.target.value)} style={{marginBottom:24}} />
        <button className="button-main" type="submit" style={{width:180,margin:'0 auto',display:'block'}}>Submit</button>
      </form>
    </div>
  );
}
