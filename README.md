# Raphael Group Limited website

A bilingual static website built with HTML, CSS and vanilla JavaScript. It has
no build step, PHP runtime, database, or server-side form handler.

## Run locally

Serve this folder with any static web server to test fetch-based partner,
market and gallery manifests. For example, from this directory run
`python -m http.server 8000` and visit `http://localhost:8000/`.

The English and Kiswahili homepages are `index.html` and `sw/index.html`.
Content pages are grouped under `pages/en/` and `pages/sw/`.

## Structure

- `index.html` and `sw/index.html` are the English and Kiswahili homepages.
- `pages/en/` and `pages/sw/` organize the remaining pages by topic:
  `products/`, `businesses/`, `contact/`, and `company/`.
- `404.html` and `sw/404.html` are the custom not-found pages.
- `assets/css/`, `assets/js/`, and `assets/img/` contain shared styles,
  progressive interactions, and images.
- `assets/data/markets.json` and `assets/data/gallery.json` are editable
  content manifests. `assets/partners/partners.json` lists approved partner
  logo filenames stored in that folder; static hosting cannot safely discover
  directory contents without an explicit manifest.
- `assets/gallery/Community Engagement/`, `assets/gallery/Farmers Training/`,
  and `assets/gallery/Official Visitors/` contain the gallery photos. Keep
  their file lists in `assets/data/gallery.json` in sync when adding or
  removing photos. The gallery initially displays up to eight photos at a
  time; visitors can load more in batches.
- `uploads/` is reserved for private uploads, is excluded from new Git changes,
  and is denied by its `.htaccess` file on Apache. Static hosts must not publish
  files from this folder.

Grouped pages use `/pages/en/...` and `/pages/sw/...` URLs. Small legacy URL
pages preserve the previous `.html` paths and immediately forward to the new
locations. Apache also sends permanent redirects. Keep both mechanisms while
the old paths may be bookmarked or indexed.

## Enquiry forms

Submitting a form opens a prefilled draft in the visitor's email application.
The visitor must review and send the message; the website does not transmit or
store it. Attachments must be added manually in the email application.

## Hosting

Deploy the repository root as the site document root on a static host. The
included `.htaccess` applies security headers, disables directory listings,
blocks `uploads/`, and configures the custom 404 page on Apache; `.htaccess` is
ignored by many other hosts, which need equivalent settings in their hosting
configuration. The current Apache rewrite base is `/rglhtml/`; update that base
and the 404 path if deploying at a different URL prefix.

Use HTTPS in production. Configure HTTPS redirects and HSTS at the hosting
provider after confirming the domain and TLS setup. Enquiry forms open a draft
in the visitor's email application; they do not submit to a server.
GitHub Pages ignores `.htaccess`; never commit private uploads there. A file
removed from the latest deployment can still exist in older Git history or
browser caches. If any previously published upload is confidential, remove it
from repository history and request cache invalidation before considering the
exposure resolved.

## Updating content

- Add approved partner logos under `assets/partners/` and add a `name` and
  `logo` filename entry to `assets/partners/partners.json`.
- Add approved, optimized gallery photos under `assets/gallery/` and add
  category, image path, alternative text and captions in both languages to
  `assets/data/gallery.json`.
- Add a branch to the appropriate region's `branches` array in
  `assets/data/markets.json` only after its official name, physical address,
  office phone, services and any map URL have been verified.

## CMS status

There is no PHP/MySQL backend or authenticated administration system in this
project. Do not publish an open static admin page: GitHub Pages cannot protect
credentials or perform secure content writes. A CMS requires a separately
configured PHP-enabled host, HTTPS, a private database configuration,
administrator provisioning, authenticated sessions, CSRF protection, upload
validation and backups. The public site remains deployable without that
backend; content manifests are edited and deployed as static files for now.

## Search and launch checklist

The root `sitemap.xml` and `robots.txt` use the published GitHub Pages project
URL. Update them and page canonical URLs if the production domain changes.
The website's existing contact forms open a `mailto:` draft; they do not
provide server-side spam protection or a server-processed submission workflow.
The upload directory is denied on Apache, but non-Apache hosts must omit it or
apply an equivalent access-control rule. Configure HTTPS, permanent redirects
and response headers at the provider when Apache configuration is unavailable.
