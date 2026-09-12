SITO REPORTAGE — istruzioni
============================

Cosa c'e' dentro
----------------
index.html        pagina unica del sito (non serve modificarla)
css/style.css     aspetto grafico (colori, margini, font)
js/data.js        CONTENUTI: nomi, testi, caption, pubblicazioni
js/app.js         logica (non serve modificarla)
img/              le foto, una cartella per progetto

Come provarlo
-------------
Apri index.html con doppio clic nel browser. Funziona anche offline.

Come cambiare i nomi (ora sono segnaposto)
------------------------------------------
Apri js/data.js con un editor di testo (Bloc notes, TextEdit, VS Code):
- "Il tuo nome"          -> il tuo nome, in alto e nella home
- title / meta / intro   -> titolo, luogo-anno e testo di ogni storia
- caption                -> didascalia di una foto (facoltativa: lascia '')
- published              -> elenco delle pubblicazioni (testata, anno)
- email                  -> la tua email di contatto

Come aggiungere una foto a una storia
-------------------------------------
1. metti il file jpg in img/<nome-cartella-della-storia>/
2. in js/data.js, dentro quella storia, aggiungi una riga:
   { src: "img/<cartella>/05.jpg", caption: "" },

Come aggiungere una NUOVA storia
--------------------------------
In js/data.js copia un blocco intero { slug: ..., title: ..., ... },
cambia slug (nome-corto-usato-nell-indirizzo) e aggiungi le foto.
Poi crea la cartella img/<slug>/ con le immagini.

Tema chiaro/scuro
-----------------
Il visitatore lo cambia con l'icona in alto a destra;
la scelta viene ricordata alla visita successiva.

Come mettere il sito online (riassunto)
---------------------------------------
1. crea account gratuito su Netlify (netlify.com)
2. trascina nella pagina "Sites" la cartella intera del sito
3. il sito e' subito online con un indirizzo provvisorio
4. per il dominio personale: collega il dominio nelle impostazioni
   Netlify e aggiorna i DNS dal pannello del registrar
(il passo dettagliato lo facciamo insieme quando vuoi)
