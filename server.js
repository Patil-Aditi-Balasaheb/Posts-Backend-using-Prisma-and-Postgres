import "dotenv/config"
import express from 'express'
import routes from "./routes/index.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(routes);

app.get("/", (req, res) => {
    return res.send("Hii, this is Posts Backend")
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))