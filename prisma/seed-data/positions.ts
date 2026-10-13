// This describes what one position looks like, so TypeScript can catch typos
export type SeedPosition = {
  name: string;
  description: string;
  days: string;
  times: string;
  available: boolean;
};

export const positions: SeedPosition[] = [
  {
    name: "Community Outreach",
    description:
      "Work with Executive Director to sponsor quarterly outreach events to guests dealing with health and nutrition",
    days: "Any",
    times: "4 hours weekly",
    available: true,
  },
  {
    name: "DOT Certified Truck Drivers",
    description:
      "Drive box truck to pick up food donations from grocery stores. Physical exam required. Reimbursement for cost of exam is available",
    days: "Varies; Week-days",
    times: "6-8 hours weekly",
    available: true,
  },
  {
    name: "Guest Intake",
    description:
      "Data Entry; Check in Guests on arrival on Service Days using software",
    days: "Thursday and Saturday",
    times: "7:30 AM to 12:00 PM",
    available: true,
  },
  {
    name: "Home Deliveries",
    description:
      "Gather groceries from warehouse and deliver to home-bound guests; guidance from coordinator will be given.",
    days: "Subject to guest schedule",
    times: "4-8 hours every two weeks",
    available: true,
  },
  {
    name: "Inside Traffic Control",
    description:
      "Maintain orderly carriage traffic inside Pantry during Service Days",
    days: "Thursday and Saturday",
    times: "7:30 AM to 12:00 PM",
    available: true,
  },
  {
    name: "Newsletter",
    description:
      "Produce bi-weekly newsletter for volunteers, donors and associates",
    days: "Any",
    times: "6 hours bi-weekly",
    available: true,
  },
  {
    name: "Operations",
    description: "Assist in documenting and updating processes and procedures",
    days: "Any",
    times: "4 hours weekly",
    available: true,
  },
  {
    name: "Outside Wait List",
    description:
      "Enter guest information into electronic wait list system on Service Days",
    days: "Thursday and Saturday",
    times: "7:00 AM to 10:30 AM",
    available: true,
  },
  {
    name: "Parking Lot",
    description: "Directing traffic in outside parking lot on Service Days",
    days: "Thursday and Saturday",
    times: "7:00 AM to 10:30 AM",
    available: true,
  },
  {
    name: "Social Media",
    description:
      "Generate social media postings about Pantry events, news and events",
    days: "Any",
    times: "2-4 hours each week",
    available: true,
  },
  {
    name: "Social Services Liaison",
    description:
      "Guide guests and lead them to additional assistance that may be available to them on Service Days",
    days: "Thursday and Saturday",
    times: "4 hours each day",
    available: true,
  },
  {
    name: "Super Volunteer",
    description:
      "Assigned duties on arrival to Pantry ranging from stocking shelves, guiding guests through aisles on service days, clean-up, carriage retrieval from parking lot, etc on Service Days",
    days: "Thursday and Saturday",
    times: "7:30 AM to 12:00 PM",
    available: true,
  },
  {
    name: "Super Volunteer",
    description:
      "Stocking shelves, checking food expiration dates on packages, clean-up, etc on non-service days",
    days: "Tue, Wed, Fri",
    times: "8:00 AM to 11:30 AM",
    available: true,
  },
  {
    name: "Translator",
    description:
      "Proficient in either Portuguese and/or Spanish aiding guests on Service Days",
    days: "Thursday and Saturday",
    times: "7:30 AM to 12:00 PM",
    available: true,
  },
];
