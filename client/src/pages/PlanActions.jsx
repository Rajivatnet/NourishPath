import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getTodayMealPlan } from '../api/apiClient';
import { sharePlan } from '../planSharing';

export default function PlanActions() {
  const username = sessionStorage.getItem('nourishpath_demo_user');
  const [notice, setNotice] = useState('');
  const [actionTarget, setActionTarget] = useState(null);
  const [targetChecked, setTargetChecked] = useState(false);

  useEffect(() => {
    function findActionTarget() {
      const groceryLink = document.querySelector('a[href="/grocery-list"]');
      if (groceryLink?.parentElement) setActionTarget(groceryLink.parentElement);
      setTargetChecked(true);
    }

    findActionTarget();
    const retry = window.setTimeout(findActionTarget, 200);
    return () => window.clearTimeout(retry);
  }, []);

  async function handleShare() {
    try {
      const { plan } = await getTodayMealPlan(username);
      setNotice(await sharePlan(plan));
    } catch (error) {
      if (error.name !== 'AbortError') setNotice(error.message || 'Unable to share the plan. Please try again.');
    }
  }

  const controls = <><button className="rounded-xl border border-leaf-700 bg-white px-4 py-3 font-semibold text-leaf-700" onClick={() => window.print()}>Print</button><button className="rounded-xl border border-leaf-700 bg-white px-4 py-3 font-semibold text-leaf-700" onClick={handleShare}>Share</button></>;

  return <>{actionTarget && createPortal(controls, actionTarget)}{targetChecked && !actionTarget && <div className="no-print fixed right-5 top-5 z-20 flex gap-2 rounded-2xl bg-white p-2 shadow-lg">{controls}</div>}{notice && <p className="no-print fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">{notice}</p>}</>;
}
