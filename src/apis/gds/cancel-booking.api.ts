import { GdsCancelBookingRequestInput } from '@definitions/types/booking.input.type';
import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import { GdsAddBookingResponse } from '@definitions/types/rateplan.type';
import { getChannelAuthToken } from '@libs/helpers';
import axios from 'axios';

export const cancelPropertyBooking = async ({
  input,
  channelId,
  propertyId,
  gdsBookingNumber,
}: {
  input: GdsCancelBookingRequestInput;
  channelId: number;
  propertyId: number;
  gdsBookingNumber: string;
}): Promise<GdsAddBookingResponse> => {
  const channelAuthToken = await getChannelAuthToken(channelId);

  console.log(
    JSON.stringify(
      {
        url: `${process.env.GDS_API_URL}/gds/emv-cms/properties/${propertyId}/bookings/${gdsBookingNumber}/cancel`,
        data: input,
        options: {
          headers: {
            Authorization: `${channelAuthToken}`,
            'Content-Type': 'application/json',
          },
        },
      },
      null,
      4,
    ),
  );

  try {
    const res = await axios.put<GdsAddBookingResponse>(
      `${process.env.GDS_API_URL}/gds/emv-cms/properties/${propertyId}/bookings/${gdsBookingNumber}/cancel`,
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
