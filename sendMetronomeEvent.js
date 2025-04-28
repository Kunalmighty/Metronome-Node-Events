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
    "event_type": "ra9-compute-heartbeat",
    "properties": {
      "cloud": "raindrop-blueshift-ra9",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "region": "us-west-1",
      "duration_seconds": "3690"
    }
  },
  {
    "timestamp": "2025-04-25T14:30:00+00:00",
    "transaction_id": "0a167631-4c07-49f2-b6ef-c1f91a1325e6",
    "customer_id": "fe6a17b8-b4c1-4576-931a-86f002f48593",
    "event_type": "bigquery-compute-heartbeat",
    "properties": {
      "cloud": "raindrop-bigquery",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "region": "us-west-1",
      "duration_seconds": "3690"
    }
  },
  {
    "timestamp": "2025-04-25T14:30:00+00:00",
    "transaction_id": "c012f5c8-e0a3-46ec-b4b4-9bf64949a355",
    "customer_id": "fe6a17b8-b4c1-4576-931a-86f002f48593",
    "event_type": "ra9-storage-heartbeat",
    "properties": {
      "cloud": "raindrop-blueshift-ra9",
      "cluster_id": "b1600b4c-ef72-4b67-bc27-eaccad4cbed2",
      "table_id": "6820fb25-d381-488b-9e7a-261186d5ddd1",
      "region": "us-west-1",
      "mb_stored": "3096"
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

  const eventTypes = [
    'ra9-compute-heartbeat',
    'ra9-storage-heartbeat',
    'bigquery-compute-heartbeat'
  ];

  const events = [];

  for (const customerId of customers) {
    for (const eventType of eventTypes) {
      // Generate random date between April 1st and April 26th, 2025
      const startDate = new Date('2025-04-01T00:00:00Z');
      const endDate = new Date('2025-04-26T23:59:59Z');
      const randomTimestamp = new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      );

      let properties = {
        region: 'us-west-1'
      };

      if (eventType === 'ra9-compute-heartbeat') {
        properties.duration_seconds = Math.floor(Math.random() * 7200).toString();
        properties.cloud = 'raindrop-blueshift-ra9';
        properties.cluster_id = crypto.randomUUID();
      } else if (eventType === 'ra9-storage-heartbeat') {
        properties.mb_stored = Math.floor(Math.random() * 10000).toString();
        properties.cloud = 'raindrop-blueshift-ra9';
        properties.cluster_id = crypto.randomUUID();
        properties.table_id = crypto.randomUUID();
      } else if (eventType === 'bigquery-compute-heartbeat') {
        properties.duration_seconds = Math.floor(Math.random() * 7200).toString();
        properties.cloud = 'raindrop-bigquery';
        properties.cluster_id = crypto.randomUUID();
      }

      events.push({
        timestamp: randomTimestamp.toISOString(),
        transaction_id: crypto.randomUUID(),
        customer_id: customerId,
        event_type: eventType,
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
