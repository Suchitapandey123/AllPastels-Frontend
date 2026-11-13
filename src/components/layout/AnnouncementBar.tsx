import { announcements } from "@/data/site";

/**
 * AnnouncementBar — a slim band above the navbar carrying rotating
 * service messages.
 *
 * Static by design: the messages cross-fade on a CSS-only loop rather than
 * pulling in a carousel or a timer, so it costs no JavaScript. The track is
 * duplicated once purely so the -50% marquee loops seamlessly.
 */
export function AnnouncementBar() {
  return (
    <div className="ap-announce relative overflow-hidden bg-ash-100 text-floral">
      <div className="ap-anim-marquee flex w-max" role="region" aria-label="Store announcements">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {announcements.map((message) => (
              <li
                key={message}
                className="ap-eyebrow flex items-center whitespace-nowrap px-6 py-2.5 text-floral-700/90"
              >
                {message}
                <span aria-hidden="true" className="ml-6 text-cotton/70">
                  •
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
