import { PrismaClient, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const roles: Prisma.RoleCreateInput[] = [
  {
    name: 'SUPER_ADMIN',
    description: 'Super admin (system-wide)',
  },
  {
    name: 'ORGANIZATION_ADMIN',
    description: 'Organization admin',
  },
  {
    name: 'USER',
    description: 'Standard user',
  },
];

export async function main() {
  console.log('Seeding roles...');
  for (const role of roles) {
    console.log('Creating role:', role.name);
    await prisma.role.create({ data: role });
  }
}

main();

// function env(name: string, fallback: string): string;
// function env(name: string, fallback?: string): string | undefined;
// function env(name: string, fallback?: string) {
//   const v = process.env[name];
//   if (v && v.trim().length > 0) return v.trim();
//   return fallback;
// }

// async function main() {
//   // Roles
//   await prisma.role.upsert({
//     where: { name: 'SUPER_ADMIN' },
//     update: { description: 'Super admin (system-wide)' },
//     create: { name: 'SUPER_ADMIN', description: 'Super admin (system-wide)' },
//   });

//   await prisma.role.upsert({
//     where: { name: 'ORGANIZATION_ADMIN' },
//     update: { description: 'Organization admin' },
//     create: { name: 'ORGANIZATION_ADMIN', description: 'Organization admin' },
//   });

//   await prisma.role.upsert({
//     where: { name: 'USER' },
//     update: { description: 'Standard user' },
//     create: { name: 'USER', description: 'Standard user' },
//   });

//   // Organization (no unique key in schema, so find-or-create)
//   const orgName = env('SEED_ORG_NAME', 'SYSTEM');
//   const orgEmail = env('SEED_ORG_EMAIL', 'system@example.com')!;
//   const orgMobile = env('SEED_ORG_MOBILE', '9999999999')!;

//   const org =
//     (await prisma.organization.findFirst({ where: { name: orgName } })) ??
//     (await prisma.organization.create({
//       data: {
//         name: orgName,
//         email: orgEmail,
//         mobileNumber: orgMobile,
//       },
//     }));

//   const superAdminRole = await prisma.role.findUnique({
//     where: { name: 'SUPER_ADMIN' },
//     select: { id: true },
//   });

//   if (!superAdminRole) throw new Error('SUPER_ADMIN role missing');

//   // SUPER_ADMIN user
//   const username = env('SEED_SUPER_ADMIN_USERNAME', 'superadmin')!;
//   const password =
//     env('SEED_SUPER_ADMIN_PASSWORD') ??
//     (process.env.NODE_ENV === 'production' ? undefined : 'ChangeMe123!');

//   if (!password) {
//     throw new Error('Missing SEED_SUPER_ADMIN_PASSWORD');
//   }

//   const firstName = env('SEED_SUPER_ADMIN_FIRST_NAME', 'Super')!;
//   const lastName = env('SEED_SUPER_ADMIN_LAST_NAME', 'Admin')!;
//   const mobileNumber = env('SEED_SUPER_ADMIN_MOBILE', '9999999999')!;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = await prisma.user.upsert({
//     where: { username },
//     update: {
//       firstName,
//       lastName,
//       mobileNumber,
//       password: hashed,
//       organizationId: org.id,
//       roleId: superAdminRole.id,
//     },
//     create: {
//       username,
//       firstName,
//       lastName,
//       mobileNumber,
//       password: hashed,
//       organizationId: org.id,
//       roleId: superAdminRole.id,
//     },
//     select: { id: true, username: true, role: { select: { name: true } } },
//   });

//   console.log('Seeded SUPER_ADMIN user:', user);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
