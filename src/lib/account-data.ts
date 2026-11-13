/**
 * Account data that is not yet backed by the API.
 *
 * Orders now come from `src/api/orders/orders.api.ts`; only the saved-address
 * placeholder remains here until the backend exposes an address book.
 */

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  lines: string[];
  phone: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-home",
    label: "Home",
    name: "Aarav Patel",
    lines: ["14 Banyan Residency, 3rd Cross", "Indiranagar, Bengaluru 560038"],
    phone: "+91 98450 12345",
    isDefault: true,
  },
  {
    id: "addr-office",
    label: "Studio",
    name: "Aarav Patel",
    lines: ["AllPastels c/o, 2nd Floor, 88 Church Street", "Bengaluru 560001"],
    phone: "+91 98450 12345",
    isDefault: false,
  },
];

/** Saved delivery addresses for the signed-in account. */
export function getAddresses(): SavedAddress[] {
  return MOCK_ADDRESSES;
}
