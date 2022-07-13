const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  res.json("Hello World!");
});

function getPagination(req) {
  const { perPage, cursor } = req.query;
  return {
    perPage: parseInt(perPage, 10) || 10,
    cursor: cursor || null,
  };
}

app.get("/posts", async (req, res) => {
  const { cursor, perPage } = getPagination(req);

  const total = await prisma.post.count();

  const posts = await prisma.post.findMany({
    take: perPage,
    skip: 1,
    ...(cursor
      ? {
          cursor: {
            id: cursor,
          },
        }
      : {}),
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({ posts, nextCursor: posts[posts.length - 1].id, total });
});

module.exports = app;
