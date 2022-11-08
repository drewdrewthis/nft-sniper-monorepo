import { Injectable } from '@nestjs/common';
import { groupBy } from 'lodash/fp';
import { NormalizedNftData, Token } from '../../types';

type PricesReturnType = unknown;
type OffersReturnType = unknown;

@Injectable()
export class X2y2Service {
  async fetchNormalizedTokenData(tokens: Token[]) {
    const data = await fetchTokenData(tokens);

    return normalizeData(data);
  }
}

// Helpers

async function fetchTokenData(tokens: Token[]) {
  const results = await Promise.allSettled(
    tokens.map(fetchIndividualTokenData),
  );

  const groups = groupBy((result) => {
    return result.status;
  }, results);

  console.warn('Failed to get data for the following: ', groups.rejected);

  return groups.fulfilled.map(
    (result) => (result as PromiseFulfilledResult<unknown>).value,
  );
}

async function fetchIndividualTokenData(token: Token) {
  const price = fetchPrice(token);
  const offers = fetchOffer(token);
}

async function fetchPrice(token: Token): Promise<PricesReturnType> {
  return fetch('');
}

async function fetchOffer(token: Token): Promise<OffersReturnType> {
  return fetch('');
}

function normalizeData(data: any): NormalizedNftData[] {
  return [];
}
