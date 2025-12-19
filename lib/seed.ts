import db from './db';
import { categories, projects } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const [webCategory] = await db.insert(categories).values({
    name: 'Web Apps',
    description: 'Modern web applications built with Next.js and Tailwind',
  }).returning();

  const [aiCategory] = await db.insert(categories).values({
    name: 'AI & Automation',
    description: 'Projects leveraging LLMs and automated workflows',
  }).returning();

  // Create projects
  await db.insert(projects).values([
    {
      title: 'Project Management Tool',
      description: 'A comprehensive task and project tracking system',
      status: 'in-progress',
      categoryId: webCategory.id,
    },
    {
      title: 'Enterprise Portfolio',
      description: 'High-performance portfolio for enterprise clients',
      status: 'completed',
      categoryId: webCategory.id,
    },
    {
      title: 'AI Chatbot Assistant',
      description: 'Intelligent chatbot for customer support automation',
      status: 'planned',
      categoryId: aiCategory.id,
    },
  ]);

  console.log('✅ Seeding complete!');
}

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});

