const { Router } = require('express')
const axios = require('axios')
const router = new Router()
router.get('/crashes', async (req, res) => {
    try {
        let crashes = []
        const { data, status } = await axios.get('https://blaze.com/api/crash_games/recent/history')
        if (status === 200) crashes = data.records
        res.status(200).json(crashes)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;