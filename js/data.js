/* ============================================================
   FALLBACK CONTENT — used when content/site.json is missing
   (e.g. local preview). Online, content/site.json (edited via
   the CMS at /admin) takes over. Keep the two in sync when
   editing by hand.
   Translatable fields end with _en / _it.
   ============================================================ */
const UI = {
  en: { stories: "Stories", published: "Published", about: "About",
        enter: "Enter the stories", pub_note: "Selected publications.",
        commissions: "For commissions, prints or exhibitions:",
        prev: "Previous photo", next: "Next photo", close: "Close story",
        open_story: "Open story", from_story: "From the story",
        download_pdf: "Download PDF", no_pubs: "No publications yet." },
  it: { stories: "Storie", published: "Pubblicazioni", about: "Chi sono",
        enter: "Entra nelle storie", pub_note: "Pubblicazioni selezionate.",
        commissions: "Per commissioni, stampe o mostre:",
        prev: "Foto precedente", next: "Foto successiva", close: "Chiudi la storia",
        open_story: "Apri la storia", from_story: "Dalla storia",
        download_pdf: "Scarica il PDF", no_pubs: "Nessuna pubblicazione." }
};

const SITE = {
  name: "Gabriele Stoia",
  email: "contact@gabrielestoia.com",
  footer: "All content © Gabriele Stoia. All rights reserved.",
  bio_en: "Photographer. Reportage in a dozen countries since 2011. Some of the work published in Italian and international outlets.",
  bio_it: "Fotografo. Reportage in una dozzina di paesi dal 2011. Alcuni lavori pubblicati su testate italiane e internazionali.",
  socials: [
    { name: "Instagram", url: "https://instagram.com/" },
    { name: "Facebook", url: "https://facebook.com/" }
  ],
  stories: [
    {
      slug: "tibet",
      order: 10,
      group: "Asia",
      title_en: "Title TBD",
      title_it: "Titolo da definire",
      location: "Tibet",
      year: "year TBD",
      cover: "",
      description_en: "Three weeks in Lhasa, following the pilgrims' circuit around the Jokhang temple. A demo description: it now opens the story as a text slide.",
      description_it: "Tre settimane a Lhasa, seguendo il percorso dei pellegrini intorno al tempio Jokhang. Una descrizione dimostrativa: ora apre la storia come slide di testo.",
      items: [
        { type: "photo", image: "img/tibet/01.jpg",
          caption_en: "Pilgrims walking the Barkhor circuit, Lhasa.",
          caption_it: "Pellegrine lungo il percorso del Barkhor, Lhasa." },
        { type: "slide",
          text_en: "A demo text slide: use it between photos to pause the sequence and add context.",
          text_it: "Una slide di testo dimostrativa: usala tra le foto per fermare la sequenza e aggiungere contesto." },
        { type: "photo", image: "img/tibet/02.jpg", caption_en: "", caption_it: "" },
        { type: "photo", image: "img/tibet/03.jpg",
          caption_en: "Backstreet in the old quarter, at the end of the pilgrimage.",
          caption_it: "Vicolo del quartiere vecchio, alla fine del pellegrinaggio." }
      ]
    },
    {
      slug: "china",
      order: 20,
      group: "Asia",
      title_en: "Title TBD",
      title_it: "Titolo da definire",
      location: "China",
      year: "year TBD",
      cover: "",
      description_en: "",
      description_it: "",
      items: [
        { type: "photo", image: "img/cina/01.jpg",
          caption_en: "Kitchen of a halal restaurant, Muslim quarter of Xi'an.",
          caption_it: "Cucina di un ristorante halal, quartiere musulmano di Xi'an." },
        { type: "photo", image: "img/cina/02.jpg", caption_en: "", caption_it: "" },
        { type: "photo", image: "img/cina/03.jpg", caption_en: "", caption_it: "" },
        { type: "photo", image: "img/cina/04.jpg",
          caption_en: "The old quarter being demolished.",
          caption_it: "Il vecchio quartiere in demolizione." }
      ]
    },
    {
      slug: "india",
      order: 30,
      group: "Asia",
      title_en: "Title TBD",
      title_it: "Titolo da definire",
      location: "India",
      year: "year TBD",
      cover: "",
      description_en: "",
      description_it: "",
      items: [
        { type: "photo", image: "img/india/01.jpg",
          caption_en: "Chicken market, Kolkata.",
          caption_it: "Mercato del pollo, Calcutta." },
        { type: "photo", image: "img/india/02.jpg", caption_en: "", caption_it: "" },
        { type: "photo", image: "img/india/03.jpg", caption_en: "", caption_it: "" },
        { type: "photo", image: "img/india/04.jpg",
          caption_en: "Rickshaw puller on a break, Kolkata.",
          caption_it: "Tiratore di risciò in pausa, Calcutta." }
      ]
    }
  ],
  publications: [
    { story_title: "", magazine: "Outlet", article_title: "Article title",
      date: "Year", country: "", file: "" }
  ]
};
