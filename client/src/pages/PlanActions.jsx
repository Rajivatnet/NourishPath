import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getTodayMealPlan } from '../api/apiClient';
import { sharePlan } from '../planSharing';

export default function PlanActions() {
  const username = sessionStorage.getItem('nourishpath_demo_user');
  const [notice, setNotice] = useState('');
  const [actionTarget, setActionTarget] = useState(null);

  useEffect(() => {
    let observer;
    function findActionTarget() {
      const groceryLink = document.querySelector('a[href="/grocery-list"]');
      if (groceryLink?.parentElement) {
        setActionTarget(groceryLink.parentElement);
        observer?.disconnect();
      }
    }

    observer = new MutationObserver(findActionTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    findActionTarget();
    return () => observer.disconnect();
  }, []);

  async function handleShare() {
    try {
      const { plan } = await getTodayMealPlan(username);
      setNotice(await sharePlan(plan));
    } catch (error) {
      if (error.name !== 'AbortError') setNotice(error.message || 'Unable to share the plan. Please try again.');
    }
  }

  const controls = <><button className="rounded-xl bg-leaf-700 px-4 py-3 font-semibold text-white" onClick={() => window.print()}>Print</button><button className="rounded-xl bg-leaf-700 px-4 py-3 font-semibold text-white" onClick={handleShare}>Share</button></>;

  return <>{actionTarget && createPortal(controls, actionTarget)}{notice && <p className="no-print fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">{notice}</p>}</>;
}
