// Health check endpoint for Docker/Railway
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Dosametry',
    version: '1.0.0'
  }, {
    status: 200
  });
}
