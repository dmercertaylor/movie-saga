# Movie Collection App

## Description

A running version of this app can be viewed at https://dmt-movie-demo.herokuapp.com/

This app contains the genres and descriptions of various movies. Click on a genre to see only movies of that genre, or click the details button on any movie to see a full description. From the description page, the edit button can be found in the upper right corner, which will let the user add or remove genres, as well as edit the movie's title and description.

## Setup

Hosting this project requires Node.js, as well as the ability to create and connect to a Postgres database. The command to build the database will vary from system to system, but in bash, it will likely be along the lines of `psql -U postgres < database.sql`, or using whatever superuser name in place of postgres. To run the server and client, simply run `npm run server` and `npm run client` from the root folder, after running `npm install`.

## Tools Used

This app was made using Express, React, Redux, Sagas, and Material-UI, as well as Postgres for the database.

## Challenges

My greatest challenge in putting this app together was simply maintaining an organized code base. This is, in fact, still a work in progress, as the EditPage component will likely be broken up into smaller pieces in the near future. Much of this disorganization resulted from challenges with state management, which is an area I will continue to grow on as I gain more experience on larger projects.