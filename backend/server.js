require("dotenv").config();

const accidentRoutes = require("./routes/accidents.routes");
const regionRoutes = require("./routes/regions.routes");
const metadataRoutes = require("./routes/metadata.routes");
const populationRoutes = require("./routes/populations.routes");
const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//base URL
app.use("/accidents", accidentRoutes);
app.use("/regions", regionRoutes);
app.use("/metadata", metadataRoutes)
app.use("/population", populationRoutes)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
