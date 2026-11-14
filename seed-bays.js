
const db = require("./database");

const bays = [
  { id: 1, name: "Bay 1", vehicle: "Car" },
  { id: 2, name: "Bay 2", vehicle: "SUV" },
  { id: 3, name: "Bay 3", vehicle: "Hatchback" },
  { id: 4, name: "Bay 4", vehicle: "Sedan" },
  { id: 5, name: "Bay 5", vehicle: "Car" },
  { id: 6, name: "Bay 6", vehicle: "SUV" },
  { id: 7, name: "Bay 7", vehicle: "Motorcycle" }
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seedBays() {
  try {
    await run("BEGIN TRANSACTION");

    await run("DELETE FROM bays");

    await run(
      "DELETE FROM sqlite_sequence WHERE name = 'bays'"
    );

    for (const bay of bays) {
      await run(
        `INSERT INTO bays (id, name, vehicle)
         VALUES (?, ?, ?)`,
        [bay.id, bay.name, bay.vehicle]
      );
    }

    await run("COMMIT");

    console.log("7 service bays inserted successfully!");

    db.all("SELECT * FROM bays ORDER BY id", [], (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.table(rows);
      }

      db.close();
    });

  } catch (error) {
    await run("ROLLBACK").catch(() => {});
    console.error("Error:", error.message);
    db.close();
  }
}

seedBays();
