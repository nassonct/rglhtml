# Raphael Group Limited website

A bilingual static website built with HTML, CSS and vanilla JavaScript. It has
no build step, PHP runtime, database, or server-side form handler.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server.
For example, from this directory run `python -m http.server 8000` and visit
`http://localhost:8000/`.

The English edition is in the project root. Kiswahili pages are in `sw/`; the
language switcher links between matching pages in both editions.

## Structure

- `index.html` and `sw/index.html` are the English and Kiswahili homepages.
- `pages/en/` and `pages/sw/` organize the remaining pages by topic:
  `products/`, `businesses/`, `contact/`, and `company/`.
- `404.html` and `sw/404.html` are the custom not-found pages.
- `assets/css/`, `assets/js/`, and `assets/img/` contain shared styles,
  progressive interactions, and images.
- `uploads/` contains a retained private upload and must not be published
  unprotected. Apache deployments are denied access by its `.htaccess` file;
  other hosts must apply an equivalent deny rule or omit the directory.

Grouped pages now use `/pages/en/...` and `/pages/sw/...` URLs. If older page
URLs have already been published or indexed, configure permanent redirects
from those URLs on the hosting platform before launch.

## Enquiry forms

Submitting a form opens a prefilled draft in the visitor's email application.
The visitor must review and send the message; the website does not transmit or
store it. Attachments must be added manually in the email application.

## Hosting

Deploy the repository root as the site document root on a static host. The
included `.htaccess` applies security headers, disables directory listings,
blocks `uploads/`, and configures the custom 404 page on Apache; `.htaccess` is
ignored by many other hosts, which need equivalent settings in their hosting
configuration. If the site is hosted below a URL prefix, update the Apache
`ErrorDocument` path accordingly.

Use HTTPS in production. Configure HTTPS redirects and HSTS at the hosting
provider after confirming the domain and TLS setup. Enquiry forms open a draft
in the visitor's email application; they do not submit to a server.
