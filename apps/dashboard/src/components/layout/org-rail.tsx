import { useState } from "react"
import { Link, useMatchRoute, useParams } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { RiAddLine, RiInboxLine, RiSettings3Line } from "@remixicon/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useOrganizations,
  type Organization,
} from "@/features/organizations/api/organizations.api"
import { CreateOrganizationDialog } from "@/features/organizations/components/create-organization-dialog"

export const ORG_RAIL_WIDTH = "4rem"

export function OrgRail() {
  const { t } = useTranslation('layout')
  const [createOpen, setCreateOpen] = useState(false)
  const { data: organizations, isLoading } = useOrganizations()
  const params = useParams({ strict: false }) as { orgSlug?: string }
  const activeOrgSlug = params.orgSlug
  const matchRoute = useMatchRoute()
  const isOnSettings =
    !!activeOrgSlug &&
    !!matchRoute({
      to: "/orgs/$orgSlug/settings",
      params: { orgSlug: activeOrgSlug },
      fuzzy: true,
    })

  return (
    <aside
      aria-label="Organizations"
      style={{ width: ORG_RAIL_WIDTH }}
      className="relative z-20 hidden h-svh shrink-0 flex-col items-center border-r border-sidebar-border bg-background py-3 md:flex"
    >
      <Link
        to="/"
        aria-label={t('org.home')}
        className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors ring-inset hover:bg-primary/25"
      >
        <RiInboxLine className="size-5" />
      </Link>

      <Separator />

      <div className="[scrollbar-none] mt-3 flex flex-1 flex-col items-center gap-2 overflow-y-auto px-2 pb-2 [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-10 rounded-xl" />
            ))
          : organizations?.map((org) => (
              <OrgRailItem
                key={org.id}
                organization={org}
                isActive={org.slug === activeOrgSlug}
              />
            ))}

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('org.create')}
                onClick={() => setCreateOpen(true)}
                className="size-10 rounded-xl border border-dashed border-sidebar-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <RiAddLine />
              </Button>
            }
          />
          <TooltipContent side="right">{t('org.create')}</TooltipContent>
        </Tooltip>

        <CreateOrganizationDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      </div>

      {activeOrgSlug && (
        <>
          <Separator />
          <div className="pb-3 pt-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to="/orgs/$orgSlug/settings"
                    params={{ orgSlug: activeOrgSlug }}
                    aria-label={t('org.settings')}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-colors",
                      isOnSettings
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <RiSettings3Line className="size-5" />
                  </Link>
                }
              />
              <TooltipContent side="right">{t('org.settings')}</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </aside>
  )
}

function Separator() {
  return <span aria-hidden className="block h-px w-8 bg-sidebar-border/80" />
}

function OrgRailItem({
  organization,
  isActive,
}: {
  organization: Organization
  isActive: boolean
}) {
  const initials = organization.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            to="/orgs/$orgSlug"
            params={{ orgSlug: organization.slug }}
            aria-label={organization.name}
            className="group relative flex size-10 items-center justify-center"
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-1/2 -left-2 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-200",
                isActive
                  ? "h-6 opacity-100"
                  : "h-2 opacity-0 group-hover:h-4 group-hover:opacity-60"
              )}
            />
            <Avatar
              className={cn(
                "size-10 transition-[border-radius] duration-200",
                isActive ? "rounded-md" : "rounded-xl group-hover:rounded-lg"
              )}
            >
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold tracking-tight uppercase transition-colors duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-sidebar-accent text-sidebar-accent-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        }
      />
      <TooltipContent side="right">{organization.name}</TooltipContent>
    </Tooltip>
  )
}
