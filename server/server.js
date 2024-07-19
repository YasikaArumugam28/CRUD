const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('./connection.js');
const Usermodel = require('./model.js');
const verifyToken = require('./verifyToken');

const app = express();
const SECRET_KEY = '5555';

app.use(cors());
app.use(bodyParser.json());

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

app.get('/', (req, res) => {
    res.send("I'm there");
});

app.post("/createuser", (req, res) => {
    Usermodel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.get("/users", (req, res) => {
    Usermodel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

app.get("/getuser/:id", (req, res) => {
    const { id } = req.params;
    Usermodel.findById(id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
});

app.put("/updateuser/:id", (req, res) => {
    const { id } = req.params;
    Usermodel.findByIdAndUpdate(id, {
        Name: req.body.Name,
        Email: req.body.Email,
        Age: req.body.Age
    }, { new: true })
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
});

app.delete('/deleteuser/:id', (req, res) => {
    const { id } = req.params;
    Usermodel.findByIdAndDelete(id)
        .then(() => res.json({ message: "User deleted successfully" }))
        .catch(err => res.json(err));
});

app.post('/login', async (req, res) => {
    const { Email } = req.body;
    try {
        const user = await Usermodel.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        const token = jwt.sign({ id: user._id, email: user.Email }, SECRET_KEY, { expiresIn: '5s' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await Usermodel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ Email: user.Email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
