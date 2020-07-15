const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex === -1) {
    return response
      .status(400)
      .json({ message: "Repositorio com o id informado não existente " });
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request;

  let repositoryOld = repositories[repositoryIndex];

  let repository = { ...repositoryOld, title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  validateRepositoryId,
  (request, response) => {
    const { repositoryIndex } = request;

    let repository = repositories[repositoryIndex];
    repository.likes += 1;
    repositories[repositoryIndex] = repository;

    return response.status(200).json(repository);
  }
);

module.exports = app;
