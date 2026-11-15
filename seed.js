
const db = require("./database");

const mechanics = [
  { id: 1, name: "Ravi Kumar", specialization: "Engine Repair" },
  { id: 2, name: "Arjun", specialization: "Car Electrical" },
  { id: 3, name: "Rahul", specialization: "General Service" },
  { id: 4, name: "Suresh", specialization: "Brake Repair" },
  { id: 5, name: "Kiran", specialization: "AC Repair" },
  { id: 6, name: "Vikram", specialization: "Transmission Repair" },
  { id: 7, name: "Ajay", specialization: "Wheel Alignment" }
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function insertMechanics() {
  try {
    await run("BEGIN TRANSACTION");

    // Delete existing mechanics
    await run("DELETE FROM mechanics");

    // Reset the auto-increment sequence
    await run(
      "DELETE FROM sqlite_sequence WHERE name = 'mechanics'"
    );

    // Insert all 7 mechanics
    for (const mechanic of mechanics) {
      await run(
        `INSERT INTO mechanics (id, name, specialization)
         VALUES (?, ?, ?)`,
        [mechanic.id, mechanic.name, mechanic.specialization]
      );
    }

    await run("COMMIT");

    console.log("7 mechanics inserted successfully!");

    db.all("SELECT * FROM mechanics ORDER BY id", [], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.table(rows);
      }

      db.close();
    });

  } catch (error) {
    await run("ROLLBACK").catch(() => {});
    console.error("Insertion failed:", error.message);
    db.close();
  }
}

insertMechanics();
