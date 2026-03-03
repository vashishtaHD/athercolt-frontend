export const ALL_JOBS = [
  // ENGINEERING
  { id: 1, title: "Senior Frontend Engineer", category: "Engineering", location: "Remote", type: "Full-Time", tags: ["React", "TypeScript", "UI/UX"] },
  { id: 2, title: "Backend Engineer", category: "Engineering", location: "San Francisco, CA", type: "Full-Time", tags: ["Python", "Node.js", "APIs"] },
  { id: 3, title: "Full Stack Developer", category: "Engineering", location: "Denver, CO", type: "Full-Time", tags: ["React", "Node.js", "MongoDB"] },
  { id: 4, title: "iOS Developer", category: "Engineering", location: "Austin, TX", type: "Full-Time", tags: ["Swift", "iOS", "Mobile"] },
  { id: 5, title: "Android Developer", category: "Engineering", location: "Remote", type: "Contract", tags: ["Kotlin", "Android", "Mobile"] },

  // DEVOPS & CLOUD
  { id: 6, title: "DevOps Engineer", category: "DevOps & Cloud", location: "Remote", type: "Full-Time", tags: ["AWS", "Kubernetes", "CI/CD"] },
  { id: 7, title: "Cloud Solutions Architect", category: "DevOps & Cloud", location: "Remote", type: "Full-Time", tags: ["AWS", "Azure", "Architecture"] },
  { id: 8, title: "Platform Engineer", category: "DevOps & Cloud", location: "Remote", type: "Contract", tags: ["Terraform", "Docker", "Infrastructure"] },
  { id: 9, title: "Site Reliability Engineer", category: "DevOps & Cloud", location: "Chicago, IL", type: "Full-Time", tags: ["SRE", "Monitoring", "Linux"] },
  { id: 10, title: "Security Engineer", category: "DevOps & Cloud", location: "Washington, DC", type: "Full-Time", tags: ["Security", "Penetration Testing", "SOC"] },

  // DATA & AI
  { id: 11, title: "Data Scientist", category: "Data & AI", location: "New York, NY", type: "Full-Time", tags: ["Python", "ML", "Analytics"] },
  { id: 12, title: "Machine Learning Engineer", category: "Data & AI", location: "San Francisco, CA", type: "Full-Time", tags: ["PyTorch", "NLP", "Deep Learning"] },
  { id: 13, title: "Data Engineer", category: "Data & AI", location: "Remote", type: "Full-Time", tags: ["Spark", "Airflow", "ETL"] },
  { id: 14, title: "AI Research Scientist", category: "Data & AI", location: "San Francisco, CA", type: "Full-Time", tags: ["LLMs", "Research", "Python"] },
  { id: 15, title: "QA Automation Engineer", category: "Data & AI", location: "Austin, TX", type: "Full-Time", tags: ["Selenium", "Testing", "Automation"] },

  // SALES & BUSINESS
  { id: 16, title: "Sales Director", category: "Sales & Business", location: "San Francisco, CA", type: "Full-Time", tags: ["Sales", "B2B", "Revenue"] },
  { id: 17, title: "Account Executive", category: "Sales & Business", location: "Denver, CO", type: "Full-Time", tags: ["Sales", "Enterprise", "B2B"] },
  { id: 18, title: "Business Development Rep", category: "Sales & Business", location: "New York, NY", type: "Contract", tags: ["Sales", "Outbound", "Prospecting"] },
  { id: 19, title: "Customer Success Manager", category: "Sales & Business", location: "Remote", type: "Full-Time", tags: ["Customer Success", "Retention", "SaaS"] },

  // MARKETING & CONTENT
  { id: 20, title: "Marketing Strategist", category: "Marketing", location: "New York, NY", type: "Full-Time", tags: ["Marketing", "Growth", "Content"] },
  { id: 21, title: "Content Marketing Manager", category: "Marketing", location: "Austin, TX", type: "Full-Time", tags: ["Content", "SEO", "Marketing"] },

  // OPERATIONS & HR
  { id: 22, title: "Operations Manager", category: "Operations", location: "New York, NY", type: "Full-Time", tags: ["Operations", "Management", "Strategy"] },
  { id: 23, title: "HR Business Partner", category: "Operations", location: "Austin, TX", type: "Full-Time", tags: ["HR", "People Ops", "Culture"] },
  { id: 24, title: "People Operations Coordinator", category: "Operations", location: "Remote", type: "Full-Time", tags: ["HR", "Onboarding", "Culture"] },
  { id: 25, title: "Executive Assistant", category: "Operations", location: "San Francisco, CA", type: "Full-Time", tags: ["Admin", "C-Suite", "Coordination"] },
  { id: 26, title: "Office Administrator", category: "Operations", location: "Remote", type: "Full-Time", tags: ["Admin", "Coordination", "Office Mgmt"] },

  // FINANCE & LEGAL
  { id: 27, title: "Financial Analyst", category: "Finance & Legal", location: "Chicago, IL", type: "Full-Time", tags: ["Finance", "Analytics", "Forecasting"] },
  { id: 28, title: "Finance Manager", category: "Finance & Legal", location: "Chicago, IL", type: "Full-Time", tags: ["Finance", "Accounting", "Strategy"] },
  { id: 29, title: "Compliance Officer", category: "Finance & Legal", location: "Washington, DC", type: "Full-Time", tags: ["Compliance", "Legal", "Risk"] },
  { id: 30, title: "Legal Operations Associate", category: "Finance & Legal", location: "Boston, MA", type: "Full-Time", tags: ["Legal", "Operations", "Contracts"] },

  // RECRUITING
  { id: 31, title: "Technical Recruiter", category: "Recruiting", location: "Remote", type: "Full-Time", tags: ["Recruiting", "Talent", "Sourcing"] },
  { id: 32, title: "Talent Acquisition Lead", category: "Recruiting", location: "Remote", type: "Full-Time", tags: ["Recruiting", "Strategy", "Hiring"] },
];

// Seeded random using date
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dateToSeed(dateStr) {
  const parts = dateStr.split('-');
  return parseInt(parts[0]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[2]);
}

export function getDailyJobs(count = 10) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const seed = dateToSeed(dateStr);

  const shuffled = [...ALL_JOBS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// Extract unique categories from the daily subset
export function getCategories(jobs) {
  const cats = [...new Set(jobs.map((j) => j.category))];
  return cats.sort();
}
