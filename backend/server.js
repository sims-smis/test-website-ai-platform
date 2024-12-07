const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Neo4j AuraDB connection details
const driver = neo4j.driver(
  'neo4j+s://980a96ac.databases.neo4j.io', // Replace with your AuraDB URI
  neo4j.auth.basic('neo4j', 'uU9BoxwwUl5FIRU9c48nXhxjM5yVwjkmyc_AeMqnHNY') // Replace with your AuraDB credentials
);


// Define an endpoint to handle Cypher queries
app.post('/api/run-cypher', async (req, res) => {
  const { query } = req.body;
  console.log("yoooooooooooooooooooooooooooo")
  console.log('Received query:', query);
  try {
    const session = driver.session();
    const result = await session.run(query);
    const records = result.records.map((record) => record.toObject());
    res.json(records);
    session.close();
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    res.status(500).send({error: 'Error executing query', message: error.message});
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
