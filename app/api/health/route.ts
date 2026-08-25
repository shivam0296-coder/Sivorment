export function GET() {
  return Response.json({ status: 'ok', service: 'sivorment-web', timestamp: new Date().toISOString() });
}
