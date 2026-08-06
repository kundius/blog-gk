import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const part = argv[i];
    if (part.startsWith("--")) {
      const eq = part.indexOf("=");
      if (eq !== -1) {
        args[part.slice(2, eq)] = part.slice(eq + 1);
      } else {
        args[part.slice(2)] = argv[i + 1] ?? "";
        i += 1;
      }
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = (args.email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = args.password || process.env.ADMIN_PASSWORD || "";
  const name = args.name || "Администратор";
  const role = args.role || "admin";

  if (!email || !password) {
    console.error(
      "Usage: npm run admin:create -- --email admin@example.com --password 'secret' [--name 'Admin'] [--role admin]",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role, status: "active" },
    create: {
      email,
      passwordHash,
      name,
      role,
      status: "active",
      dateCreated: new Date(),
    },
  });

  console.log(`User ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
