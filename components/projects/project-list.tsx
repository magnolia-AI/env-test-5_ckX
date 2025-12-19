'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Briefcase, Calendar } from 'lucide-react'
import { deleteProject } from '@/app/actions/projects'
import { toast } from 'sonner'

export function ProjectList({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects)

  const handleDelete = async (id: number) => {
    const result = await deleteProject(id)
    if (result.success) {
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Project deleted successfully')
    } else {
      // @ts-ignore
      toast.error(result.error || 'Failed to delete project')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/50'
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/50'
      case 'planned': return 'bg-orange-500/10 text-orange-500 border-orange-500/50'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/50'
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl">
        <Briefcase className="w-12 h-12 mx-auto text-muted-foreground transition-all " />
        <h3 className="mt-4 text-xl font-semibold">No projects found</h3>
        <p className="text-muted-foreground">Add your first project to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden text-card-foreground">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(project.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="mt-2 text-xl">{project.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {project.category && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 bg-secondary rounded-md text-secondary-foreground text-xs font-medium">
                  {project.category.name}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-3 border-t text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Added {new Date(project.createdAt).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

