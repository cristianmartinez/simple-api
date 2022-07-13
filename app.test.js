const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("supertest");
const app = require("./app");
const { map, range } = require("ramda");

async function createPost(user, index) {
  // create post in the database
  return await prisma.post.create({
    data: {
      title: "Post " + index,
      content: "Content post",
      userId: user.id,
    },
  });
}

describe("index.js", () => {
  let user;

  beforeEach(async () => {
    await prisma.post.deleteMany({});
    user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "",
        password: "",
      },
    });
  });

  it("should return all posts paginated", async () => {
    const posts = await Promise.all(
      map((i) => createPost(user, i), range(0, 20))
    );

    await request(app)
      .get("/posts")
      .query({ page: 1, perPage: 10, cursor: posts[9].id })
      .expect(200)
      .expect((res) => {
        expect(res.body.posts).toHaveLength(10);
        expect(res.body.posts[0].userId).toBe(user.id);
      });
  });
});
