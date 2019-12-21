const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM "genre"';

  pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    }).catch(error => {
      console.log(error);
      res.send(500);
    });
});

router.get('/:movie', (req, res) => {
  const queryText = `
    SELECT "genre"."name" FROM "movie"
      JOIN "movie_genre" ON "movie"."id"="movie_genre"."movie_id"
      JOIN "genre" ON "genre"."id"="movie_genre"."genre_id"
      WHERE "movie"."title"=$1
  `
  pool.query(queryText, [req.params.movie])
    .then(result => {
      res.send(result.rows)
    }).catch(error=>{
      console.log(error);
      res.send(500);
    });
});

module.exports = router;