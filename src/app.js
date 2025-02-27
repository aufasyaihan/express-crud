const express = require("express");
const pool = require("../config/db.config");

const app = express();
app.use(express.json());

app.post("/krs", async (req, res) => {
    const { nim, kode_matakuliah, matakuliah, semester, tahunakademik } =
        req.body;
    try {
        const result = await pool.query(
            'INSERT INTO krs (nim, "kode matakuliah", matakuliah, semester, tahunakademik) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nim, kode_matakuliah, matakuliah, semester, tahunakademik]
        );
        res.status(201).json({
            meta: { code: 201, message: "Success" },
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/krs", async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT nim, "kode matakuliah", matakuliah, semester, tahunakademik FROM krs ORDER BY id_krs ASC LIMIT 350000'
        );
        res.status(200).json({
            meta: { code: 200, message: "Success" },
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/krs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM krs WHERE id_krs = $1", [
            id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            meta: { code: 200, message: "Success" },
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/krs/:id", async (req, res) => {
    const { id } = req.params;
    const { nim, kode_matakuliah, matakuliah, semester, tahunakademik } =
        req.body;
    try {
        const result = await pool.query(
            'UPDATE krs SET nim = $1, "kode matakuliah" = $2, matakuliah = $3, semester = $4, tahunakademik = $5  WHERE id_krs = $6 RETURNING *',
            [nim, kode_matakuliah, matakuliah, semester, tahunakademik, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            meta: { code: 204, message: "Success" },
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/krs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM krs WHERE id_krs = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "KRS not found" });
        }
        res.status(200).json({ code: 204, message: "Success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
