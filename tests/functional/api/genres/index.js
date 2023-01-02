import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Genre from "../../../../api/genres/genreModel";
import api from "../../../../index";
import genres from "../../../../seedData/genres";

// set up seed data for datastore
const expect = chai.expect;
let db;

describe("Genres endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Genre.deleteMany();
      await Genre.collection.insertMany(genres);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/genres/local ", () => {
    it("should return 4 genres and a status 200", () => {
      request(api)
        .get("/api/genres/local")
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(4);
        });
    });
  });
  describe("GET /api/genres/tmdb ", () => {
    it("should return a list of genres and a status 200", () => {
      request(api)
        .get("/api/genres/tmdb")
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property("genres");
          expect(res.body.genres.length).to.equal(19);
        });
    });
  });
});