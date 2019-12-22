const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/:id', (req, res)=>{
  const queryText = `SELECT * FROM "movie" WHERE "id"=$1`;
  pool.query(queryText, [req.params.id])
    .then(result => {
      res.send(result.rows[0]);
    }).catch(err=>{
      console.log(err);
      res.sendStatus(500);
    })
});

router.put('/:id', (req, res)=>{
  const m = req.body;
  let movieInfo = [];
  if(m.title) movieInfo.push(['title', m.title]);
  if(m.description) movieInfo.push(['description', m.description]);

  let queryText = 'UPDATE "movie" SET';
  let config = [];
  for(let i=0; i<movieInfo.length; i++){
    queryText += ` ${movieInfo[i][0]}=$${config.length + 1}`;
    config.push(movieInfo[i][1]);
    if(i < movieInfo.length - 1){
      queryText += ',';
    }
  }
  queryText += `WHERE "movie"."id"=$${config.length + 1}`;
  config.push(req.params.id);
  pool.query(queryText, config)
    .then(result => {
      res.sendStatus(200);
    }).catch(err => {
      console.log(err);
      console.log(queryText);
      res.sendStatus(500);
    });
});

router.get('/', (req, res)=>{
  let queryText;
  let config = [];
  if(req.query.genre){
    queryText = `
      SELECT "movie"."id", "movie"."title", "movie"."poster",
        ${(req.query.noDescription === 'true')?'':'"movie"."description", '}
        "genre"."name" FROM "movie"
        JOIN "movie_genre" ON "movie"."id"="movie_genre"."movie_id"
        JOIN "genre" ON "genre"."id"="movie_genre"."genre_id"
      `;
    if(req.query.genre !== 'any' && req.query.genre !== 'all'){
      queryText += 'WHERE "genre"."name" ILIKE $1'
      config.push(req.query.genre);
    }
  } else {
    if(req.query.noDescription==='true'){
      queryText = 'SELECT "movie"."id", "movie"."title", "movie"."poster" FROM "movie"';
    }else{
      queryText = 'SELECT * FROM "movie"';
    }
  }
  
  if(req.query.order){
    switch(req.query.order){
      case 'title':
        queryText += ' ORDER BY "movie"."title"';
        break;
      case 'genre':
        if(req.query.genre) queryText += ' ORDER BY "genre"."name"';
        else queryText += ' ORDER BY "movie"."id"';
        break;
      default:
        queryText += '"movie"."id"';
        break;
    }
    if(req.query.orderReverse === 'true' || req.query.orderReverse === 'desc'){
      queryText += ' DESC';
    } else {
      queryText += ' ASC';
    }
  }

  pool.query(queryText, config)
    .then(result => {
      res.send(result.rows);
    }).catch( error => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;