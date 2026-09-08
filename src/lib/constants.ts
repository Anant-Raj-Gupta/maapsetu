export const ROLES = {
  TRADER: "TRADER",
  LMO: "LMO",
  GATC: "GATC",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const APPLICATION_STATUS = {
  SUBMITTED: "SUBMITTED",
  ASSIGNED: "ASSIGNED",
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  PASSED: "PASSED",
  FAILED: "FAILED",
  CERTIFIED: "CERTIFIED",
} as const;

export const INSTRUMENT_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  VERIFIED: "VERIFIED",
  EXPIRING: "EXPIRING",
  EXPIRED: "EXPIRED",
  FAILED: "FAILED",
} as const;

export const INSTRUMENT_CATALOGUE = [
  {
    category: "NAWI",
    label: "Non-automatic weighing instrument (shop / counter scale)",
    accuracyClass: "III",
    validityMonths: 12,
    fee: 200,
    mpe: "±1 e at 500 e",
    assignedKind: "LMO",
  },
  {
    category: "WEIGHBRIDGE",
    label: "Weighbridge / high-capacity weighing machine",
    accuracyClass: "III",
    validityMonths: 12,
    fee: 4000,
    mpe: "±1 e up to 500 e; ±2 e above",
    assignedKind: "GATC",
  },
  {
    category: "DISPENSER",
    label: "Fuel / liquid measuring dispenser",
    accuracyClass: "0.5",
    validityMonths: 12,
    fee: 1500,
    mpe: "±0.5% of measured volume",
    assignedKind: "LMO",
  },
] as const;

export function catalogueFor(category: string) {
  return INSTRUMENT_CATALOGUE.find((item) => item.category === category);
}

export const DEMO_ACCOUNTS = [
  { email: "shop@maapsetu.gov.in", password: "Shop@123", role: "Trader" },
  { email: "lmo@maapsetu.gov.in", password: "Lmo@123", role: "LMO" },
  { email: "gatc@maapsetu.gov.in", password: "Gatc@123", role: "GATC" },
  { email: "admin@maapsetu.gov.in", password: "Admin@123", role: "Admin" },
];
