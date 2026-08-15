# Georgetown Islamic Center — website

A static website for **Georgetown Islamic Center (GIC)**, a 501(c)(3)
masjid and Islamic education center at 7275 Co Rd 110, Round Rock, TX 78665,
serving Georgetown, Round Rock, and Hutto, Texas.

Live site (once Pages is enabled): <https://akaban01.github.io/gic-web/>

## What's here

Plain HTML, CSS, and one JavaScript file — no framework, no build step. Edit
the `.html` files directly and push.

```
index.html          Home — hero, prayer times, Jumu'ah (#jumuah), mission,
                       programs, DUA, funeral support, giving, map
about.html           Our story, vision, the 2018–2025 timeline, governance
education.html        Quran/Hifz enrolment details, seminary, Sunday School, DUA
services.html         Funeral coordination, Nikkah/marriage, Imam appointments
events.html            Dated events + recurring programs (classes live on
                       education.html, not here)
resources.html         Understanding Islam, new-Muslim resources, forms &
                       requests (letters, policies, applications)
donate.html            Ways to give, funds, and the loan payoff campaign
contact.html           Address, phone, email, map, first-visit guidance
assets/css/site.css    Design system (light + dark theme)
assets/js/site.js      Nav, theme toggle, prayer times + countdown
```

## Where the content comes from

Facts on this site — address, phone, email, prayer/Jumu'ah times, program
names, the 2018–2025 timeline, EIN, and donation methods — were taken from
GIC's own published site at [gicmasjid.org](https://www.gicmasjid.org/) as of
August 2026. This project is an independent, redesigned rebuild inspired by
that site; it is not gicmasjid.org itself. A few destinations that require a
live account or a document GIC hosts privately (Mohid portal, PayPal/Venmo
links, bylaws PDF, various forms) are routed to `info@gicmasjid.org` instead
of a guessed URL, so nothing links out to a fabricated address.

## Events and flyers

gicmasjid.org is a JavaScript app, so nothing useful is in its page source.
Its content comes from two JSON endpoints, which are the practical way to
check what the masjid is currently publishing:

```
https://www.gicmasjid.org/api/prayer-times
https://www.gicmasjid.org/api/events
```

`/api/events` returns each event's title, `imageUrl` (the flyer), and
registration link. The flyers themselves carry the real detail — dates,
times, ages, tuition, instructors — which is transcribed into the cards on
`events.html`, since an image alone is not readable to search engines or
screen readers.

The six flyers live in `assets/img/events/` as WebP, resized to 1000px wide
(~700 KB for the set; the originals total ~5 MB). To refresh them:

1. `curl -s https://www.gicmasjid.org/api/events | python3 -m json.tool`
2. Download each `imageUrl` (prefix with `https://www.gicmasjid.org`).
3. Resize to 1000px wide and save as WebP quality 82 into `assets/img/events/`.
4. Update the matching card text in `events.html` — and the summary list in
   the `#events` section of `index.html` — from what the flyer actually says.

Flyer thumbnails open full size in a `<dialog>` lightbox (`data-flyer` in
`site.js`). Without JavaScript the thumbnail is still a plain link to the
image, so it keeps working.

## Prayer times

`assets/js/site.js` holds a hard-coded `SCHEDULE` object with GIC's own
published Adhan and Iqamah times (not a calculated/API estimate — GIC posts
exact times, so those are used directly) and runs a live countdown to the
next Iqamah in `America/Chicago`. **Update the `SCHEDULE` object whenever the
masjid posts a new monthly timetable.**

Jumu'ah timings are hard-coded in the HTML because they are fixed and
published: 1st khutbah 2:00 PM / salah 2:30 PM, 2nd khutbah 3:00 PM / salah
3:30 PM. They appear in three places — the hero prayer card's strip, the
`#jumuah` section on the home page, and the Jumu'ah row on `contact.html` —
so update all three together.

GIC's own site serves its schedule from `https://www.gicmasjid.org/api/prayer-times`
(its front end is a JS app, so the times are not in the page source). That
endpoint is the quickest way to check the current timetable before editing
`SCHEDULE`.

## Deploying

`.github/workflows/pages.yml` builds and deploys on every push to `main`. It
needs Pages turned on once, by hand:

**Settings → Pages → Build and deployment → Source: _GitHub Actions_**

Then re-run the workflow (Actions → Deploy to GitHub Pages → Run workflow).

The workflow's `GITHUB_TOKEN` cannot create the Pages site itself
("Resource not accessible by integration") — that first switch has to be
flipped by a repository admin. After that, the setting sticks and every push
deploys automatically.

If you later point a custom domain at the site, add a `CNAME` file containing
the domain and update the `SITE`/canonical references in `sitemap.xml`,
`robots.txt`, and the `<link rel="canonical">` / Open Graph tags in each page.

## Editing notes

- Colours, spacing, and typography live as CSS custom properties at the top
  of `assets/css/site.css` — deep green (`--green`) and gold (`--gold`),
  echoing GIC's own brand.
- Light and dark themes are both defined; the toggle in the header stores a
  preference in `localStorage`, and the system preference is respected
  otherwise.
- Fonts are Playfair Display (display) and Plus Jakarta Sans (body) — the
  same pair used on gicmasjid.org — loaded from Google Fonts.
- The map is a keyless Google Maps embed (`maps.google.com/maps?q=...&output=embed`).
- No contact form submits anywhere — every "Request" or "Submit" action is a
  `mailto:` link, since there's no backend to receive form data.
