document.addEventListener('alpine:init', () => {
    Alpine.data('pricePlanManager', () => ({
        pricePlans: [],
        total: 0,
        selectedPlan: '',
        editMode: null,
        maximumPlan: 0,
        minimumPlan: 0,
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
        async getMaximumPlan() {
            let max = 0;

            await this.getPricePlans();

            this.pricePlans.forEach(plan => {
                if (plan.total_value > max) {
                    max = plan.total_value;
                }
            });

            this.maximumPlan = max;
        },
        async getMinimumPlan() {
            let min = Infinity;

            await this.getPricePlans();

            this.pricePlans.forEach(plan => {
                if (plan.total_value < min) {
                    min = plan.total_value;
                }
            });

            this.minimumPlan = min;
        },
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
                const response = await fetch('http://localhost:3050/api/price_plans');
                const data = await response.json();
                this.pricePlans = data.price_plans;
            } catch (error) {
                console.error("Ooops!!! fetching data has failed in the process.", error);
            }
        },
        async createPricePlan() {
            try {
                const response = await fetch('http://localhost:3050/api/price_plan/create', {
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
            const response = await fetch('http://localhost:3050/api/price_plan/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.editPlan)
            });
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
                const response = await fetch('http://localhost:3050/api/price_plan/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                });

                if (response.ok) {
                    await this.getPricePlans();
                    this.pricePlans = this.pricePlans.filter(plan => plan.id !== id);
                } else {
                    console.error("The operation of deleting the price plan failed. Try again...", await response.text());
                }
            } catch (error) {
                console.error("Error occured while deleting the price plan.", error);
            }
        },
        confirmDeletion(id) {
            if (confirm('Are you sure you want to delete this price plan?')) {
                this.deletePricePlan(id);
            }
        },
        savePricePlan(plan) {
            const index = this.pricePlans.findIndex(p => p.id === plan.id);
            if (index !== -1) {
                this.pricePlans[index] = { ...plan };
            }
            this.editMode = null;
        },

        confirmUpdate(plan) {
            if (confirm('Are you sure you want to update this price plan?')) {
                this.savePricePlan(plan);
            }
        },
        init() {
            this.getPricePlans();
        }
    }));
});
