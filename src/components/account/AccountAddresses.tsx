import { AccountPanel } from "@/components/account/AccountPanel";
import { Button } from "@/components/ui/Button";
import { MapPinIcon } from "@/components/ui/icons";
import type { SavedAddress } from "@/lib/account-data";
import { pluralize } from "@/lib/utils";

/**
 * Saved addresses — delivery destinations as cards.
 *
 * Read-only by design: the data module is the seam, so when an edit form
 * ships it drops in behind the same header action without this layout
 * changing.
 */
export function AccountAddresses({ addresses }: { addresses: SavedAddress[] }) {
  return (
    <AccountPanel
      id="account-addresses"
      eyebrow="Addresses"
      title="Saved addresses"
      meta={pluralize(addresses.length, "address")}
      action={
        <Button href="/contact" variant="ghost" size="sm" withArrow>
          Update an address
        </Button>
      }
    >
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
          <MapPinIcon className="h-9 w-9 text-burnt" />
          <p className="ap-body max-w-sm text-sm text-ink/60">
            No saved addresses yet. Add one and checkout becomes a single
            step.
          </p>
          <Button href="/contact" variant="outline" size="sm" withArrow>
            Add an address
          </Button>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col border border-line bg-surface/50 p-5 transition-colors duration-300 hover:border-ash-400 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line bg-floral text-ash-300">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                {address.isDefault && (
                  <span className="ap-eyebrow rounded-full bg-ash-900 px-3 py-1 text-ash-200">
                    Default
                  </span>
                )}
              </div>

              <p className="mt-5 text-lg text-ink">{address.label}</p>
              <p className="ap-body mt-2 flex-1 text-sm text-ink/65">
                {address.name}
                <br />
                {address.lines.join(", ")}
                <br />
                {address.phone}
              </p>

              <p className="ap-eyebrow mt-5 border-t border-line pt-4 text-ink/40">
                {address.isDefault
                  ? "Used as your default delivery address"
                  : "Saved delivery address"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AccountPanel>
  );
}
