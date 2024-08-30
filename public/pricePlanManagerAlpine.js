import { getPricePlans, getPricePlans, getMaximumPlan, getMinimumPlan, totalPhoneBill } from '../public/pricePlanManager.js';

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
            this.pricePlans = await getPricePlans();
            this.maximumPlan = await getMaximumPlan(this.pricePlans);
        },

        async getMinimumPlan() {
            this.pricePlans = await getPricePlans();
            this.minimumPlan = await getMinimumPlan(this.pricePlans);
        },

        async totalPhoneBill(actions) {
            this.pricePlans = await getPricePlans();
            this.total = await totalPhoneBill(this.pricePlans, this.selectedPlan, actions);
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
                    this.pricePlans = await getPricePlans();
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
                this.pricePlans = await getPricePlans();
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
                    this.pricePlans = await getPricePlans();
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
