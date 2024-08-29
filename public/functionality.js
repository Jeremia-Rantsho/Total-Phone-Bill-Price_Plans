document.addEventListener('alpine:init', () => {
    Alpine.data('pricePlanManager', () => ({
        pricePlans: [],
        total: 0,
        selectedPlan: '',
        newPlan: {
            plan_name: '',
            call_price: 0,
            sms_price: 0
        },
        editPlan: {
            plan_name: '',
            call_price: 0,
            sms_price: 0
        },
        actions: '',
        async totalPhoneBill(actions) {
            let total = 0;
            await this.getPricePlans();
            const actionsArray = actions.split(',').map(action => action.trim());
            const plan = this.pricePlans.find(p => p.plan_name === this.selectedPlan);

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
            this.total = total;

            return `R${this.total.toFixed(2)}`;
        },
        async getPricePlans() {
            try {
                const response = await fetch('/api/price_plans');
                const data = await response.json();
                this.pricePlans = data.price_plans;
            } catch (error) {
                console.error("Ooops!!! fetching data has failed in the process.", error);
            }
        },
        async createPricePlan() {
            try {
                const response = await fetch('/api/price_plan/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newPlan)
                });

                if (response.ok) {
                    await this.getPricePlans();
                    this.newPlan = { plan_name: '', call_price: 0, sms_price: 0 };
                } else {
                    console.error("Price plan creation failed!!!", await response.text());
                }
            } catch (error) {
                console.error("Error while creating the price plan:", error);
            }
        },
        async updatePricePlan() {
            const response = await fetch('/api/price_plan/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.editPlan)
            });
            console.log('Rows updated:', this.changes);
            if (response.ok) {
                this.getPricePlans();
                this.editPlan = { plan_name: '', call_price: 0, sms_price: 0 };
            }
            else {
                console.error('Process of updating the price plan failed');
            }
        },

        async deletePricePlan(id) {
            try {
                const response = await fetch('/api/price_plan/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                });

                if (response.ok) {
                    await this.getPricePlans();
                } else {
                    console.error("The operation of deleting the price plan failed. Try again...", await response.text());
                }
            } catch (error) {
                console.error("Error occured while deleting the price plan.", error);
            }
        },
        init() {
            this.getPricePlans();
        }
    }));
});
