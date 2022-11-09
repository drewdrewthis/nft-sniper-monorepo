import {
  X2Y2ListingsRequestResult,
  X2Y2OffersRequestResult,
} from '../../bullmq/types';
import { NormalizedNftData } from '../../types';
import { find, orderBy } from 'lodash/fp';

export function normalizeData(rawData: {
  tokenId: number;
  contractAddress: string;
  listings: X2Y2ListingsRequestResult['data'];
  offers: X2Y2OffersRequestResult['data'];
}): NormalizedNftData {
  const { listings, offers, tokenId, contractAddress } = rawData;
  const sortedListings = orderBy(['created_at'], ['desc'], listings);
  const latestValidListing = find((listing) => {
    return listing.order.status !== 'cancelled';
  }, sortedListings);

  return {
    url: `https://x2y2.io/eth/${rawData.contractAddress}/${rawData.tokenId}`,
    tokenId,
    contractAddress,
    marketplaceName: 'X2Y2',
    price: {
      priceAmount: String(latestValidListing?.order.price || ''),
      priceCurrency: 'ETH',
      fiatPrice: '',
      fiatCurrency: '',
    },
    offers: offers.map((offer) => ({
      from: offer.maker,
      priceAmount: offer.price,
      priceCurrency: 'ETH',
      fiatPrice: '',
      fiatCurrency: '',
    })),
    rawJson: rawData,
  };
}
