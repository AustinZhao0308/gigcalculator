import { EventState, TicketTier, Venue } from '../types';

export const calculateFinancials = (state: EventState) => {
  // 1. Revenue
  const ticketRevenue = state.tickets.reduce((acc, t) => acc + (t.expectedSales * t.price), 0);
  
  const merchRevenue = state.merch.reduce((acc, m) => acc + (m.expectedSales * m.sellingPrice), 0);
  const merchCost = state.merch.reduce((acc, m) => acc + (m.quantityOrdered * m.unitCost), 0);
  const netMerch = merchRevenue - merchCost;

  const drinksRevenue = state.venue.drinksCut; // Simple flat estimate for now

  const totalGrossRevenue = ticketRevenue + merchRevenue + drinksRevenue;

  // 2. Costs
  
  // Band Costs
  let totalBandFees = 0;
  let totalTravelCosts = 0;
  state.bands.forEach(b => {
    totalBandFees += b.guaranteeFee;
    b.travelExpenses.forEach(t => totalTravelCosts += t.cost);
  });

  // Venue Cost Logic: Max(BaseFee, Share of Ticket Revenue)
  let venueCost = state.venue.baseFee;
  if (state.venue.hasRevenueShare) {
    const venueShareAmount = ticketRevenue * (state.venue.revenueSharePercent / 100);
    // If share is less than base fee, organizer pays base fee.
    // If share is higher, usually venue takes the share (deal dependent, assuming standard "Greater Of" or "Split from Gross" deal).
    // Prompt says: "If venue's 30% < 3000, organizer pays 3000. Others to organizer."
    // This implies the COST to organizer is Math.max(Base, Share).
    venueCost = Math.max(state.venue.baseFee, venueShareAmount);
  }

  // Misc Costs
  const totalMiscCosts = state.otherCosts.reduce((acc, c) => acc + c.cost, 0);

  const totalExpenses = venueCost + totalBandFees + totalTravelCosts + totalMiscCosts + merchCost;

  // 3. Profit
  const netProfit = totalGrossRevenue - totalExpenses;

  return {
    revenue: {
      tickets: ticketRevenue,
      merch: merchRevenue,
      drinks: drinksRevenue,
      total: totalGrossRevenue
    },
    costs: {
      venue: venueCost,
      bands: totalBandFees,
      travel: totalTravelCosts,
      merchProd: merchCost,
      misc: totalMiscCosts,
      total: totalExpenses
    },
    netProfit
  };
};

export interface CapacityWarning {
  day: number;
  allocated: number;
  capacity: number;
}

export const checkCapacityIssues = (state: EventState): CapacityWarning[] => {
  const warnings: CapacityWarning[] = [];
  
  // Calculate max possible attendees per day based on ticket allocation
  // Note: This is a simplified check. Real world is complex with multi-day passes overlapping.
  
  for (let i = 0; i < state.days; i++) {
    let potentialHeadcount = 0;
    state.tickets.forEach(t => {
      // If ticket is valid for this day
      if (t.validDays.includes(i)) {
        potentialHeadcount += t.totalAllocation;
      }
    });

    if (potentialHeadcount > state.venue.capacity) {
      warnings.push({
        day: i + 1,
        allocated: potentialHeadcount,
        capacity: state.venue.capacity
      });
    }
  }

  return warnings;
};