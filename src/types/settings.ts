/** Checkout pricing rules exposed by the public backend settings endpoint. */
export interface CheckoutSettings {
  shipping: {
    flatRate: number;
    freeShippingThreshold: number | null;
  };
  tax: {
    ratePercent: number;
  };
}
