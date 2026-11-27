import { pool } from "../../config/db";

export async function planSeed() {
  const countResult = await pool.query("SELECT COUNT(*) FROM plans");
  const count = parseInt(countResult.rows[0].count, 10);

  if (count > 0) {
    console.log(`Plans already exist (${count} found), skipping plan seed.`);
    return;
  }

  const plans = [
    {
      name: "Starter",
      price_inr: 2499,
      conversations: 500,
      websites: 1,
      agents: 1,
      web_crawling: false,
      human_handoff: false,
      duration_days: 30,
    },
    {
      name: "Professional",
      price_inr: 6599,
      conversations: 2000,
      websites: 3,
      agents: 3,
      web_crawling: true,
      human_handoff: true,
      duration_days: 30,
    },
    {
      name: "Business",
      price_inr: 16599,
      conversations: 10000,
      websites: 10,
      agents: 10,
      web_crawling: true,
      human_handoff: true,
      duration_days: 30,
    },
    {
      name: "Enterprise",
      price_inr: 0,
      conversations: 999999,
      websites: 999,
      agents: 999,
      web_crawling: true,
      human_handoff: true,
      duration_days: 30,
    },
  ];

  for (const plan of plans) {
    await pool.query(
      `INSERT INTO plans (
        name, price_inr, conversations, websites, agents, web_crawling, human_handoff, duration_days
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        plan.name,
        plan.price_inr,
        plan.conversations,
        plan.websites,
        plan.agents,
        plan.web_crawling,
        plan.human_handoff,
        plan.duration_days,
      ]
    );
  }

  console.log("Plans seeded: 4 plans inserted");
}

if (require.main === module || !module.parent) {
  planSeed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Plan seed failed:", err);
      await pool.end();
      process.exit(1);
    });
}
