"use client";

import { PdpModal } from "@/components/product/PdpModal";
import { FIT_TIPS, getSizeChart } from "@/lib/pdp-data";
import type { Product } from "@/lib/types";

/**
 * SizeGuide — measurement chart and fit guidance, in a dialog.
 *
 * Sits next to the size selector in the buy box. The chart is chosen from the
 * product's own size run (adult / kids / one-size) via `getSizeChart`, so the
 * table always matches the buttons the shopper is actually choosing from.
 *
 * The active size is highlighted, which turns an abstract table into a direct
 * answer to "which one do I pick?".
 */
export function SizeGuide({
  product,
  selectedSize,
  open,
  onClose,
}: {
  product: Product;
  /** Currently chosen size, highlighted in the table. */
  selectedSize: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const chart = getSizeChart(product);
  const inRange = (size: string) => product.sizes.includes(size);

  return (
    <PdpModal
      open={open}
      onClose={onClose}
      labelledBy="ap-size-guide-title"
      eyebrow="Find your fit"
      title="Size guide"
    >
      <p className="ap-body text-ink/70">{chart.fitNote}</p>

      {/* Chart — scrolls horizontally on narrow screens rather than squashing */}
      <div className="mt-7 -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
        <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
          <caption className="sr-only">Body measurements in inches per size</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="ap-eyebrow py-3 pr-4 font-medium text-ink">
                Size
              </th>
              {chart.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="ap-eyebrow py-3 pr-4 font-medium text-ink"
                >
                  {column} <span className="normal-case tracking-normal opacity-50">(in)</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => {
              const active = row.size === selectedSize;
              const offered = inRange(row.size);
              return (
                <tr
                  key={row.size}
                  className={
                    active
                      ? "bg-ink text-floral-900"
                      : "border-b border-line text-ink/75"
                  }
                >
                  <th
                    scope="row"
                    className={`py-3.5 pr-4 font-medium ${active ? "text-floral-900" : "text-ink"}`}
                  >
                    {row.size}
                    {!offered && active === false && (
                      <span className="ml-2 text-[0.625rem] uppercase tracking-widest opacity-40">
                        n/a
                      </span>
                    )}
                  </th>
                  {chart.columns.map((column) => (
                    <td key={column} className="py-3.5 pr-4 tabular-nums">
                      {row.measurements[column]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedSize && (
        <p role="status" className="ap-body mt-5 text-sm text-ink">
          You have selected{" "}
          <span className="font-medium text-ink">{selectedSize}</span> — its measurements are
          highlighted above.
        </p>
      )}

      {/* Fit guidance */}
      <div className="mt-9 border-t border-line pt-7">
        <h3 className="ap-eyebrow text-ink/45">Fit guidance</h3>
        <dl className="mt-5 flex flex-col gap-5">
          {FIT_TIPS.map((tip) => (
            <div key={tip.title}>
              <dt className="text-sm font-medium text-ink">{tip.title}</dt>
              <dd className="ap-body mt-1.5 text-sm text-ink/70">{tip.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PdpModal>
  );
}
