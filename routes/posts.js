const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'ilk post',
            description: 'ilk postun açıklaması'
        }
    })
});

module.exports = router;