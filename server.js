const express = require("express");
const app = express();
const debug = require("debug")("myapp:server");
const path = require("path");
const multer = require("multer");
const logger = require("morgan");
const serveIndex = require("serve-index");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage });

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/ftp",
  express.static("public"),
  serveIndex("public", { icons: true })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello from node file server" });
});

app.post("/testUpload", upload.single("file"), (req, res) => {
  debug(req.file);
  console.log("storage location is ", req.hostname + "/" + req.file.path);
  res.send(req.file);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server listening at PORT", PORT);
});
