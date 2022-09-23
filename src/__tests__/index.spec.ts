import supertest from "supertest";
import app from "../index";

supertest(app);

const request = supertest(app);

describe("root endpoint", () => {
    it("should get 200 OK", async () => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
    });

    it("should get 404 Not Found", async () => {
        const response = await request.get("///");
        expect(response.status).toBe(404);
    });
});
