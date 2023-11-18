export const DAYS_BACK = 90;

export const GITHUB_ORG_REPO = "SellerCloudTeam/fettle"

export const URL_HEALTHCHECKS_UI_API = "https://health.sellercloud.com/health-api";

export const Status = {
    OPERATIONAL: "Operational",
    PARTIAL_OUTAGE: "Partial outage",
    OUTAGE: "Outage",
    UNKNOWN: "Unknown"
} as const;

export type Statuses = typeof Status[keyof typeof Status];
