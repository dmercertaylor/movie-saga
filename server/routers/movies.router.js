const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res)=>{
  let queryText;
  let config = [];
  if(req.query.genre){
    queryText = `
      SELECT "movie"."title", "movie"."poster",
        ${(req.query.noDescription === 'true')?'':'"movie"."description", '}
        "genre"."name" FROM "movie"
        JOIN "movie_genre" ON "movie"."id"="movie_genre"."movie_id"
        JOIN "genre" ON "genre"."id"="movie_genre"."genre_id"
        WHERE "genre"."name" ILIKE $1;
    `;
    config.push(req.query.genre);
  } else {
    if(req.query.noDescription==='true'){
      queryText = 'SELECT "movie"."title", "movie"."poster" FROM "movie"';
    }else{
      queryText = 'SELECT * FROM "movie"';
    }
  }
  
  if(req.query.order){
    queryText += ` ORDER BY $${config.length + 1}`;
    config.push(req.query.order);
    if(req.query.orderReverse){
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