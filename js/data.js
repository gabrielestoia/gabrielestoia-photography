/* ============================================================
   SITE CONTENT — edit only this file (or use the CMS later).
   - Captions are optional: leave caption:'' to hide it.
   - To add photos: put the file in img/<folder>/ and add a row
     in the story's photos list with src and (optional) caption.
   - "group" is optional: stories with the same group name are
     shown under one heading in the sidebar index.
   ============================================================ */
const SITE = {
  name: "Gabriele Stoia",                   // shown in the menu and home
  aboutIntro: "Photographer. Reportage in a dozen countries since 2011. " +
              "Some of the work published in Italian and international outlets.",
  email: "contact@yourname.com",
  hero: "img/tibet/01.jpg",            // full-screen home photo

  stories: [
    {
      slug: "tibet",
      group: "Asia",
      title: "Title TBD",              // <-- replace
      meta: "Tibet · year TBD · 3 photos",
      intro: "",                       // optional intro text
      photos: [
        { src: "img/tibet/01.jpg", caption: "Pilgrims walking the Barkhor circuit, Lhasa." },
        { src: "img/tibet/02.jpg", caption: "" },
        { src: "img/tibet/03.jpg", caption: "Backstreet in the old quarter, at the end of the pilgrimage." }
      ]
    },
    {
      slug: "china",
      group: "Asia",
      title: "Title TBD",
      meta: "China · year TBD · 4 photos",
      intro: "",
      photos: [
        { src: "img/cina/01.jpg", caption: "Kitchen of a halal restaurant, Muslim quarter of Xi'an." },
        { src: "img/cina/02.jpg", caption: "" },
        { src: "img/cina/03.jpg", caption: "" },
        { src: "img/cina/04.jpg", caption: "The old quarter being demolished." }
      ]
    },
    {
      slug: "india",
      group: "Asia",
      title: "Title TBD",
      meta: "India · year TBD · 4 photos",
      intro: "",
      photos: [
        { src: "img/india/01.jpg", caption: "Chicken market, Kolkata." },
        { src: "img/india/02.jpg", caption: "" },
        { src: "img/india/03.jpg", caption: "" },
        { src: "img/india/04.jpg", caption: "Rickshaw puller on a break, Kolkata." }
      ]
    }
  ],

  published: [                         // publications (placeholder)
    { name: "Outlet · article title", year: "year" },
    { name: "Outlet · article title", year: "year" },
    { name: "Outlet · article title", year: "year" }
  ]
};
