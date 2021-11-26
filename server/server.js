const express = require("express");
const cors = require("cors");
const knex = require("knex");

//when using latest bcrypt, an deploy error always happern
//Error: /app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: invalid ELF header
//.gitignore to ingnore node_modules, let remote run npm install does not solve problem.
//stackoverflow solution:  bcryptjs is the pure-javascript version of bcrypt.
//Just think of it as a light version of bcrypt.
//While bcrypt requires native compiler to compile,
//bcryptjs does not.bcrypt is about 1.3 times faster than
//bcryptjs.thats the major difference.
// npm uninstall --save bcrypt
// npm install --save bcryptjs

const bcrypt = require("bcryptjs");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "",
//     password: "",
//     database: "embcryo",
//   },
// });

// const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(cors());

//add a middleware to verify token sent in headers
app.use((req, res, next) => {
  if (req.url === "/signin" || req.url === "/") return next();
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

    // try {
    // console.log("process.env", process.env);
    // verify makes sure that the token hasn't expired and has been issued by us
    //   result = jwt.verify(token, process.env.JWT_SECRET);
    //if not valid , will throw an error which will be caught by try {}
    // Let's pass back the decoded token to the request object
    //req.decoded = result;
    // We call next to pass execution to the subsequent middleware
    //   next();
    // } catch (err) {
    // Throw an error just in case anything goes wrong with verification
    //   throw new Error(err);
    // }
  } else {
    result = {
      error: `Authentication error. Token required.`,
      status: 401,
    };
    res.status(401).send(result);
  }
});

app.get("/", (req, res) => {
  res.json("server is working");
});

app.post("/search", (req, res) => {
  const { id, name, tank } = req.body;
  let col = id
    ? { id }
    : name
    ? { name }
    : tank
    ? { tank: tank.toUpperCase(), thaw_day: "" }
    : {};
  if (tank.length === 2) {
    col = { tank: tank[0].toUpperCase(), canister: tank[1], thaw_day: "" };
  }
  return db("embryo")
    .where(col)
    .orderBy("embryo_id")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/search-last50", (req, res) => {
  return db("embryo")
    .orderByRaw("embryo_id desc limit 50")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/search-last5years", (req, res) => {
  return db("embryo")
    .select("id", "opu_day", "thaw_day", "quantity")
    .orderBy("embryo_id")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/freeze/fetchbyid", (req, res) => {
  const { id } = req.body;
  return db("embryo")
    .where({ id })
    .andWhere({ thaw_day: "" })
    .orderBy("embryo_id")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/freeze/fetchlatest", (req, res) => {
  return db("embryo")
    .select("embryo_id", "tank")
    .where("embryo_id", "=", db("embryo").max("embryo_id"))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/freeze/fetchtank", (req, res) => {
  //db("embryo")
  //.distinct("id", "tank", "canister", "cane")  logic needed in front to calculate count
  //.distinct(db.raw(`id, cane, tank ||''|| canister as loc`));
  // ! Group By make things easy ↓
  db.raw(
    `SELECT loc, count(cane) 
    FROM (SELECT DISTINCT id, tank || canister AS loc, cane FROM embryo WHERE thaw_day = '') AS result 
    GROUP BY loc`
  )
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/freeze/insert", (req, res) => {
  const { data } = req.body;
  return db("embryo")
    .insert(data)
    .then((resMessage) => {
      console.log(resMessage);
      res.json(resMessage);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

app.post("/thaw/update", (req, res) => {
  const { data, embryo_id } = req.body;
  return db("embryo")
    .update(data)
    .where({ embryo_id })
    .then((resMessage) => {
      res.json(resMessage);
      //result will be row number get updated  => 1
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/expire/searchexpire", (req, res) => {
  const { expire_day } = req.body;
  const sql = `SELECT id, name, birthday, opu_day, count(quantity) AS embryo_num, extend_times, mail_day 
      from embryo WHERE expire_day = '${expire_day}' AND thaw_day = '' 
      GROUP BY id, name, birthday,opu_day, extend_times, mail_day ORDER BY opu_day;`;
  return db
    .raw(sql)
    .then((resMessage) => {
      res.json(resMessage.rows);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/expire/searchid", (req, res) => {
  const { id } = req.body;
  const sql = `SELECT expire_day, name, birthday, opu_day, count(quantity) AS embryo_num, extend_times, mail_day 
      from embryo WHERE id = '${id}' AND thaw_day = '' 
      GROUP BY expire_day, name, birthday,opu_day, extend_times, mail_day ORDER BY opu_day;`;
  return db
    .raw(sql)
    .then((resMessage) => {
      res.json(resMessage.rows);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/expire/updatemail", (req, res) => {
  const { mail_day, id, opu_day } = req.body;
  return db("embryo")
    .update({ mail_day })
    .where({ id, opu_day })
    .andWhere({ thaw_day: "" })
    .then((resMessage) => {
      res.json(resMessage);
      //result will be row number get updated
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/expire/updateexpireday", (req, res) => {
  const { expire_day, extend_times, id, opu_day } = req.body;
  return db("embryo")
    .update({ expire_day, extend_times })
    .where({ id, opu_day })
    .andWhere({ thaw_day: "" })
    .then((resMessage) => {
      res.json(resMessage);
      //result will be row number get updated
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/modify/search", (req, res) => {
  const { embryo_id } = req.body;
  return db("embryo")
    .where({ embryo_id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/modify/update", (req, res) => {
  const { data, embryo_id } = req.body;
  return db("embryo")
    .update(data)
    .where({ embryo_id })
    .then((resMessage) => {
      res.json(resMessage);
      //result will be row number get updated  => 1
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json("incorrect form submission");
  }
  return db
    .select("user", "hash")
    .from("login")
    .where({ user: username })
    .then((data) => {
      // bcrypt.hash("yourstring", saltRounds, function (err, hash) {
      //   console.log(hash);
      // });
      bcrypt.compare(password, data[0].hash, function (err, result) {
        // result == true if match
        if (err) return console.log(err);
        if (result) {
          const token = jwt.sign({ username }, process.env.JWT_SECRET);
          res.json({ login: "success", token });
        } else {
          res.json("fail");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("-Error-");
    });
});

app.get("/backup/search", (req, res) => {
  return db("embryo")
    .orderBy("embryo_id")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/backup/recover", (req, res) => {
  const { data } = req.body;
  return db
    .transaction((trx) => {
      return trx("embryo")
        .truncate()
        .then(() => {
          return trx("embryo").insert(data);
        })
        .then((resMessage) => res.json(resMessage));
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json(err);
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
