//global declaration
const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const cors = require('cors');
const multerS3 = require('multer-s3');
require('dotenv/config');
const path = require('path');
const bodyParser = require('body-parser');

//app declaration
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(bodyParser.json());
// local storage with multer
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000000,
  },
});

app.use('/profiles', express.static('upload/images'));

app.post('/uploadMultiple', upload.array('profile', 5), (req, res) => {
  profile_urls = req.files.map(
    (data) => `http://localhost:4000/profiles/${data.filename}`
  );
  console.log(profile_urls);
  res.json({
    success: 1,
    profile_urls,
  });
});

app.post('/uploadSingle', upload.single('profile'), (req, res) => {
  res.json({
    success: 1,
    profile_url: `http://localhost:4000/profiles/${req.file.filename}`,
  });
});

//S3 upload with multer multer-s3 aws-sdk

// aws.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   accessSecretKey: process.env.S3_SECRET_KEY,

//   region: 'ap-south-1',
// });

const creds = new aws.Credentials(
  process.env.S3_ACCESS_KEY,
  process.env.S3_SECRET_KEY
);

const s3 = new aws.S3({
  credentials: creds,
  region: 'ap-south-1',
});

const uploadMulter = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'my-testing-bucket123',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

app.post('/uploadS3Single', uploadMulter.single('profile'), (req, res) => {
  try {
    res.json({
      success: 1,
      profile_url: req.file.location,
    });
  } catch (err) {
    console.log(err, 'errr');
  }
});

app.post('/uploadS3Multiple', uploadMulter.array('profile', 5), (req, res) => {
  profile_urls = req.files.map((data) => data.location);
  res.json({
    success: 1,
    profile_urls,
  });
});

// function errHandler(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     res.json({
//       success: 0,
//       message: err.message,
//     });
//     next();
//   } else {
//     next();
//   }
// }
// app.use(errHandler);

app.listen(4000, () => {
  console.log('server up and running');
});
