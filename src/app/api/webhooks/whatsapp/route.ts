import { NextResponse } from 'next/server';

// Webhook verification endpoint (required by WhatsApp/Meta API)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // These are standard query parameters used by Meta for webhook verification
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // In a real application, check this against a secure environment variable
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'tagverse_crm_secret';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WhatsApp Webhook verified successfully!');
      return new NextResponse(challenge, { status: 200 });
    } else {
      console.log('❌ Webhook verification failed. Invalid token.');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.json({ message: 'WhatsApp Webhook Endpoint Active' }, { status: 200 });
}

// Endpoint to handle incoming messages/events
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Log the raw payload for debugging
    console.log('\n--- 🔔 NEW WHATSAPP WEBHOOK RECEIVED ---');
    console.log(JSON.stringify(payload, null, 2));

    // Basic logic to determine the type of incoming message
    // In a full implementation, you would parse standard WhatsApp Business API payload structures
    
    // Simulate detecting a Field Worker action (e.g. from n8n)
    if (payload?.type === 'agent_action') {
      console.log(`📍 Field Agent Action Logged: ${payload.agentName} - ${payload.action}`);
      // Here you would typically insert this into the DB to update the Field Monitoring Dashboard
    }
    
    // Simulate a standard client message
    else if (payload?.type === 'client_message' || payload?.entry) {
      console.log(`💬 Client Message Logged. Sending to Deal Pipeline Activity Feed...`);
      // Here you would typically link the phone number to a Deal and log the activity
    }

    console.log('----------------------------------------\n');

    // Return a 200 OK to acknowledge receipt (critical for webhooks so they don't retry)
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
