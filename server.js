const express = require("express")
const app = express()
const fs = require("fs")
const request = require("request")
const bodyParser = require("body-parser")
const port = process.argv[2] || 5522

app.set("view engine", "ejs")

app.use(express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({ extended: false }))

const apiKey = "072c606f5fdaf837b484c0991a077f94"
const url1 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`

let topMovies = {
  method: "GET",
  url: `${url1}`,
  body: "{}"
}

request(url1, function(error, response, body) {
  let topMovie = JSON.parse(body)

  if (!topMovie.results || error) {
    console.log("error")
  } else {
    fs.writeFileSync("movie-data.JSON", body, "utf-8")
  }
  return topMovies
})

let movies = JSON.parse(fs.readFileSync("movie-data.JSON", 'utf8'))

app.get("/", (req, res) => {
  res.render("index", { movies })
})

app.get("/movies", (req, res) => {
  res.render("pages/movies", { movies })
})

app.get("/movies/:movieid", (req, res) => {
  let movieId = req.params.movieid

  for (let j=0; j<movies.results.length; j++) {
    if(movieId == movies.results[j].id) {
      res.render("pages/movies", { movies: movies.results[j] })
    }
  } res.send(404)
})

app.get("/search", (req, res) => {
  let searchId = req.query.search.toLowerCase()
  const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchId}`

  request(url2, function(error, response, body) {
    const movieInfo = JSON.parse(body)

    if (movieInfo) {
      alert('Error')
    } else if (!movieInfo.results[0] || error ) {
      res.send(404)
    } else {
      fs.writeFileSync("movie-data.JSON", JSON.stringify(body), "utf-8")
      res.render("pages/search", { movieInfo })
    }
    return
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
