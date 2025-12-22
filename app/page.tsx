import { getProjects, getCategories } from '@/app/actions/projects'
import { ProjectList } from '@/components/projects/project-list'
import { AddProjectForm } from '@/components/projects/add-project-form'
import { Toaster } from 'sonner'
import { Cpu, LayoutDashboard, Rocket } from 'lucide-react'

export default async function ProjectsPage() {
  const [initialProjects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ])

  return (
    <className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Rocket className="w-4 h-4" />
              Build something great
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              test Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Organize, track, and showcase your creative technical work in one powerful dashboard.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/50">
            <div className="flex flex-col items-center px-4 border-r border-border/50">
              <span className="text-2xl font-bold text-foreground">{initialProjects.length}</span>
              <span>Projects</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-2xl font-bold text-foreground">{categories.length}</span>
              <span>Categories</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          {/* Main List */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 border-b pb-4">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold italic">Active Projects</h2>
            </div>
            <ProjectList initialProjects={initialProjects} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <AddProjectForm categories={categories} />
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">Database Powered</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This dashboard uses <strong>Drizzle ORM</strong> and <strong>PostgreSQL</strong> for real-time persistence. Every action is instant and robust.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </main>
  )
}

