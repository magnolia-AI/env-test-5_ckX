import { NextResponse } from 'next/server'

export async function GET() {
  // We collect environment variables. 
  // Note: Only process.env variables that are accessible at runtime will be included.
  // In a real production app, we would be EXTREMELY careful here.
  const envVars = Object.entries(process.env).reduce((acc, [key, value]) => {
    // Filter out potential system-heavy or sensitive internal node vars if desired,
    // but the user specifically asked to see variables and values for testing.
    acc[key] = value
    return acc
  }, {} as Record<string, string | undefined>)

  return NextResponse.json(envVars)
}

