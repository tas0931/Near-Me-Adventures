import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function countWords(s) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export default function Recommendation() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState('');
  const [budget, setBudget] = useState('medium');
  const [environment, setEnvironment] = useState('nature');
  const [pace, setPace] = useState('moderate');
  const [foodInterest, setFoodInterest] = useState('spicy');
  const [crowd, setCrowd] = useState('moderate');
  const [result, setResult] = useState(null);

  function classify(inputs) {
    const { activities, budget, environment, pace, foodInterest, crowd } = inputs;
    const a = activities.toLowerCase();
    const act = a.split(/[,;|\/]+/).map(x => x.trim()).filter(Boolean);

    const scores = {
      'Adventurous Traveler': 0,
      'Scenic Lover': 0,
      'Foodie Traveler': 0,
      'Heritage & Culture Lover': 0,
      'Quiet & Relaxation Seeker': 0,
      'Budget Traveler': 0,
      'Luxury Traveler': 0,
    };

    const contains = (arr, keywords) => arr.some(it => keywords.some(k => it.includes(k)));

    const advK = ['hike','trek','climb','raft','surf','dive','ski','bungee','zip','camp','adventure','trail','explore'];
    const scenicK = ['scenic','view','waterfall','lake','mountain','beach','sunset','sunrise','landscape','valley','river'];
    const foodK = ['food','dine','restaurant','cuisine','street','tasting','foodie','eat'];
    const heritageK = ['museum','history','historic','temple','culture','heritage','monument','ruins','church','palace'];
    const relaxK = ['spa','relax','yoga','retreat','calm','quiet','massage','resort'];

    if (contains(act, advK) || pace === 'fast') scores['Adventurous Traveler'] += 3;
    if (contains(act, scenicK) || ['beach','mountain','nature'].includes(environment)) scores['Scenic Lover'] += 3;
    if (contains(act, foodK)) scores['Foodie Traveler'] += 3;
    if (contains(act, heritageK) || ['city','historic','urban'].includes(environment)) scores['Heritage & Culture Lover'] += 3;
    if (contains(act, relaxK) || pace === 'relaxed' || crowd === 'avoid') scores['Quiet & Relaxation Seeker'] += 3;

    if (budget === 'low') scores['Budget Traveler'] += 4;
    if (budget === 'high') scores['Luxury Traveler'] += 4;

    // food preference signals (spicy / sweet / refreshing)
    if (foodInterest === 'spicy') {
      scores['Foodie Traveler'] += 3;
      scores['Adventurous Traveler'] += 1;
    }
    if (foodInterest === 'sweet') {
      scores['Foodie Traveler'] += 2;
      scores['Scenic Lover'] += 1;
    }
    if (foodInterest === 'refreshing') {
      scores['Quiet & Relaxation Seeker'] += 2;
      scores['Scenic Lover'] += 1;
    }

    if (crowd === 'love') scores['Foodie Traveler'] += 1;
    if (pace === 'moderate') scores['Scenic Lover'] += 1;
    if (environment === 'beach') { scores['Scenic Lover'] += 1; scores['Quiet & Relaxation Seeker'] += 1; }

    // ensure distinct primary and secondary
    const sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
    let primary = sorted[0][0];
    let secondary = sorted.find(([k]) => k !== primary)[0];

    // if scores tie or secondary feels incompatible, pick next best
    if (!secondary) secondary = Object.keys(scores).find(k => k !== primary) || primary;

    // Build a short motivational explanation under 80 words
    const templates = {
      'Adventurous Traveler': `You're an Adventurous Traveler who seeks thrills and new challenges. Pairing adventure with`,
      'Scenic Lover': `You're a Scenic Lover who treasures beautiful views and calm moments. Pairing scenery with`,
      'Foodie Traveler': `You're a Foodie Traveler who delights in local flavors and culinary discoveries. Pairing food with`,
      'Heritage & Culture Lover': `You're a Heritage & Culture Lover who enjoys history and local traditions. Pairing culture with`,
      'Quiet & Relaxation Seeker': `You're a Quiet & Relaxation Seeker who values peace and recharge time. Pairing relaxation with`,
      'Budget Traveler': `You're a Budget Traveler who loves smart, wallet-friendly adventures. Pairing budget-savvy choices with`,
      'Luxury Traveler': `You're a Luxury Traveler who prefers comfort and premium experiences. Pairing luxury with`,
    };

    let explanation = `${templates[primary]} ${secondary.toLowerCase()}. Go plan an adventure that fits your style — you deserve it!`;

    // enforce < 80 words
    if (countWords(explanation) > 80) {
      const words = explanation.split(/\s+/).slice(0,80).join(' ');
      explanation = words + '...';
    }

    return { primary, secondary, explanation };
  }

  function onSubmit(e) {
    e.preventDefault();
    const res = classify({ activities, budget, environment, pace, foodInterest, crowd });
    setResult(res);
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Recommendation For you!!</h2></div>
      <p>Fill in your travel preferences below to get a personalized adventure recommendation.</p>
      <div style={{ marginTop: 8, marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate('/home')}
            style={{ padding: '6px 10px', fontSize: 20, lineHeight: 1, borderRadius: 4 }}
          >
            Back
          </button>
          <button
            onClick={() => navigate('/all-places')}
            style={{ padding: '6px 10px', fontSize: 20, lineHeight: 1, borderRadius: 4 }}
          >
            Browse
          </button>
        </div>
      </div>
      <form className="form" onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <label>Preferred activities (comma separated)</label>
        <input
          value={activities}
          onChange={e => setActivities(e.target.value)}
          placeholder="e.g. hiking, food tasting, museum"
          style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}
        />

        <label>Budget level</label>
        <select value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Preferred environment</label>
        <select value={environment} onChange={e => setEnvironment(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}>
          <option value="nature">Nature</option>
          <option value="mountain">Mountain</option>
          <option value="beach">Beach</option>
          <option value="city">City</option>
          <option value="rural">Rural</option>
        </select>

        <label>Travel pace</label>
        <select value={pace} onChange={e => setPace(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}>
          <option value="relaxed">Relaxed</option>
          <option value="moderate">Moderate</option>
          <option value="fast">Fast</option>
        </select>

        <label>Food interest level</label>
        <select value={foodInterest} onChange={e => setFoodInterest(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}>
          <option value="spicy">Spicy</option>
          <option value="sweet">Sweet</option>
          <option value="refreshing">Refreshing</option>
        </select>

        <label>Crowd preference</label>
        <select value={crowd} onChange={e => setCrowd(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 12 }}>
          <option value="avoid">Avoid crowds</option>
          <option value="calm">Calm / small groups</option>
          <option value="moderate">Moderate</option>
          <option value="love">Love crowds</option>
        </select>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Get Recommendation</button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 20 }} className="card">
          <h3>Primary Type: {result.primary}</h3>
          <h3>Secondary Type: {result.secondary}</h3>
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
