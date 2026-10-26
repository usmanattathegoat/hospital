# Northfield Medical Center — Hospital Website

A professional, responsive two-page hospital website built with Tailwind CSS and vanilla JavaScript.

## Pages
| File | Description |
|------|-------------|
| `index.html` | Home: hero, quick access, stats, departments, about, doctors, testimonials, CTA |
| `appointment.html` | Booking form with validation, contact info, clinic hours, FAQ, map |

## Structure
```
hospital-website/
├── index.html
├── appointment.html
└── assets/
    ├── css/styles.css
    ├── js/tailwind.config.js
    ├── js/main.js
    └── images/favicon.svg
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
npx serve .
# or
python -m http.server 8000
```

## Features
- Fully responsive with a mobile menu
- Scroll-reveal animations and animated counters
- Department links pre-select the booking form (`?department=cardiology`)
- Form validation (past dates and Sundays blocked) with a success modal
- Accessible: skip link, ARIA states, focus rings, reduced-motion support

## Production note
The Tailwind Play CDN is ideal for prototyping. For production, install Tailwind CLI,
move `tailwind.config.js` content into a standard config, and compile a minified CSS file.

## Customize
- Colors and fonts: `assets/js/tailwind.config.js`
- Doctors per department: the `DOCTORS` object in `assets/js/main.js`
- Images: Unsplash placeholders; replace them with your own photos in `assets/images/`
