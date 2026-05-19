# ticka-clients

Turborepo monorepo. Main app: `apps/dashboard` (React + Vite).

## Package manager

pnpm with workspaces.

## Apps

- `apps/dashboard` — main dashboard SPA (React, Vite, TanStack Router/Query, @base-ui/react, shadcn/ui base-vega style, remixicon)

## Packages

- `packages/api-types` — Zod schemas auto-generated from the backend OpenAPI spec. **Do not edit manually.** Re-generate by running the codegen script whenever the backend API changes.

---

## Role & Permission System

**Module:** `apps/dashboard/src/features/permissions/`

```
features/permissions/
├── roles.ts        — OrgRole / WorkspaceRole types + narrowing helpers
├── permissions.ts  — Pure permission functions (mirrors backend permissions.py)
├── hooks.ts        — useOrgPermissions / useWorkspacePermissions React hooks
├── can.tsx         — <IfCan> component for declarative role-gated rendering
└── index.ts        — Barrel export
```

### Source of truth

Role constants are derived from `packages/api-types/src/generated/zod.gen.ts`:

```ts
zOrganizationRoleEnum  // owner | admin | member | viewer
zWorkspaceRoleEnum     // admin | member | viewer
```

These are auto-generated from the backend — **never hardcode role strings** elsewhere in the frontend. Always import from `@/features/permissions`.

### Keeping in sync with the backend

When roles or permissions change in the backend:

1. **New role added** — re-generate `packages/api-types` so `zod.gen.ts` picks up the new value. TypeScript will immediately error on every exhaustive `Record<OrgRole, ...>` map (e.g. `ORG_ROLE_BADGE_VARIANT` in `permissions.ts`) that needs a decision for the new role. Fix each error.
2. **Permission logic changed** — update the corresponding pure function(s) in `permissions.ts` to match the updated `permissions.py` on the backend. The comments above each function reference the backend class name.
3. **Role removed** — same as adding: TypeScript errors will surface exhaustive maps that reference the removed value.

### Usage

```ts
import { useOrgPermissions, asOrgRole, IfCan } from '@/features/permissions'

const orgRole = asOrgRole(organization.user_role) ?? 'viewer'
const perms = useOrgPermissions(orgRole)

<IfCan condition={perms.canManageWorkspaces}>
  <CreateWorkspaceButton />
</IfCan>
```
