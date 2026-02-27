import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { UserContext } from './UserContext';

function StarRating({ stars }) {
  return <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>;
}

function Recipes({ token, onFeedback }) {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  // Feedback state
  const [like, setLike] = useState(null); // true = like, false = not for me
  const [comment, setComment] = useState('');
  // History & Badges from context
  const { streak, history, badges } = useContext(UserContext);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/v1/recipes/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch recipes');
        return res.json();
      })
      .then(data => setRecipes(data.results || data))
      .catch(err => setError(err.message));
  }, [token]);

  const handleRate = (e) => {
    e.preventDefault();
    if (onFeedback && selected) onFeedback({ recipeId: selected, like, comment });
    setLike(null); setComment('');
  };

  const selectedRecipe = recipes.find(r => r.id === selected);

  return (
    <div className="card" style={{position:'relative', overflow:'hidden'}}>
      {/* Playful background shapes */}
      <div style={{
        position: 'absolute',
        top: '-60px', left: '-60px',
        width: '160px', height: '160px',
        background: 'rgba(255,182,106,0.13)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', right: '-80px',
        width: '180px', height: '180px',
        background: 'rgba(106,255,122,0.10)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        zIndex: 0,
      }} />
      <div className="logo" style={{justifyContent:'flex-start', zIndex:1}}>
        <span style={{fontFamily:'Fredoka One', fontSize:'1.5rem', color:'#2d7a46'}}>Recipe Ideas</span>
      </div>
      <input className="search-bar" placeholder="Search" />
      <div style={{display:'flex', gap:'8px', marginBottom:'16px', zIndex:1, position:'relative'}}>
        <span className="badge" style={{background:'#ffb36a', color:'#fff'}}>Home</span>
        <span className="badge" style={{background:'#6aff7a', color:'#2d7a46'}}>My Recipes</span>
        <span className="badge" style={{background:'#ff6a6a', color:'#fff'}}>Badges</span>
      </div>
      {error && <div style={{color:'#ff6a6a', margin:'8px 0', zIndex:1}}>Error: {error}</div>}
      {/* History & Badges Section */}
      <div style={{maxWidth:600,margin:'40px auto',padding:'40px 32px',boxShadow:'0 16px 64px #ff1e5633, 0 2px 24px #23c48333',background:'#fff',borderRadius:24,marginBottom:32}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'2rem'}}>🍳</span>
            <h2 style={{fontFamily:'Fredoka One',color:'#2d7a46',margin:0}}>Cooking Streak</h2>
          </div>
          <span style={{fontFamily:'Fredoka One',color:'#ff1e56',fontSize:'1.3rem'}}>{streak} Days</span>
        </div>
        <hr style={{margin:'16px 0'}} />
        <div style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:12}}>Past Recipes</div>
        <div style={{marginBottom:24}}>
          {history.length === 0 ? (
            <div style={{color:'#aaa',fontFamily:'Quicksand'}}>No recipes yet.</div>
          ) : (
            history.slice(0,3).map((r,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:16,marginBottom:12}}>
                <span style={{fontSize:'2rem'}}>🍲</span>
                <span style={{fontFamily:'Quicksand',fontSize:'1.1rem',color:'#2d7a46'}}>{typeof r === 'string' ? r : (r.title || 'Recipe')}</span>
                <span style={{color:'#ffb36a',fontSize:'1.2rem'}}>★★★★★</span>
              </div>
            ))
          )}
        </div>
        <hr style={{margin:'16px 0'}} />
        <div style={{fontFamily:'Fredoka One',color:'#2d7a46',marginBottom:12}}>Badges Earned</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
          {badges.length === 0 ? (
            <div style={{color:'#aaa',fontFamily:'Quicksand'}}>No badges yet.</div>
          ) : (
            badges.map((b,i) => (
              <div key={i} className="badge" style={{display:'flex',alignItems:'center',gap:8,background:'linear-gradient(90deg,#ffb36a 0%,#23c483 100%)',color:'#fff',fontSize:'1.1rem',padding:'10px 22px',borderRadius:'20px',boxShadow:'0 2px 8px #ffb36a22'}}>
                <span style={{fontSize:'1.3rem'}}>{b.emoji}</span> {b.name}
              </div>
            ))
          )}
        </div>
      </div>
      <ul className="recipe-list" style={{zIndex:1, position:'relative'}}>
        {recipes.map(recipe => (
          <li key={recipe.id} style={{background:selected===recipe.id?'#eaf6ef':'#fff9f3', border:'2px solid #ffb36a', borderRadius:'16px', cursor:'pointer'}} onClick={()=>setSelected(recipe.id)}>
            <img className="recipe-img" src={recipe.img || 'https://img.icons8.com/color/96/chicken.png'} alt={recipe.title} />
            <span style={{fontFamily:'Fredoka One', color:'#ff6a6a', fontSize:'1.1rem', marginRight:'8px'}}>{recipe.title}</span>
            <StarRating stars={recipe.stars || 3} />
          </li>
        ))}
      </ul>
      {selectedRecipe && (
        <div style={{marginTop:'24px', background:'#fff', borderRadius:'16px', boxShadow:'0 2px 8px #ffb36a33', padding:'20px', zIndex:2, position:'relative'}}>
          {/* Recipe Card Header */}
          <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:24}}>
            <div style={{width:64,height:64,background:'#eee',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>
              {selectedRecipe.img ? <img src={selectedRecipe.img} alt="recipe" style={{width:48,height:48,borderRadius:8}} /> : <span role="img" aria-label="food">🍲</span>}
            </div>
            <div>
              <div style={{fontFamily:'Fredoka One',fontSize:'1.5rem',color:'#2d7a46'}}>{selectedRecipe.title}</div>
              <div style={{color:'#ffb36a',fontSize:'1.2rem',margin:'4px 0'}}>
                {'★'.repeat(selectedRecipe.stars || 3)}{'☆'.repeat(5-(selectedRecipe.stars || 3))}
              </div>
            </div>
          </div>
          {/* Nutrition Info */}
          <div style={{fontFamily:'Quicksand',fontSize:'1rem',color:'#444',marginBottom:8}}>
            <b>Calories:</b> {selectedRecipe.calories || 0}kcal &nbsp;|&nbsp; <b>Carbohydrates:</b> {selectedRecipe.carbs || 0}g &nbsp;|&nbsp; <b>Protein:</b> {selectedRecipe.protein || 0}g
          </div>
          {/* Tips */}
          <div style={{marginBottom:24}}>
            <div style={{fontWeight:'bold',fontFamily:'Quicksand',marginBottom:4}}>Tips:</div>
            <ul style={{margin:0,paddingLeft:20}}>
              {(selectedRecipe.tips || []).map((tip,i)=>(
                <li key={i} style={{fontFamily:'Quicksand',fontSize:'1rem',marginBottom:2}}>
                  {tip} <span role="img" aria-label="tip" style={{fontSize:'1.1rem',marginLeft:4}}>💡</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Ingredients & Steps */}
          <h3 style={{fontFamily:'Fredoka One', color:'#2d7a46', fontSize:'1.2rem'}}>Ingredients:</h3>
          <ul style={{marginBottom:'16px'}}>
            {(selectedRecipe.ingredients || []).map((ing,i)=>(<li key={i} style={{color:'#ff6a6a', fontFamily:'Quicksand'}}>{ing}</li>))}
          </ul>
          <h3 style={{fontFamily:'Fredoka One', color:'#ffb36a', fontSize:'1.2rem'}}>Steps:</h3>
          <ol>
            {(selectedRecipe.steps || []).map((step,i)=>(<li key={i} style={{color:'#2d7a46', fontFamily:'Quicksand'}}>{step}</li>))}
          </ol>
          {/* Feedback Form */}
          <form onSubmit={handleRate} style={{marginTop:32}}>
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
      )}
      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .card { padding: 18px 4vw !important; }
          .logo span { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Recipes;
