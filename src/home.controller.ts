import { Controller, Get, Query } from '@nestjs/common';
import { InspectionStore } from './inspection.store';

interface HomeSummary {
  date: string;
  total: number;
  ng: number;
  hold: number;
  review_pending: number;
}

@Controller('api/home')
export class HomeController {
  constructor(private readonly store: InspectionStore) {}

  @Get()
  getHome(@Query('date') requestedDate?: string): HomeSummary {
    const inspections = this.store.getAll();
    const latestInspectionDate = inspections
      .map((inspection) => inspection.inspected_at.slice(0, 10))
      .sort((left, right) => right.localeCompare(left))[0] ?? '';
    const date = requestedDate ?? latestInspectionDate;
    const dailyInspections = date
      ? inspections.filter((inspection) => inspection.inspected_at.slice(0, 10) === date)
      : [];

    return {
      date,
      total: dailyInspections.length,
      ng: dailyInspections.filter((inspection) => inspection.decision === 'NG').length,
      hold: dailyInspections.filter((inspection) => inspection.decision === 'HOLD').length,
      review_pending: 0,
    };
  }
}