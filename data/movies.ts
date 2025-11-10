import { Movie } from '../types/movie';

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Grand Budapest Hotel",
    year: 2014,
    runtime: "1h 39m",
    genres: ["Comedy", "Drama", "Adventure"],
    description: "The adventures of Gustave H, a legendary concierge at a famous hotel from the fictional Republic of Zubrowka between the first and second World Wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    ratings: { imdb: 8.1, rt: 92, rtAudience: 86, tmdb: 8.1 },
    streaming: [
      { service: "HBO Max", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$3.99" }
    ]
  },
  {
    id: 2,
    title: "Everything Everywhere All at Once",
    year: 2022,
    runtime: "2h 19m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    ratings: { imdb: 8.0, rt: 95, rtAudience: 88, tmdb: 7.9 },
    streaming: [
      { service: "Paramount+", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$4.99" }
    ]
  },
  {
    id: 3,
    title: "Knives Out",
    year: 2019,
    runtime: "2h 10m",
    genres: ["Comedy", "Crime", "Mystery"],
    description: "A detective investigates the death of a patriarch of an eccentric, combative family.",
    poster: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    ratings: { imdb: 7.9, rt: 97, rtAudience: 92, tmdb: 7.9 },
    streaming: [
      { service: "Netflix", type: "subscription" },
      { service: "Hulu", type: "subscription" }
    ]
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    runtime: "2h 12m",
    genres: ["Thriller", "Drama", "Comedy"],
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    ratings: { imdb: 8.5, rt: 99, rtAudience: 90, tmdb: 8.5 },
    streaming: [
      { service: "Hulu", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$3.99" }
    ]
  },
  {
    id: 5,
    title: "Dune",
    year: 2021,
    runtime: "2h 35m",
    genres: ["Science Fiction", "Adventure"],
    description: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    ratings: { imdb: 8.0, rt: 83, rtAudience: 90, tmdb: 7.8 },
    streaming: [
      { service: "HBO Max", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$5.99" }
    ]
  },
  {
    id: 6,
    title: "The Shawshank Redemption",
    year: 1994,
    runtime: "2h 22m",
    genres: ["Drama", "Crime"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    ratings: { imdb: 9.3, rt: 91, rtAudience: 98, tmdb: 8.7 },
    streaming: [
      { service: "Netflix", type: "subscription" },
      { service: "Amazon Prime", type: "subscription" }
    ]
  },
  {
    id: 7,
    title: "Inception",
    year: 2010,
    runtime: "2h 28m",
    genres: ["Action", "Science Fiction", "Thriller"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    ratings: { imdb: 8.8, rt: 87, rtAudience: 91, tmdb: 8.4 },
    streaming: [
      { service: "HBO Max", type: "subscription" },
      { service: "Peacock", type: "subscription" }
    ]
  },
  {
    id: 8,
    title: "Interstellar",
    year: 2014,
    runtime: "2h 49m",
    genres: ["Adventure", "Drama", "Science Fiction"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    ratings: { imdb: 8.6, rt: 72, rtAudience: 86, tmdb: 8.4 },
    streaming: [
      { service: "Paramount+", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$3.99" }
    ]
  },
  {
    id: 9,
    title: "Barbie",
    year: 2023,
    runtime: "1h 54m",
    genres: ["Comedy", "Adventure", "Fantasy"],
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    ratings: { imdb: 7.0, rt: 88, rtAudience: 83, tmdb: 7.2 },
    streaming: [
      { service: "HBO Max", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$5.99" }
    ]
  },
  {
    id: 10,
    title: "Oppenheimer",
    year: 2023,
    runtime: "3h 0m",
    genres: ["Drama", "History"],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    ratings: { imdb: 8.5, rt: 93, rtAudience: 91, tmdb: 8.3 },
    streaming: [
      { service: "Peacock", type: "subscription" },
      { service: "Amazon Prime", type: "rent", price: "$5.99" }
    ]
  }
];

export const ALL_STREAMING_SERVICES = [
  "Netflix",
  "Hulu",
  "Disney+",
  "Amazon Prime",
  "HBO Max",
  "Apple TV+",
  "Paramount+",
  "Peacock",
  "Showtime",
  "Starz"
];
