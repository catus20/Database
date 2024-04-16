const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('database.db');

// Lar oss bruke filene i mappa "public"
app.use(express.static('public'));
app.set('view engine', 'ejs'); // Lar oss hente ut HTML-koden frå filene i "views" mappa
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { // dette er den som bestemmer kva som skal vises på startsida.
  res.render('home');  //henter ut "home.ejs" fila i mappa "views"
});

app.post('/songs', (req, res) => {
  const genre = req.body.genre;

  const query = 'SELECT * FROM songs WHERE sjanger = ?';
  db.all(query, [genre], (error, songs) => {  // denne metoden henter ut informasjon frå databasen basert på spørringen over
    if (error) {
      console.error('Feil ved henting av sanger fra databasen:', error);
      res.status(500).send('Feil ved henting av sanger fra databasen');
    } else {
      console.log(songs); // Logg resultatet fra databasen

      if (Array.isArray(songs)) { // dersom ein får ut ein array av sanger, sender koden sangene videre til siden "/songs" i "views" mappa
        res.render('songs', { songs });
      } else {
        res.status(500).send('Feil ved henting av sanger fra databasen');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});