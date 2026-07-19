import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addWater, getDashboard, removeWater, saveMealLog } from '../api/apiClient';
export default function DashboardPage() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('nourishpath_demo_user');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try { setData(await getDashboard(username)); } catch (e) { setError(e.message); }
  }

  useEffect(() => {
    if (!username) navigate('/');
    else load();
  }, [username]);

  async function toggle(mealType, completed) {
    try {
      await saveMealLog(username, { mealPlanId: data.plan._id, mealType, status: completed ? 'planned' : 'completed' });
      load();
    } catch (e) { setError(e.message); }
  }

  async function water() {
    try { await addWater(username, 250); load(); } catch (e) { setError(e.message); }
  }

  async function removeWaterEntry() {
    try { await removeWater(username); load(); } catch (e) { setError(e.message); }
  }

  if (!data) return <main className="grid min-h-screen place-items-center bg-leaf-50">Loading dashboard…</main>;

  return <main className="min-h-screen bg-leaf-50 px-5 py-8 text-slate-900">
    <section className="mx-auto max-w-4xl">
      <Link className="text-sm font-medium text-leaf-700" to="/meal-plan">← Today’s meal plan</Link>
      <h1 className="mt-5 text-3xl font-bold">Your daily dashboard</h1>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Meal adherence</p>
          <p className="mt-1 text-3xl font-bold">{data.adherencePercent}%</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Water</p>
          <p className="mt-1 text-3xl font-bold">{data.waterIntakeMl} / {data.waterGoalMl} ml</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-leaf-700 px-3 py-2 text-sm font-semibold text-white" onClick={water}>+ 250 ml</button>
            <button className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={removeWaterEntry}>− 250 ml</button>
          </div>
        </div>
      </div>
      {data.plan ? <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Today’s meals</h2>
        <div className="mt-4 space-y-3">
          {data.plan.meals.map((meal) => {
            const completed = data.mealLogs.some((log) => log.mealType === meal.mealType && log.status === 'completed');
            return <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4" key={meal.mealType}>
              <div><p className="font-semibold capitalize">{meal.mealType}</p><p className="text-sm text-slate-600">{meal.name}</p></div>
              <button className={`rounded-lg px-3 py-2 text-sm font-semibold ${completed ? 'bg-leaf-700 text-white' : 'border border-leaf-700 text-leaf-700'}`} onClick={() => toggle(meal.mealType, completed)}>{completed ? 'Completed' : 'Mark complete'}</button>
            </div>;
          })}
        </div>
      </div> : <p className="mt-6 rounded-xl bg-white p-5">Generate a meal plan to start tracking.</p>}
    </section>
  </main>;
}
