'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, LockIcon, UnlockIcon } from 'lucide-react'

export default function EnvViewer() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchEnv() {
      try {
        const response = await fetch('/api/env')
        if (!response.ok) throw new Error('Failed to fetch environment variables')
        const data = await response.json()
        setEnvVars(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchEnv()
  }, [])

  const filteredVars = Object.entries(envVars)
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b))

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Environment Variables</h1>
          <p className="text-muted-foreground mt-1">
            Viewing backend environment variables for testing purposes.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
          <InfoIcon className="w-4 h-4" />
          {Object.keys(envVars).length} Variables Found
        </div>
      </div>

      <Alert>
        <LockIcon className="h-4 w-4" />
        <AlertTitle>Security Note</AlertTitle>
        <AlertDescription>
          This page exposes backend process environment variables. This is intended for <strong>testing and debugging only</strong> in this specific environment.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Filter Variables</CardTitle>
          <Input 
            placeholder="Search by key (e.g. DATABASE, NEXT_PUBLIC...)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVars.length > 0 ? (
                  filteredVars.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono text-xs font-semibold break-all">
                        {key}
                      </TableCell>
                      <TableCell className="font-mono text-xs break-all text-muted-foreground">
                        {value || <span className="italic text-destructive/50">empty</span>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No matching variables found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

