const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/:movieId', (req, res) => {
  const queryText = `
    SELECT "genre"."id", "genre"."name" FROM "movie"
      JOIN "movie_genre" ON "movie"."id"="movie_genre"."movie_id"
      JOIN "genre" ON "genre"."id"="movie_genre"."genre_id"
      WHERE "movie"."id"=$1
  `
  pool.query(queryText, [req.params.movieId])
    .then(result => {
      res.send(result.rows);
    }).catch(error=>{
      console.log(error);
      res.send(500);
    });
});

router.delete('/:movieId/:genreId', (req, res) => {
  const queryText = `DELETE FROM "movie_genre" WHERE "movie_id"=$1 AND "genre_id"=$2`

  pool.query(queryText, [req.params.movieId, req.params.genreId])
    .then(result => {
      res.sendStatus(200);
    }).catch(err=>{
      console.log(err);
      res.sendStatus(500);
    })
});

router.post('/', (req, res)=>{
  let queryText = `SELECT "genre"."name" FROM "genre" WHERE "genre"."name" ILIKE $1`
  pool.query(queryText, [req.body.genre])
    .then(result => {
      if(result.rows.length === 0){
        pool.query('INSERT INTO "genre" ("name") VALUES ($1)', [req.body.genre])
          .then(result => {
            res.sendStatus(200);
          }).catch(err => {
            res.sendStatus(500);
            console.log('Error at insert', err);
          })
      } else {
        res.sendStatus(400);
      }
    }).catch(err=>{
      console.log('error at select', err);
      res.sendStatus(500);
    })
});

router.get('/get_id/:genreName', (req, res)=>{
  const queryText = 'SELECT "genre"."id" FROM "genre" WHERE "genre"."name" = $1';
  pool.query(queryText, [req.params.genreName])
    .then(result => {
      res.send(result.rows);
    }).catch(err=>{
      console.log(err);
      res.sendStatus(500);
    });
});

router.post('/movie_genre', (req, res)=>{
  let queryText = `INSERT INTO "movie_genre" ("movie_id", "genre_id") VALUES`;
  let config = [];
  if(!Array.isArray(req.body)){
    res.sendStatus(400);
    return;
  }
  for(let i=0; i<req.body.length; i++){
    queryText += ` ($${(i*2)+1}, $${(i*2)+2})`;
    config.push(req.body[i].movieId, req.body[i].genreId);
  }

  pool.query(queryText, config)
    .then(result => {
      res.sendStatus(200);
    }).catch(err=>{
      res.sendStatus(500);
      console.log(queryText);
      console.log(err);
    })
});

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

module.exports = router;