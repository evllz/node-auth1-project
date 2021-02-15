const router = require("express").Router();
const bcryp = require("bcryptjs");
const db = require("../users/users-model");

router.post("/register", async (req, res) => {
  const user = req.body;
  const hash = bcryp.hashSync(user.password, 10);
  user.password = hash;

  try {
    const save = await db.add(user);
    res.status(201).json(save);
  } catch (err) {
    res.status(500).json({ meesage: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.findBy({ username }).first();
    if (user && bcryp.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json(error);
  }
});

module.exports = router;
