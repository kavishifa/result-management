const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const filePath = __dirname + '/results.json'; // JSON file path

// GET all results
app.get("/results", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    res.json(JSON.parse(data || '[]'));
  });
});

// POST add new result
app.post("/add", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const results = JSON.parse(data || '[]');
    results.push(req.body);

    fs.writeFile(filePath, JSON.stringify(results, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.send("Result added");
    });
  });
});

// PUT - Edit result
app.put("/edit/:registerNumber", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const results = JSON.parse(data || '[]');
    const index = results.findIndex(r => r.registerNumber === req.params.registerNumber);
    if (index === -1) return res.status(404).send("Result not found");

    results[index] = req.body; // update with new data

    fs.writeFile(filePath, JSON.stringify(results, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.send("Result updated");
    });
  });
});

// DELETE - Remove result
app.delete("/delete/:registerNumber", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    let results = JSON.parse(data || '[]');
    results = results.filter(r => r.registerNumber !== req.params.registerNumber);

    fs.writeFile(filePath, JSON.stringify(results, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.send("Result deleted");
    });
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend Working!");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
