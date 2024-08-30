// import 'mutationobserver-shim';
// import { expect } from 'chai';
// import fetchMock from 'fetch-mock';
// import { JSDOM } from 'jsdom';
// import Alpine from 'alpinejs';

// let window, document;

// before(() => {
//     // Create a JSDOM environment and assign global objects before running tests
//     const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
//         url: "http://localhost:3050"
//     });

//     window = dom.window;
//     document = window.document;

//     global.window = window;
//     global.document = document;
//     global.navigator = { userAgent: 'node.js' };

//     // Ensure MutationObserver is available globally
//     global.MutationObserver = window.MutationObserver;

//     // Initialize Alpine.js in the simulated DOM environment
//     window.Alpine = Alpine;
//     Alpine.start();
// });

// describe('Price PlanManager Component', () => {
//     let pricePlanManager;

//     beforeEach(() => {
//         // Initialize pricePlanManager before each test
//         pricePlanManager = Alpine.data('pricePlanManager')();
//         pricePlanManager.init();
//     });

//     afterEach(() => {
//         // Clean up mocks after each test
//         fetchMock.restore();
//     });

//     it('should fetch price plans on initialization', async () => {
//         const mockPricePlans = [
//             { id: 1, plan_name: 'Plan 1', call_price: 1.5, sms_price: 0.5 },
//             { id: 2, plan_name: 'Plan 2', call_price: 2.0, sms_price: 1.0 }
//         ];

//         fetchMock.get('http://localhost:3050/api/price_plans', {
//             body: { price_plans: mockPricePlans },
//             headers: { 'content-type': 'application/json' }
//         });

//         await pricePlanManager.getPricePlans();

//         expect(pricePlanManager.pricePlans).to.deep.equal(mockPricePlans);
//     });

//     it('should calculate total phone bill based on selected plan and actions', async () => {
//         pricePlanManager.pricePlans = [
//             { id: 1, plan_name: 'Plan 1', call_price: 1.5, sms_price: 0.5 }
//         ];
//         pricePlanManager.selectedPlan = 'Plan 1';

//         const result = await pricePlanManager.totalPhoneBill('call, sms');

//         expect(result).to.equal('R2.00');
//     });

//     it('should create a new price plan', async () => {
//         fetchMock.post('http://localhost:3050/api/price_plan/create', {
//             status: 200
//         });

//         const mockGetPricePlans = fetchMock.get('http://localhost:3050/api/price_plans', {
//             body: { price_plans: [{ id: 1, plan_name: 'New Plan', call_price: 2.0, sms_price: 1.0 }] },
//             headers: { 'content-type': 'application/json' }
//         });

//         pricePlanManager.newPlan = { plan_name: 'New Plan', call_price: 2.0, sms_price: 1.0 };

//         await pricePlanManager.createPricePlan();

//         expect(mockGetPricePlans.called()).to.be.true;
//         expect(pricePlanManager.newPlan).to.deep.equal({ plan_name: '', call_price: 0, sms_price: 0 });
//     });

//     it('should update an existing price plan', async () => {
//         fetchMock.put('http://localhost:3050/api/price_plan/update', {
//             status: 200
//         });

//         const mockGetPricePlans = fetchMock.get('http://localhost:3050/api/price_plans', {
//             body: { price_plans: [{ id: 1, plan_name: 'Updated Plan', call_price: 2.5, sms_price: 1.5 }] },
//             headers: { 'content-type': 'application/json' }
//         });

//         pricePlanManager.editPlan = { id: 1, plan_name: 'Updated Plan', call_price: 2.5, sms_price: 1.5 };

//         await pricePlanManager.updatePricePlan();

//         expect(mockGetPricePlans.called()).to.be.true;
//         expect(pricePlanManager.editPlan).to.deep.equal({ plan_name: '', call_price: 0, sms_price: 0 });
//     });

//     it('should delete a price plan', async () => {
//         fetchMock.post('http://localhost:3050/api/price_plan/delete', {
//             status: 200
//         });

//         const mockGetPricePlans = fetchMock.get('http://localhost:3050/api/price_plans', {
//             body: { price_plans: [{ id: 2, plan_name: 'Plan 2', call_price: 2.0, sms_price: 1.0 }] },
//             headers: { 'content-type': 'application/json' }
//         });

//         global.confirm = () => true;

//         pricePlanManager.pricePlans = [
//             { id: 1, plan_name: 'Plan 1', call_price: 1.5, sms_price: 0.5 },
//             { id: 2, plan_name: 'Plan 2', call_price: 2.0, sms_price: 1.0 }
//         ];

//         await pricePlanManager.confirmDeletion(1);

//         expect(mockGetPricePlans.called()).to.be.true;
//         expect(pricePlanManager.pricePlans).to.deep.equal([{ id: 2, plan_name: 'Plan 2', call_price: 2.0, sms_price: 1.0 }]);
//     });
// });
// import { getPricePlans, getMaximumPlan, getMinimumPlan, totalPhoneBill } from '/public/pricePlanManager';

// describe('Price Plan Manager Functions', () => {
//     test('getMaximumPlan returns the correct maximum value', async () => {
//         const mockPricePlans = [
//             { id: 1, plan_name: 'Plan A', total_value: 10 },
//             { id: 2, plan_name: 'Plan B', total_value: 20 },
//             { id: 3, plan_name: 'Plan C', total_value: 15 }
//         ];

//         const max = await getMaximumPlan(mockPricePlans);
//         expect(max).toBe(20);
//     });

//     test('getMinimumPlan returns the correct minimum value', async () => {
//         const mockPricePlans = [
//             { id: 1, plan_name: 'Plan A', total_value: 10 },
//             { id: 2, plan_name: 'Plan B', total_value: 20 },
//             { id: 3, plan_name: 'Plan C', total_value: 15 }
//         ];

//         const min = await getMinimumPlan(mockPricePlans);
//         expect(min).toBe(10);
//     });

//     test('totalPhoneBill calculates total correctly', async () => {
//         const mockPricePlans = [
//             { id: 1, plan_name: 'Plan A', call_price: 2, sms_price: 1 },
//             { id: 2, plan_name: 'Plan B', call_price: 3, sms_price: 2 }
//         ];

//         const total = await totalPhoneBill(mockPricePlans, 'Plan A', 'call,sms');
//         expect(total).toBe('R3.00');
//     });

//     // Additional tests for other functions can be added similarly
// });
