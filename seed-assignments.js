
const db = require("./database");

const assignments = [
  {
    mechanic_id: 1,
    bay_id: 1,
    job_description: "Engine repair"
  },
  {
    mechanic_id: 2,
    bay_id: 2,
    job_description: "Car electrical repair"
  },
  {
    mechanic_id: 3,
    bay_id: 3,
    job_description: "General vehicle service"
  },
  {
    mechanic_id: 4,
    bay_id: 4,
    job_description: "Brake inspection and repair"
  },
  {
    mechanic_id: 5,
    bay_id: 5,
    job_description: "Car AC repair"
  },
  {
    mechanic_id: 6,
    bay_id: 6,
    job_description: "Transmission repair"
  },
  {
    mechanic_id: 7,
    bay_id: 7,
    job_description: "Wheel alignment"
  }
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seedAssignments() {
  try {
    await run("BEGIN TRANSACTION");

    for (const item of assignments) {
      await run(
        `INSERT INTO assignments
        (mechanic_id, bay_id, job_description, status)
        VALUES (?, ?, ?, ?)`,
        [
          item.mechanic_id,
          item.bay_id,
          item.job_description,
          "pending"
        ]
      );
    }

    await run("COMMIT");

    console.log("7 assignments inserted successfully!");

    db.all(
      "SELECT * FROM assignments ORDER BY id",
      [],
      (err, rows) => {
        if (err) console.error(err.message);
        else console.table(rows);

        db.close();
      }
    );

  } catch (error) {
    await run("ROLLBACK").catch(() => {});
    console.error("Error:", error.message);
    db.close();
  }
}

seedAssignments();
