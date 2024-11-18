import { RatePlanMapping } from 'src/database/models/property-rateplan-mapping.model';

export interface AddOrUpdateRatePlanMappingInputType {
  propertyId: number;
  channelId: number;
  ratePlanMappings?: RatePlanMapping[];
}
