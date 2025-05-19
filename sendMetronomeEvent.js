// sendMetronomeEvent.js
// Sends an event payload to Metronome API using Node.js and axios
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

/**
 * Sends events to Metronome ingest API
 * @param {Array} events - Array of event objects as per Metronome API
 * @param {string} token - Bearer token for authorization
 * @returns {Promise}
 */
async function sendMetronomeEvent(events, token) {
  try {
    const response = await axios.post(
      'https://api.metronome.com/v1/ingest',
      events,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Metronome API response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
    throw error;
  }
}

// Example event payloads
const exampleEvents = [
  {
    "timestamp": "2025-04-25T14:30:00+00:00",
    "transaction_id": "0a167631-4c07-49f2-b6ef-c1f91a1325e5",
    "customer_id": "fe6a17b8-b4c1-4576-931a-86f002f48593",
    "event_type": "claude_api_call",
    "properties": {
      "tokens": "42",
      "model_name": "haiku",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "region": "us-west-1",
      "language": "English"
    }
  },
  {
    "timestamp": "2025-04-25T14:30:00+00:00",
    "transaction_id": "0a167631-4c07-49f2-b6ef-c1f91a1325e6",
    "customer_id": "fe6a17b8-b4c1-4576-931a-86f002f48593",
    "event_type": "claude_api_call",
    "properties": {
      "tokens": "4200",
      "model_name": "sonnet",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "region": "us-east-2",
      "language": "English"
    }
  },
  {
    "timestamp": "2025-04-25T14:30:00+00:00",
    "transaction_id": "c012f5c8-e0a3-46ec-b4b4-9bf64949a355",
    "customer_id": "fe6a17b8-b4c1-4576-931a-86f002f48593",
    "event_type": "claude_api_call",
    "properties": {
      "tokens": "42000",
      "model_name": "opus",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "region": "us-west-2",
      "language": "English"
    }
  }
];

// Function to create custom events
function createCustomEvents() {
  const customers = [
    'fe6a17b8-b4c1-4576-931a-86f002f48593',
    '57b577c0-6fe3-48ab-9f5e-73d3025191e1',
    'b8dc7c5d-76cf-4b02-a156-2cf03b7bc145'
  ];

  const modelTypes = [
    'haiku',
    'sonnet',
    'opus'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese',
    'Japanese',
    'Korean'
  ];

  const regions = [
    'us-west-1',
    'us-west-2',
    'us-east-2',
    'us-east-1',
    'eu-west-1',
    'eu-west-2'
  ];

  const events = [];

  for (const customerId of customers) {
    for (const modelType of modelTypes) {
      // Generate random date between April 1st and April 26th, 2025
      const startDate = new Date('2025-05-01T00:00:00Z');
      const endDate = new Date('2025-05-26T23:59:59Z');
      const randomTimestamp = new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      );

      let properties = {
        region: regions[Math.floor(Math.random() * regions.length)],
      };

      if (modelType === 'haiku') {
        properties.tokens = Math.floor(Math.random() * 10000).toString();
        properties.model_name = 'haiku';
        properties.language = languages[Math.floor(Math.random() * languages.length)];
        properties.cluster_id = crypto.randomUUID();
      } else if (modelType === 'sonnet') {
        properties.language = languages[Math.floor(Math.random() * languages.length)];
        properties.cluster_id = crypto.randomUUID();
        properties.tokens = Math.floor(Math.random() * 10000).toString();
        properties.model_name = 'sonnet';
      } else if (modelType === 'opus') {
        properties.tokens = Math.floor(Math.random() * 10000).toString();
        properties.model_name = 'opus';
        properties.language = languages[Math.floor(Math.random() * languages.length)];
        properties.cluster_id = crypto.randomUUID();
      }
      events.push({
        timestamp: randomTimestamp.toISOString(),
        transaction_id: crypto.randomUUID(),
        customer_id: customerId,
        event_type: 'claude_api_call',
        properties
      });
    }
  }

  return events;
}

// Run if this file is executed directly
if (require.main === module) {
  const token = process.env.METRONOME_TOKEN;
  if (!token) {
    console.error('Error: METRONOME_TOKEN environment variable is not set');
    process.exit(1);
  }
  
  sendMetronomeEvent(createCustomEvents(), token)
    .then(() => console.log('Events sent successfully'))
    .catch(error => {
      console.error('Failed to send events:', error.message);
      process.exit(1);
    });
}

module.exports = sendMetronomeEvent;