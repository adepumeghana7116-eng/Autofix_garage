
const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -------------------- DATABASE PROMISE WRAPPERS --------------------

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) =>
      err ? reject(err) : resolve(row)
    );
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// -------------------- HELPER FUNCTIONS --------------------

function isValidText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function handleError(res, error) {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}

// -------------------- HOME --------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "AutoFix Garage API is running"
  });
});

// -------------------- MECHANICS: CRUD --------------------

// GET all mechanics
app.get("/mechanics", async (req, res) => {
  try {
    res.status(200).json(
      await all("SELECT * FROM mechanics ORDER BY id")
    );
  } catch (err) {
    handleError(res, err);
  }
});

// GET mechanic by ID
app.get("/mechanics/:id", async (req, res) => {
  try {
    const mechanic = await get(
      "SELECT * FROM mechanics WHERE id = ?",
      [req.params.id]
    );

    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" });
    }

    res.status(200).json(mechanic);
  } catch (err) {
    handleError(res, err);
  }
});

// CREATE mechanic
app.post("/mechanics", async (req, res) => {
  const { name, specialization } = req.body;

  if (!isValidText(name) || !isValidText(specialization)) {
    return res.status(400).json({
      error: "Name and specialization are required"
    });
  }

  try {
    const result = await run(
      "INSERT INTO mechanics (name, specialization) VALUES (?, ?)",
      [name.trim(), specialization.trim()]
    );

    res.status(201).json({
      id: result.id,
      name: name.trim(),
      specialization: specialization.trim()
    });
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE mechanic
app.put("/mechanics/:id", async (req, res) => {
  const { name, specialization } = req.body;

  if (!isValidText(name) || !isValidText(specialization)) {
    return res.status(400).json({
      error: "Name and specialization are required"
    });
  }

  try {
    const existing = await get(
      "SELECT * FROM mechanics WHERE id = ?",
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: "Mechanic not found"
      });
    }

    await run(
      "UPDATE mechanics SET name = ?, specialization = ? WHERE id = ?",
      [name.trim(), specialization.trim(), req.params.id]
    );

    res.status(200).json({
      id: Number(req.params.id),
      name: name.trim(),
      specialization: specialization.trim()
    });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE mechanic
app.delete("/mechanics/:id", async (req, res) => {
  try {
    const existing = await get(
      "SELECT * FROM mechanics WHERE id = ?",
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        error: "Mechanic not found"
      });
    }

    await run(
      "DELETE FROM mechanics WHERE id = ?",
      [req.params.id]
    );

    res.status(200).json({
      message: "Mechanic deleted successfully"
    });
  } catch (err) {
    if (String(err.message).includes("FOREIGN KEY")) {
      return res.status(409).json({
        error: "Cannot delete a mechanic who has assignments"
      });
    }

    handleError(res, err);
  }
});

// -------------------- BAYS: CRUD + SEARCH --------------------

// GET all bays / search bays by vehicle
app.get("/bays", async (req, res) => {
  try {
    const { vehicle } = req.query;

    let sql = "SELECT * FROM bays";
    const params = [];

    if (vehicle) {
      sql += " WHERE vehicle LIKE ?";
      params.push(`%${vehicle}%`);
    }

    sql += " ORDER BY id";

    res.status(200).json(await all(sql, params));
  } catch (err) {
    handleError(res, err);
  }
});

// GET bay by ID
app.get("/bays/:id", async (req, res) => {
  try {
    const bay = await get(
      "SELECT * FROM bays WHERE id = ?",
      [req.params.id]
    );

    if (!bay) {
      return res.status(404).json({ error: "Bay not found" });
    }

    res.status(200).json(bay);
  } catch (err) {
    handleError(res, err);
  }
});

// CREATE bay
app.post("/bays", async (req, res) => {
  const { name, vehicle } = req.body;

  if (!isValidText(name) || !isValidText(vehicle)) {
    return res.status(400).json({
      error: "Bay name and vehicle are required"
    });
  }

  try {
    const result = await run(
      "INSERT INTO bays (name, vehicle) VALUES (?, ?)",
      [name.trim(), vehicle.trim()]
    );

    res.status(201).json({
      id: result.id,
      name: name.trim(),
      vehicle: vehicle.trim()
    });
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE bay
app.put("/bays/:id", async (req, res) => {
  const { name, vehicle } = req.body;

  if (!isValidText(name) || !isValidText(vehicle)) {
    return res.status(400).json({
      error: "Bay name and vehicle are required"
    });
  }

  try {
    const existing = await get(
      "SELECT * FROM bays WHERE id = ?",
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: "Bay not found" });
    }

    await run(
      "UPDATE bays SET name = ?, vehicle = ? WHERE id = ?",
      [name.trim(), vehicle.trim(), req.params.id]
    );

    res.status(200).json({
      id: Number(req.params.id),
      name: name.trim(),
      vehicle: vehicle.trim()
    });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE bay
app.delete("/bays/:id", async (req, res) => {
  try {
    const existing = await get(
      "SELECT * FROM bays WHERE id = ?",
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({ error: "Bay not found" });
    }

    await run(
      "DELETE FROM bays WHERE id = ?",
      [req.params.id]
    );

    res.status(200).json({
      message: "Bay deleted successfully"
    });
  } catch (err) {
    if (String(err.message).includes("FOREIGN KEY")) {
      return res.status(409).json({
        error: "Cannot delete a bay that has assignments"
      });
    }

    handleError(res, err);
  }
});

// -------------------- ASSIGNMENTS + JOIN --------------------

// GET all assignments with mechanic and bay details
app.get("/assignments", async (req, res) => {
  try {
    const rows = await all(`
      SELECT assignments.id, assignments.job_description, assignments.status,
             assignments.created_at,
             mechanics.name AS mechanic_name,
             bays.name AS bay_name,
             mechanics.id AS mechanic_id,
             bays.id AS bay_id
      FROM assignments
      JOIN mechanics ON assignments.mechanic_id = mechanics.id
      JOIN bays ON assignments.bay_id = bays.id
      ORDER BY assignments.id
    `);

    res.status(200).json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

// CREATE assignment
app.post("/assignments", async (req, res) => {
  const { mechanic_id, bay_id, job_description } = req.body;

  if (
    !Number.isInteger(mechanic_id) ||
    !Number.isInteger(bay_id) ||
    !isValidText(job_description)
  ) {
    return res.status(400).json({
      error: "mechanic_id and bay_id must be integers, and job_description is required"
    });
  }

  try {
    const mechanic = await get(
      "SELECT id FROM mechanics WHERE id = ?",
      [mechanic_id]
    );

    if (!mechanic) {
      return res.status(400).json({
        error: "Mechanic does not exist"
      });
    }

    const bay = await get(
      "SELECT id FROM bays WHERE id = ?",
      [bay_id]
    );

    if (!bay) {
      return res.status(400).json({
        error: "Bay does not exist"
      });
    }

    const result = await run(
      `INSERT INTO assignments (mechanic_id, bay_id, job_description, status)
       VALUES (?, ?, ?, 'pending')`,
      [mechanic_id, bay_id, job_description.trim()]
    );

    res.status(201).json({
      id: result.id,
      mechanic_id,
      bay_id,
      job_description: job_description.trim(),
      status: "pending"
    });
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE assignment status: pending -> approved -> done
app.patch("/assignments/:id/status", async (req, res) => {
  const { status } = req.body;

  const allowedNext = {
    pending: "approved",
    approved: "done"
  };

  try {
    const assignment = await get(
      "SELECT id, status FROM assignments WHERE id = ?",
      [req.params.id]
    );

    if (!assignment) {
      return res.status(404).json({
        error: "Assignment not found"
      });
    }

    if (allowedNext[assignment.status] !== status) {
      return res.status(400).json({
        error: "Invalid status change"
      });
    }

    await run(
      "UPDATE assignments SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    res.status(200).json({
      id: assignment.id,
      status
    });
  } catch (err) {
    handleError(res, err);
  }
});

// -------------------- INVALID JSON HANDLER --------------------

app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      error: "Invalid JSON request body"
    });
  }

  next(err);
});

// -------------------- START SERVER --------------------

app.listen(PORT, () => {
  console.log(
    `AutoFix Garage API running at http://localhost:${PORT}`
  );
});
