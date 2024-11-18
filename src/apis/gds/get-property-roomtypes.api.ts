import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import {
  GdsPropertyRatePlanResponse,
  GdsPropertyRoomTypeResponse,
  GdsRoomType,
  GdsRoomTypeWithRatePlans,
} from '@definitions/types/rateplan.type';
import { getChannelAuthToken } from '@libs/helpers';
import axios from 'axios';

export const fetchPropertyRoomTypes = async (
  {
    propertyId,
    channelId,
  }: {
    propertyId: number;
    channelId: number;
  },
  {
    includeDeleted,
  }: {
    includeDeleted?: boolean;
  } = {},
): Promise<GdsRoomType[]> => {
  const channelAuthToken = await getChannelAuthToken(channelId);

  // get `${env.GDS_API_URL}/gds/diglett/properties/:property_id/roomtypes}` with parameter propertyId with authentication header
  // response data is in application/json format and in GdsPropertyRoomTypeResponse type

  try {
    const response = await axios.get<GdsPropertyRoomTypeResponse>(
      `${process.env.GDS_API_URL}/gds/diglett/properties/${propertyId}/roomtypes`,
      {
        headers: {
          Authorization: `${channelAuthToken}`,
        },
      },
    );

    return includeDeleted
      ? response.data.roomtypes
      : response.data.roomtypes.filter(
          (roomtype) => roomtype.status !== 'deleted',
        );
  } catch (error) {
    throw new EvcmsError(EVCMS_ERRORS.GDS_API_ERROR, error?.message as string);
  }
};

export const fetchPropertyRoomTypesWithRatePlans = async (
  {
    propertyId,
    channelId,
  }: {
    propertyId: number;
    channelId: number;
  },
  {
    includeDeleted,
  }: {
    includeDeleted?: boolean;
  } = {},
): Promise<GdsRoomTypeWithRatePlans[]> => {
  const channelAuthToken = await getChannelAuthToken(channelId);
  const fetchedRoomTypes = await fetchPropertyRoomTypes(
    {
      propertyId,
      channelId,
    },
    {
      includeDeleted,
    },
  );

  return Promise.all(
    fetchedRoomTypes.map(async (roomType) => {
      const ratePlans = await axios.get<GdsPropertyRatePlanResponse>(
        `${process.env.GDS_API_URL}/gds/diglett/properties/${propertyId}/roomtypes/${roomType.id}/rateplans`,
        {
          headers: {
            Authorization: `${channelAuthToken}`,
          },
        },
      );

      return {
        ...roomType,
        ratePlans: ratePlans.data.rateplans.filter(
          (ratePlan) => ratePlan.status !== 'deleted',
        ),
      };
    }),
  );
};
