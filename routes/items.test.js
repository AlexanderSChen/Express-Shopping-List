process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let cats = require("../fakeDb");

let meat = { name: "meat", price: "10.99" };

beforeEach(function() {
    items.push(meat);
});

afterEach(function() {
    // make sure this mutates, not redefines 'items'
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [meat] })
    })
})

describe("GET /items/:name", () => {
    test("Get an item by name", async () => {
        const res = await request(app).get(`/items/${meat.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: meat })
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/quetzalcoatyl`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: "banana", price: "2.50" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ item: { name: "banana", price: "2.50" } });
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({ price: "300" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Name is required")
    })
    test("Responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({ name: "axolotyl" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Price is required")
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
        const res = await request(app).patch(`/items/${meat.name}`).send({ name: "vegetables" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { name: "vegetables" } });
    })
    test("Updating an item's price", async () => {
        const res = await request(app).patch(`/items/${meat.name}`).send({ price: ".001" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { price: ".001" } });
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/fishsticks`).send({ name: "George Lopez" });
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/meat`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/poop`);
        expect(res.statusCode).toBe(404);
    })
})