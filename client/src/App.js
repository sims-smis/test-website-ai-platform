import React from 'react';
import './App.css';
import GraphQuery from './GraphQuery';

const neo4jConfig = {
  url: 'neo4j+s://980a96ac.databases.neo4j.io', // Connection URL
  username: 'neo4j', // Your Neo4j username
  password: 'uU9BoxwwUl5FIRU9c48nXhxjM5yVwjkmyc_AeMqnHNY', // Your Neo4j password
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GraphQuery neo4jConfig={neo4jConfig} />
      </header>
    </div>
  );
}

export default App;
