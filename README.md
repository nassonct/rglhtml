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

- `index.html`, `about.html`, `products.html`, `businesses.html`, `markets.html`,
  `contact.html`, `sell-your-produce.html`, `news.html`, `careers.html`,
  `privacy.html`, `terms.html`, and `404.html` are the main pages.
- `product-*.html` and `business-*.html` are individual product and business
  pages. `products-*.html` are the product category pages.
- `contact-*.html` preselect enquiry types on the contact form.
- `sw/` contains the Kiswahili equivalents of all static pages.
- `assets/css/styles.css`, `assets/js/main.js`, and `assets/img/` contain the
  site styles, progressive interactions, and images.

## Enquiry forms

Submitting a form opens a prefilled draft in the visitor's email application.
The visitor must review and send the message; the website does not transmit or
store it. Attachments must be added manually in the email application.

## Hosting

Deploy the files to any static web host. If using Apache, `.htaccess` sets the
HTML directory index and security headers; update its 404 path if the site is
installed somewhere other than `/rgl/`. The private `uploads/` directory is
retained from the prior deployment and remains blocked from web access.
