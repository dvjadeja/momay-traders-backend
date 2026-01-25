import type { User, Role, Permission } from 'generated/prisma/client';

export type AuthUser = Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'roleId' | 'organizationId'> & {
  company?: { name?: string };
  role: Pick<Role, 'id' | 'name'> & {
    permissions: Pick<Permission, 'code'>[];
  };
};

declare global {
  namespace Express {
    interface Locals {
      user?: AuthUser;
      responseId?: string;
    }
  }
}

export {};

