import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
// import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3050;

app.use(express.static('public'));
app.use(express.json());

// app.use(cors({
//     origin: 'http://127.0.0.1:5500'
// }));

const db = await sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

await db.migrate();

app.get('/api/price_plans', async (req, res) => {
    try {
        const pricePlans = await db.all('SELECT *, (call_price + sms_price) AS total_value FROM price_plan ORDER BY total_value DESC');
        res.json({ price_plans: pricePlans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/price_plan/create', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)',
            [name, sms_cost, call_cost]
        );
        res.json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/price_plan/update', async (req, res) => {
    const { plan_name, call_price, sms_price } = req.body;

    if (!plan_name || sms_price === null || call_price === null) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    try {
        const result = await db.run(
            'UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?',
            [call_price, sms_price, plan_name]
        );
        if (result.changes === 0) {
            return res.status(404).json({ message: 'The plan you looking for is not found. Try again....' });
        }
        res.json({ updated: result.changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await db.run('DELETE FROM price_plan WHERE id = ?', id);
        res.json({ deleted: result.changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
