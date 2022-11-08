export interface X2Y2OffersRequestResult {
  data: Offer[];
  next: any;
  success: boolean;
}

export interface Offer {
  amount: number;
  created_at: number;
  currency: string;
  end_at: number;
  erc_type: number;
  id: number;
  is_bundle: boolean;
  is_collection_offer: boolean;
  is_private: boolean;
  item_hash: string;
  maker: string;
  price: string;
  royalty_fee: number;
  side: number;
  status: string;
  taker: string;
  token: Token;
  type: string;
  updated_at: number;
}

export interface X2Y2ListingsRequestResult {
  data: Listing[];
  next: any;
  success: boolean;
}

export interface Listing {
  created_at: number;
  from_address: string;
  id: number;
  order: Order;
  to_address: any;
  token: Token;
  tx: any;
  type: string;
}

export interface Order {
  amount: number;
  created_at: number;
  currency: string;
  end_at: number;
  erc_type: number;
  id: number;
  is_bundle: boolean;
  is_collection_offer: boolean;
  is_private: boolean;
  item_hash: string;
  maker: string;
  price: string;
  royalty_fee: number;
  side: number;
  status: string;
  taker: any;
  type: string;
  updated_at: number;
}

export interface Token {
  contract: string;
  erc_type: string;
  token_id: string;
}
