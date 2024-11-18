import { GdsAddBookingRequestInput } from '@definitions/types/booking.input.type';
import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import { GdsCancelBookingResponse } from '@definitions/types/rateplan.type';
import { getChannelAuthToken } from '@libs/helpers';
import axios from 'axios';

export const addPropertyBooking = async ({
  input,
  channelId,
  propertyId,
}: {
  input: GdsAddBookingRequestInput;
  channelId: number;
  propertyId: number;
}): Promise<GdsCancelBookingResponse> => {
  const channelAuthToken = await getChannelAuthToken(channelId);

  try {
    console.log({
      url: `${process.env.GDS_API_URL}/gds/emv-cms/properties/${propertyId}/bookings`,
      input: JSON.stringify(input, null, 4),
      headers: {
        Authorization: `${channelAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const res = await axios.post<GdsCancelBookingResponse>(
      `${process.env.GDS_API_URL}/gds/emv-cms/properties/${propertyId}/bookings`,
      input,
      {
        headers: {
          Authorization: `${channelAuthToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new EvcmsError(
      EVCMS_ERRORS.GDS_API_ERROR,
      error.response.data as string,
    );
  }
};
