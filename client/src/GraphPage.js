// GraphPage.js
import React, { useEffect, useRef } from 'react';
import NeoVis from 'neovis.js';

const GraphPage = ({ query, neo4jConfig }) => {
  const visRef = useRef(null);

  useEffect(() => {
    if (visRef.current) {
      const neo4jVis = new NeoVis({
        container_id: visRef.current,
        server_url: "neo4j+s://980a96ac.databases.neo4j.io",
        server_user: "neo4j",
        server_password: "uU9BoxwwUl5FIRU9c48nXhxjM5yVwjkmyc_AeMqnHNY",
        database: neo4jConfig.database,
        initial_cypher: query,
      });

      neo4jVis.render();
    }
  }, [query, neo4jConfig]);

  return <div ref={visRef} style={{ width: '100%', height: '600px' }} />;
};

export default GraphPage;
