const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample tasks across all lists...");
  
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users found. Please log in or register first.");
    return;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const tasksToCreate = [
    // Camping Trip
    {
      title: "Pack waterproof tent & sleeping bags",
      description: "Ensure 4-person tent pegs and cold-rated sleeping bags are packed.",
      category: "Camping Trip",
      status: "PENDING",
      priority: "HIGH",
      dueDate: today,
    },
    {
      title: "Purchase trail food & energy bars",
      description: "Buy dried fruits, trail mix, water purification tablets, and canned soups.",
      category: "Camping Trip",
      status: "COMPLETED",
      priority: "MEDIUM",
      dueDate: today,
    },
    {
      title: "Check campsite reservation & permits",
      description: "Download offline map and print entry passes for state park.",
      category: "Camping Trip",
      status: "PENDING",
      priority: "URGENT",
      dueDate: tomorrow,
    },

    // Pet Shopping
    {
      title: "Buy organic dog food & chew toys",
      description: "Get 15kg grain-free salmon kibble and rubber fetch balls.",
      category: "Pet Shopping",
      status: "PENDING",
      priority: "HIGH",
      dueDate: today,
    },
    {
      title: "Schedule annual vet health checkup",
      description: "Book appointment for rabies booster shot and routine blood work.",
      category: "Pet Shopping",
      status: "COMPLETED",
      priority: "MEDIUM",
      dueDate: today,
    },
    {
      title: "Grooming kit and cat litter refill",
      description: "Buy odor-control clumping litter and nail clippers.",
      category: "Pet Shopping",
      status: "PENDING",
      priority: "LOW",
      dueDate: nextWeek,
    },

    // Gardening
    {
      title: "Prune rose bushes & water flower beds",
      description: "Trim dead stems from rose garden and set morning drip irrigation.",
      category: "Gardening",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: today,
    },
    {
      title: "Buy organic fertilizer & plant seeds",
      description: "Purchase tomato seeds, basil starters, and compost bag.",
      category: "Gardening",
      status: "COMPLETED",
      priority: "LOW",
      dueDate: today,
    },

    // Errands
    {
      title: "Pick up dry cleaning",
      description: "Collect winter coat and formal suit from downtown cleaner.",
      category: "Errands",
      status: "PENDING",
      priority: "HIGH",
      dueDate: today,
    },
    {
      title: "Weekly grocery restock",
      description: "Buy fresh milk, eggs, whole grain bread, and leafy greens.",
      category: "Errands",
      status: "COMPLETED",
      priority: "HIGH",
      dueDate: today,
    },

    // Computer Science
    {
      title: "Complete Algorithms Homework 4",
      description: "Solve dynamic programming equations and time complexity proofs.",
      category: "Computer Science",
      status: "PENDING",
      priority: "URGENT",
      dueDate: today,
    },
    {
      title: "Review Operating Systems Chapter 7",
      description: "Study virtual memory paging and page replacement algorithms.",
      category: "Computer Science",
      status: "COMPLETED",
      priority: "HIGH",
      dueDate: today,
    },

    // Mathematics
    {
      title: "Solve linear algebra problem set 3",
      description: "Compute eigenvalues, eigenvectors, and matrix diagonalizations.",
      category: "Mathematics",
      status: "PENDING",
      priority: "HIGH",
      dueDate: tomorrow,
    },

    // Physics Lab
    {
      title: "Write Optics Lab Report",
      description: "Plot diffraction grating measurements and calculate wavelength errors.",
      category: "Physics Lab",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: nextWeek,
    },

    // Personal
    {
      title: "Morning 5k running session",
      description: "Complete cardio run at local track park before 8 AM.",
      category: "Personal",
      status: "COMPLETED",
      priority: "LOW",
      dueDate: today,
    },
  ];

  for (const user of users) {
    for (const t of tasksToCreate) {
      // Check if existing task with same title exists
      const existing = await prisma.task.findFirst({
        where: { userId: user.id, title: t.title },
      });
      if (!existing) {
        await prisma.task.create({
          data: {
            ...t,
            userId: user.id,
          },
        });
      }
    }
  }

  console.log("Successfully seeded tasks across all lists!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
