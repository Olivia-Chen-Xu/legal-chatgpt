import requests

# Define the API endpoint and headers
url = "localhost:3000/api/llm/query"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

# Define the JSON payload
payload = {
    "query": "your_query_input",
    "namespace": "your_namespace",
    "indexName": "your_index_name",
    "fullConversation": True,
    "includedDocuments": ["doc1", "doc2"],
    "dialogFlow": True
}

# Send the POST request
response = requests.post(url, headers=headers, json=payload)

# Print the response
print(response.status_code)
print(response.json())