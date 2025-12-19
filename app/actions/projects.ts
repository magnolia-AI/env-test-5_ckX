'use server'

import db from '@/lib/db'
import { projects, categories, type NewProject } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export type ActionResult<T = any> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// Programmatic actions
export async function getProjects() {
  try {
    return await db.query.projects.findMany({
      with: {
        category: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.query.categories.findMany();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createProject(data: NewProject): Promise<ActionResult> {
  try {
    const [newProject] = await db.insert(projects).values(data).returning();
    revalidatePath('/');
    return { success: true, data: newProject };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/');
    return { success: true, data: null };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

// Form action
export async function createProjectFormAction(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = parseInt(formData.get('categoryId') as string);
  const status = formData.get('status') as string;

  if (!title || !description || isNaN(categoryId)) {
    return { error: 'All fields are required' };
  }

  try {
    await db.insert(projects).values({
      title,
      description,
      categoryId,
      status: status as any,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding project:', error);
    return { error: 'Failed to add project' };
  }
}

