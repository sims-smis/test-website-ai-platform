import json
import os
import csv
import io
import sys
import traceback
from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError
from neo4j.graph import Node, Relationship, Path
from neo4j.time import DateTime, Date

# Configure the Neo4j driver
NEO4J_URI = "neo4j+s://980a96ac.databases.neo4j.io"  # Update this if your database is remote
NEO4J_USER = "neo4j"  # Replace with your username
NEO4J_PASSWORD = "uU9BoxwwUl5FIRU9c48nXhxjM5yVwjkmyc_AeMqnHNY"  # Replace with your password

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Mock event
# event = {
#     'body': json.dumps({
#         'query': 'MATCH p=()-[:PURCHASED]->() RETURN p LIMIT 1;'
#     })
# }
# event = {
#     'body': json.dumps({
#         'query': 'MATCH (n) RETURN n LIMIT 5'
#     })
# }
event = {
    'body': json.dumps({
        'query': 'CALL { MATCH (n) WHERE n.address IS NOT NULL RETURN DISTINCT "node" as entity, n.address AS address UNION ALL MATCH ()-[r]-() WHERE r.address IS NOT NULL RETURN DISTINCT "relationship" AS entity, r.address AS address LIMIT 25 } RETURN * LIMIT 5;'
    })
}


def serialize_value(value):
    if isinstance(value, Node):
        return {
            'id': value.id,
            'labels': list(value.labels),
            'properties': {k: serialize_value(v) for k, v in value.items()}
        }
    elif isinstance(value, Relationship):
        return {
            'id': value.id,
            'type': value.type,
            'start_node_id': value.start_node.id,
            'end_node_id': value.end_node.id,
            'properties': {k: serialize_value(v) for k, v in value.items()}
        }
    elif isinstance(value, (int, float, str, bool, type(None))):
        return value
    elif isinstance(value, list):
        return [serialize_value(v) for v in value]
    elif isinstance(value, dict):
        return {k: serialize_value(v) for k, v in value.items()}
    elif isinstance(value, (DateTime, Date)):
        return value.iso_format()
    else:
        return str(value)

def handle_custom_query(driver, event):
    try:
        body_str = event.get('body', '{}') or '{}'
        print('Event Body:', body_str)
        body = json.loads(body_str)
        query = body.get('query', '')
        if not query:
            error_message = 'No query provided'
            print(error_message)
            response = {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': error_message})
            }
            return response
        with driver.session() as session:
            print(f'Executing custom query: {query}')
            result = session.run(query)
            print("Result: ", result)
            records = []
            for record in result:
                print("Record: ", record)
                record_data = {}
                for key, value in record.items():
                    # print("Key: ", key, " Value: ", value)
                    if isinstance(value, Path):
                        # print("I am Path")
                        record_data[key] = {
                            'nodes': [serialize_value(node) for node in value.nodes],
                            'relationships': [serialize_value(rel) for rel in value.relationships],
                        }
                    else:
                        # print("I am inside Else")
                        record_data[key] = serialize_value(value)
                records.append(record_data)
            # Handle cases where no records are returned
            if not records:
                response_body = {'message': 'Query executed successfully.'}
            else:
                response_body = records
            response = {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(response_body)
            }
            return response
    except json.JSONDecodeError as e:
        error_message = f'Invalid JSON in request body: {str(e)}'
        print(error_message)
        traceback.print_exc()
        response = {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': error_message})
        }
        return response
    except Neo4jError as e:
        error_message = f'Database error during custom query: {str(e)}'
        print(error_message)
        traceback.print_exc()
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': error_message})
        }
        return response
    except Exception as e:
        error_message = f'Internal server error during custom query: {str(e)}'
        print(error_message)
        traceback.print_exc()
        response = {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': error_message})
        }
        return response





# main website function
# def handle_custom_query(driver, event):
#     try:
#         body_str = event.get('body', '{}') or '{}'
#         print('Event Body:', body_str)
#         body = json.loads(body_str)
#         query = body.get('query', '')
#         if not query:
#             error_message = 'No query provided'
#             print(error_message)
#             response = {
#                 'statusCode': 400,
#                 'headers': {
#                     'Content-Type': 'application/json',
#                     'Access-Control-Allow-Origin': '*'
#                 },
#                 'body': json.dumps({'error': error_message})
#             }
#             return response
#         with driver.session() as session:
#             print(f'Executing custom query: {query}')
#             result = session.run(query)
#             records = []
#             for record in result:
#                 record_data = {key: serialize_value(value) for key, value in record.items()}
#                 records.append(record_data)
#             # Handle cases where no records are returned
#             if not records:
#                 response_body = {'message': 'Query executed successfully.'}
#             else:
#                 response_body = records
#             response = {
#                 'statusCode': 200,
#                 'headers': {
#                     'Content-Type': 'application/json',
#                     'Access-Control-Allow-Origin': '*'
#                 },
#                 'body': json.dumps(response_body)
#             }
#             return response
#     except json.JSONDecodeError as e:
#         error_message = f'Invalid JSON in request body: {str(e)}'
#         print(error_message)
#         traceback.print_exc()
#         response = {
#             'statusCode': 400,
#             'headers': {
#                 'Content-Type': 'application/json',
#                 'Access-Control-Allow-Origin': '*'
#             },
#             'body': json.dumps({'error': error_message})
#         }
#         return response
#     except Neo4jError as e:
#         error_message = f'Database error during custom query: {str(e)}'
#         print(error_message)
#         traceback.print_exc()
#         response = {
#             'statusCode': 500,
#             'headers': {
#                 'Content-Type': 'application/json',
#                 'Access-Control-Allow-Origin': '*'
#             },
#             'body': json.dumps({'error': error_message})
#         }
#         return response
#     except Exception as e:
#         error_message = f'Internal server error during custom query: {str(e)}'
#         print(error_message)
#         traceback.print_exc()
#         response = {
#             'statusCode': 500,
#             'headers': {
#                 'Content-Type': 'application/json',
#                 'Access-Control-Allow-Origin': '*'
#             },
#             'body': json.dumps({'error': error_message})
#         }
#         return response

# Main execution for testing
if __name__ == "__main__":
    try:
        print("Enter your Neo4j query:")
        query = input()  # Take query as input from the user
        event['body'] = json.dumps({'query': query})
        response = handle_custom_query(driver, event)
        print("Response:")
        print(json.dumps(response, indent=2))
    except KeyboardInterrupt:
        print("\nExecution interrupted by user.")