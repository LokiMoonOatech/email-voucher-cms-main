import { EVCMS_ERRORS, EvcmsError } from '@definitions/types/errors.type';
import { ParsedStandardEmailBookingData } from '@definitions/types/parser.type';

export const calculateRefundAmount = (
  parsedData: ParsedStandardEmailBookingData,
  originData: ParsedStandardEmailBookingData,
) => {
  const { salePrice, refundRate, refundAmount, cancelFeeRate } = parsedData;
  const { salePrice: originSalePrice, netPrice: originNetPrice } = originData;
  let { cancelFeeAmount } = parsedData;
  let calculatedRefundAmount = salePrice;

  switch (true) {
    case Array.isArray(cancelFeeAmount):
      cancelFeeAmount = (cancelFeeAmount as number[]).reduce(
        (acc, cur) => acc + cur,
        0,
      );
      break;

    default:
      break;
  }

  switch ('number') {
    case typeof refundAmount:
      calculatedRefundAmount = refundAmount as number;
      break;

    case typeof refundRate:
      calculatedRefundAmount = Math.floor(
        originSalePrice * (refundRate as number) * 0.01,
      );

      break;

    case typeof cancelFeeRate:
      calculatedRefundAmount = Math.floor(
        originSalePrice * (1 - (cancelFeeRate as number) * 0.01),
      );
      break;

    case typeof cancelFeeAmount:
      calculatedRefundAmount =
        originSalePrice -
        Math.round(
          ((cancelFeeAmount as number) / originNetPrice) * originSalePrice,
        );

      break;

    default:
      throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_REQUIRED_FIELD, {
        parsedData,
      });
  }

  return calculatedRefundAmount;
};
