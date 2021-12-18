const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    //validate user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check user is exist
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Bu mail ile kayıt mevcut");

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Login
router.post('/login', async (req, res) => {
    //validate user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Kayıtlı mail bulunamadı");

    //check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Şifreniz yanlış");

    //create and assing a token
    const token = jwt.sign({ _id : user._id},process.env.TOKEN_SECRET);
    res.send({token: token});
});


module.exports = router;