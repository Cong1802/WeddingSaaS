(async () => {
  const origin = 'http://127.0.0.1:8000';
  const response = await fetch(origin+'/api/auth/login', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.com', password: process.env.ADMIN_AUDIT_PASSWORD }) });
  const auth = await response.json();
  if (!response.ok || !auth.token) throw Error('Audit login failed');
  const headers = { Authorization: 'Bearer '+auth.token, Accept: 'application/json' };
  try {
    const response = await fetch(origin+'/api/user/cards', { headers });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.cards) || data.cards.length > 1 || !Array.isArray(data.licenses)) throw Error('Live card/license API failed');
    const plans = await (await fetch(origin+'/api/public/plans')).json();
    if (plans.plans.some(plan => Number(plan.price)>0 && !plan.period.includes('6 tháng'))) throw Error('Live catalog not aligned with six-month licenses');
    console.log('PASS: real authenticated card/license API and six-month catalog; no business records changed');
  } finally { await fetch(origin+'/api/auth/logout', { method: 'POST', headers }); }
})().catch(error => { console.error(error.message); process.exitCode=1; });
