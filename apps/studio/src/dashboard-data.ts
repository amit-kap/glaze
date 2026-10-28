// The numbers the sample dashboard shows. Made up, shaped like a small shop.

export const stats = [
  {
    label: "In-store sales",
    value: "$7,820.75",
    delta: "+$322.50",
    tone: "up",
    base: "Based on 5,000 orders",
  },
  {
    label: "Website sales",
    value: "$985,937.45",
    delta: "+$109,500.00",
    tone: "up",
    base: "Based on 21,000 orders",
  },
  {
    label: "Wholesale",
    value: "$124,650.00",
    delta: "+$7,935.00",
    tone: "up",
    base: "Based on 890 orders",
  },
  {
    label: "Returns",
    value: "$15,503.00",
    delta: "−$498.00",
    tone: "down",
    base: "Based on 6,000 orders",
  },
] as const

export const week = [
  { day: "Mon", revenue: 1900, expenses: 900 },
  { day: "Tue", revenue: 2100, expenses: 1000 },
  { day: "Wed", revenue: 3000, expenses: 1100 },
  { day: "Thu", revenue: 1800, expenses: 1000 },
  { day: "Fri", revenue: 2900, expenses: 1000 },
  { day: "Sat", revenue: 1300, expenses: 700 },
  { day: "Sun", revenue: 1700, expenses: 800 },
]

export const pipeline = [
  { month: "Jul", orders: 900, sales: 24000 },
  { month: "Aug", orders: 1500, sales: 31000 },
  { month: "Sep", orders: 1700, sales: 39000 },
]

export const categories = [
  { category: "Electronics", sales: 92 },
  { category: "Clothing", sales: 74 },
  { category: "Home", sales: 58 },
  { category: "Sports", sales: 41 },
  { category: "Beauty", sales: 66 },
]

// Visits per week, on a 0 to 1 scale, for each traffic level.
export const traffic = [
  { level: "6k", weeks: [0.2, 0.5, 0.35, 0.2] },
  { level: "5k", weeks: [0.55, 1, 0.55, 0.3] },
  { level: "4k", weeks: [0.5, 1, 0.6, 0.35] },
  { level: "3k", weeks: [0.55, 1, 1, 0.3] },
  { level: "2k", weeks: [0.5, 1, 0.8, 0.4] },
  { level: "1k", weeks: [0.4, 0.75, 0.9, 0.35] },
]

// Orders by channel: five slices, so all five chart colours are in use.
export const orderStatus = [
  { status: "online", orders: 1620 },
  { status: "retail", orders: 980 },
  { status: "wholesale", orders: 640 },
  { status: "marketplace", orders: 520 },
  { status: "social", orders: 290 },
]

export type Priority = "Critical" | "High" | "Medium" | "Low"
export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft"

export type Invoice = {
  customer: string
  initials: string
  id: string
  date: string
  amount: number
  priority: Priority
  status: InvoiceStatus
}

export const invoices: Invoice[] = [
  {
    customer: "Ilze Pērkone",
    initials: "IP",
    id: "INV-00001",
    date: "2025-01-05",
    amount: 1250,
    priority: "High",
    status: "Paid",
  },
  {
    customer: "Vernon Desilets",
    initials: "VD",
    id: "INV-00002",
    date: "2025-01-08",
    amount: 3420,
    priority: "Medium",
    status: "Pending",
  },
  {
    customer: "Lin Wāngshū",
    initials: "LW",
    id: "INV-00003",
    date: "2025-01-12",
    amount: 890,
    priority: "Low",
    status: "Paid",
  },
  {
    customer: "Rajesh Bhatt",
    initials: "RB",
    id: "INV-00004",
    date: "2025-01-15",
    amount: 4750,
    priority: "Critical",
    status: "Overdue",
  },
  {
    customer: "Jessica Cannon",
    initials: "JC",
    id: "INV-00005",
    date: "2025-01-18",
    amount: 567.25,
    priority: "Low",
    status: "Draft",
  },
  {
    customer: "Maya Chen",
    initials: "MC",
    id: "INV-00006",
    date: "2025-01-21",
    amount: 2100,
    priority: "Medium",
    status: "Paid",
  },
  {
    customer: "Tomás Ibarra",
    initials: "TI",
    id: "INV-00007",
    date: "2025-01-24",
    amount: 760,
    priority: "Low",
    status: "Pending",
  },
  {
    customer: "Aisha Rahman",
    initials: "AR",
    id: "INV-00008",
    date: "2025-01-27",
    amount: 5320,
    priority: "High",
    status: "Paid",
  },
  {
    customer: "Noah Fischer",
    initials: "NF",
    id: "INV-00009",
    date: "2025-01-30",
    amount: 1480,
    priority: "Medium",
    status: "Overdue",
  },
  {
    customer: "Sofia Davis",
    initials: "SD",
    id: "INV-00010",
    date: "2025-02-02",
    amount: 315,
    priority: "Low",
    status: "Paid",
  },
]
