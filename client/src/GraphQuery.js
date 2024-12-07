import React, { useState } from 'react';
import axios from 'axios';

const GraphQuery = ({ apiEndpoint = 'http://localhost:5001/api/run-cypher', neo4jConfig }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(apiEndpoint, { query });
      setResult(response.data);
    } catch (error) {
      console.error('Error executing Cypher query:', error);
    }
  };

  const handleVisualizeClick = () => {
    // Ensure neo4jConfig is defined
    if (!neo4jConfig) {
      console.error('Neo4j configuration is not defined');
      return;
    }
  
    // Construct the URL for the new window
    const graphUrl = new URL('/d3graph.html', window.location.origin);
    graphUrl.searchParams.append('url', neo4jConfig.url);
    graphUrl.searchParams.append('username', neo4jConfig.username);
    graphUrl.searchParams.append('password', neo4jConfig.password);
    graphUrl.searchParams.append('query', query);
  
    // Open the graph visualization in a new window
    window.open(graphUrl.toString(), '_blank', 'width=800,height=600');
  };
  

  const renderResult = () => {
    if (result.length === 0) return <p>No Results to Display</p>;

    return result.map((record, index) => (
      <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        {Object.keys(record).map((key, i) => {
          const value = record[key];
          return (
            <div key={i}>
              <strong>{key}:</strong> {renderValue(value)}
            </div>
          );
        })}
      </div>
    ));
  };

  const renderValue = (value) => {
    if (value.labels) {
      return (
        <div>
          <strong>Node Labels:</strong> {value.labels.join(', ')}
          <br />
          <strong>Properties:</strong> {JSON.stringify(value.properties, null, 2)}
        </div>
      );
    } else if (value.type) {
      return (
        <div>
          <strong>Relationship Type:</strong> {value.type}
          <br />
          <strong>Properties:</strong> {JSON.stringify(value.properties, null, 2)}
        </div>
      );
    } else if (value.segments) {
      return (
        <div>
          <strong>Path:</strong>
          {value.segments.map((segment, index) => (
            <div key={index}>
              <em>Start Node:</em> {JSON.stringify(segment.start.properties, null, 2)} <br />
              <em>Relationship:</em> {segment.relationship.type} <br />
              <em>End Node:</em> {JSON.stringify(segment.end.properties, null, 2)} <br />
            </div>
          ))}
        </div>
      );
    } else {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Neo4j Graph Query Interface</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Cypher Query:
          <textarea
            style={{ width: '100%', height: '100px' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="MATCH (n) RETURN n LIMIT 10"
          />
        </label>
        <br />
        <button type="submit">Run Query</button>
        <button type="button" onClick={handleVisualizeClick}>
          Visualize Graph
        </button>
      </form>

      {/* Display Query Results */}
      <h2>Results:</h2>
      {renderResult()}
    </div>
  );
};

export default GraphQuery;










// import React, { useState } from 'react';
// import axios from 'axios';

// const GraphQuery = ({ apiEndpoint = 'http://localhost:5001/api/run-cypher' }) => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState([]);

//   // Function to handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(apiEndpoint, { query });
//       setResult(response.data);
//     } catch (error) {
//       console.error('Error executing Cypher query:', error);
//     }
//   };

//   const renderResult = () => {
//     if (result.length === 0) return <p >No Results to Display</p>;

//     return result.map((record, index) => (
//       <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
//         {Object.keys(record).map((key, i) => {
//           const value = record[key];
//           return (
//             <div key={i}>
//               <strong>{key}:</strong> {renderValue(value)}
//             </div>
//           );
//         })}
//       </div>
//     ));
//   };

//   const renderValue = (value) => {
//     if (value.labels) {
//       return (
//         <div>
//           <strong>Node Labels:</strong> {value.labels.join(', ')}
//           <br />
//           <strong>Properties:</strong> {JSON.stringify(value.properties, null, 2)}
//         </div>
//       );
//     } else if (value.type) {
//       return (
//         <div>
//           <strong>Relationship Type:</strong> {value.type}
//           <br />
//           <strong>Properties:</strong> {JSON.stringify(value.properties, null, 2)}
//         </div>
//       );
//     } else if (value.segments) {
//       return (
//         <div>
//           <strong>Path:</strong>
//           {value.segments.map((segment, index) => (
//             <div key={index}>
//               <em>Start Node:</em> {JSON.stringify(segment.start.properties, null, 2)} <br />
//               <em>Relationship:</em> {segment.relationship.type} <br />
//               <em>End Node:</em> {JSON.stringify(segment.end.properties, null, 2)} <br />
//             </div>
//           ))}
//         </div>
//       );
//     } else {
//       return <pre>{JSON.stringify(value, null, 2)}</pre>;
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Neo4j Graph Query Interface</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Enter Cypher Query:
//           <textarea
//             style={{ width: '100%', height: '100px' }}
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="MATCH (n) RETURN n LIMIT 10"
//           />
//         </label>
//         <br />
//         <button type="submit">Run Query</button>
//         <button type="button" onClick={handleVisualizeClick}>
//           Visualize Graph
//         </button>
//       </form>

//       {/* Display Query Results */}
//       <h2>Results:</h2>
//       {renderResult()}
//     </div>
//   );
// };

// export default GraphQuery;