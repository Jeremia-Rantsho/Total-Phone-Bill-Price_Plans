export default async function totalPhoneBill(actions, pricePlans, selectedPlan, getPricePlans) {
    let total = 0;
    await getPricePlans();
    const actionsArray = actions.split(',').map(action => action.trim());
    const plan = pricePlans.find(p => p.plan_name === selectedPlan);

    if (!plan) {
        console.error('We could not find the plan you selected to perform calculation from. Try another...');
        return;
    }
    actionsArray.forEach(action => {
        if (action.toLowerCase() === 'call') {
            total += plan.call_price;
        } else if (action.toLowerCase() === 'sms') {
            total += plan.sms_price;
        }
    });
    total = total.toFixed(2);

    return `R${total}`;
}
