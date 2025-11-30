import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Collection API",
      version: "1.0.0",
    },
  },
  apis: ["./swagger.js"],
};

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Returns all movies, filtered by optional query parameters.
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of movies.
 */

/**
 * @openapi
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */

/**
 * @openapi
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - director
 *               - year
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Invalid input or movie already exists
 */

/**
 * @openapi
 * /movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Movie not found
 */

/**
 * @openapi
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
