const {Router} = require("express")


const MainRouter = Router()
MainRouter.use("/", async (req, res) => {
   try {
    res.status(200).json({
        message: "Welcome to the API of Melanie's Invitation"
    })
   } catch (error) {
    res.status(500).json({error: error.message})
   }
})

module.exports = MainRouter;