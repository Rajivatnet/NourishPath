import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { acknowledgeDisclaimer, getProfile, saveProfile } from '../api/apiClient';

const initialProfile = { age: '', gender: 'prefer_not_to_say', heightCm: '', weightKg: '', activityLevel: 'light', goal: 'weight_loss', diet: 'vegetarian', allergies: '', medicalCondition: 'diabetes', budgetLevel: 'medium', cookingTime: '15_to_30', preferredCuisine: 'Indian' };
const steps = ['About you', 'Food preferences', 'Your routine'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('nourishpath_demo_user');
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  useEffect(() => {
    if (!username) { navigate('/'); return; }
    getProfile(username).then(({ profile: saved }) => setProfile({ ...saved, allergies: saved.allergies.join(', ') })).catch((requestError) => { if (!requestError.message.includes('not found')) setError(requestError.message); });
  }, [navigate, username]);

  useEffect(() => {
    function preventImplicitSubmit(event) {
      const isFormField = ['INPUT', 'SELECT'].includes(event.target.tagName);
      if (event.key === 'Enter' && isFormField && event.target.closest('form')) event.preventDefault();
    }
    document.addEventListener('keydown', preventImplicitSubmit);
    return () => document.removeEventListener('keydown', preventImplicitSubmit);
  }, []);

  function update(field, value) { setSaveConfirmed(false); setProfile((current) => ({ ...current, [field]: value })); }
  function next() {
    setError('');
    if (step === 0 && (!profile.age || !profile.heightCm || !profile.weightKg)) { setError('Please complete age, height, and weight before continuing.'); return; }
    setStep((current) => Math.min(current + 1, 2));
  }
  async function submit(event) {
    event.preventDefault();
    if (!saveConfirmed) {
      setSaveConfirmed(true);
      setStatus('Review your routine, then tap Save profile once more to generate today’s plan.');
      return;
    }
    setIsSaving(true); setError(''); setStatus('');
    try {
      const payload = { ...profile, age: Number(profile.age), heightCm: Number(profile.heightCm), weightKg: Number(profile.weightKg), allergies: profile.allergies.split(',').map((item) => item.trim()).filter(Boolean) };
      await saveProfile(username, payload);
      await acknowledgeDisclaimer(username);
      navigate('/meal-plan');
    } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  }
  const selectClass = 'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3';
  const inputClass = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-3';
  return <main className="min-h-screen bg-leaf-50 px-5 py-8 text-slate-900"><section className="mx-auto max-w-3xl"><Link className="text-sm font-medium text-leaf-700" to="/">← Change demo user</Link><div className="mt-5 rounded-3xl bg-white p-6 shadow-xl shadow-leaf-700/10 sm:p-9"><p className="font-semibold text-leaf-700">Welcome, {username}</p><h1 className="mt-2 text-3xl font-bold">Build your nutrition profile</h1><p className="mt-2 text-slate-600">We use this only to create general, diabetes-conscious nutrition guidance.</p><div className="mt-7 flex gap-2">{steps.map((label, index) => <div className="flex-1" key={label}><div className={`h-2 rounded-full ${index <= step ? 'bg-leaf-700' : 'bg-slate-200'}`} /><p className="mt-2 text-xs text-slate-500">{label}</p></div>)}</div><form className="mt-7" onSubmit={submit}>{step === 0 && <div className="grid gap-5 sm:grid-cols-2"><label>Age<input className={inputClass} min="18" max="100" type="number" value={profile.age} onChange={(e) => update('age', e.target.value)} required /></label><label>Gender<select className={selectClass} value={profile.gender} onChange={(e) => update('gender', e.target.value)}><option value="female">Female</option><option value="male">Male</option><option value="prefer_not_to_say">Prefer not to say</option></select></label><label>Height (cm)<input className={inputClass} min="100" max="250" type="number" value={profile.heightCm} onChange={(e) => update('heightCm', e.target.value)} required /></label><label>Weight (kg)<input className={inputClass} min="30" max="300" type="number" value={profile.weightKg} onChange={(e) => update('weightKg', e.target.value)} required /></label></div>}{step === 1 && <div className="grid gap-5 sm:grid-cols-2"><label>Diet<select className={selectClass} value={profile.diet} onChange={(e) => update('diet', e.target.value)}><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="eggetarian">Eggetarian</option><option value="non_veg">Non-vegetarian</option></select></label><label>Allergies (comma separated)<input className={inputClass} placeholder="e.g. peanut, milk" value={profile.allergies} onChange={(e) => update('allergies', e.target.value)} /></label><label>Health focus<select className={selectClass} value={profile.medicalCondition} onChange={(e) => update('medicalCondition', e.target.value)}><option value="diabetes">Diabetes-conscious eating</option></select></label><label>Preferred cuisine<input className={inputClass} value={profile.preferredCuisine} onChange={(e) => update('preferredCuisine', e.target.value)} required /></label></div>}{step === 2 && <div className="grid gap-5 sm:grid-cols-2"><label>Activity level<select className={selectClass} value={profile.activityLevel} onChange={(e) => update('activityLevel', e.target.value)}><option value="sedentary">Sedentary</option><option value="light">Lightly active</option><option value="moderate">Moderately active</option><option value="active">Active</option></select></label><label>Goal<select className={selectClass} value={profile.goal} onChange={(e) => update('goal', e.target.value)}><option value="weight_loss">Weight loss</option><option value="maintain">Maintain weight</option></select></label><label>Budget<select className={selectClass} value={profile.budgetLevel} onChange={(e) => update('budgetLevel', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="flexible">Flexible</option></select></label><label>Cooking time<select className={selectClass} value={profile.cookingTime} onChange={(e) => update('cookingTime', e.target.value)}><option value="under_15">Under 15 minutes</option><option value="15_to_30">15–30 minutes</option><option value="over_30">Over 30 minutes</option></select></label><div className="sm:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">NourishPath offers general nutrition guidance only. It does not diagnose, treat, cure, or prevent disease. Consult a physician or registered dietitian before changing your diet, especially with diabetes or food allergies.</div></div>}{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}{status && <p className="mt-5 rounded-xl bg-leaf-50 p-3 text-sm text-leaf-700" role="status">{status}</p>}<div className="mt-7 flex justify-between gap-3">{step > 0 ? <button className="rounded-xl border border-slate-300 px-5 py-3 font-semibold" type="button" onClick={() => setStep((current) => current - 1)}>Back</button> : <span />}{step < 2 ? <button className="rounded-xl bg-leaf-700 px-5 py-3 font-semibold text-white" type="button" onClick={next}>Continue</button> : <button className="rounded-xl bg-leaf-700 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? 'Saving…' : 'Save profile'}</button>}</div></form></div></section></main>;
}
