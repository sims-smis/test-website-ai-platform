import React from 'react';
import './App.css';
import GraphQuery from './GraphQuery';

const neo4jConfig = {
  url: 'neo4j+s://<instance id>c.databases.neo4j.io', // Connection URL
  username: 'neo4j', // Your Neo4j username
  password: '<Password>', // Your Neo4j password
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
