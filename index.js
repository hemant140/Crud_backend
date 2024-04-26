const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;


app.use(cors());
// MongoDB connection
mongoose.connect('mongodb+srv://hemohm579:FBzr9Uscmg38O3h9@crudoperations.ezgvkqq.mongodb.net/')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Not Connected to MongoDB', error)
    })



const dataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

}, { timestamps: true });

const UserData = mongoose.model('UserData', dataSchema);

// Middleware
app.use(express.json());

// Get all data API
app.get('/api/data', async (req, res) => {
    try {
        const allData = await UserData.find();
        res.json(allData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Add API
app.post('/api/add', async (req, res) => {
    console.log(req.body)
    const newData = new UserData(req.body.values);
    try {
        await newData.save();
        res.json({
            Status: 1,
            Message: "User Created Successfully"
        })

    } catch (error) {
        return res.status(500).send('Error Creating user');
    }
});

// Update API
app.put('/api/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const update = await UserData.findByIdAndUpdate(id, {
            $set: {
                firstName: req.body.values.firstName,
                lastName: req.body.values.lastName,
                role: req.body.values.role,
            }
        }, { new: true });

        if (!update) {
            return res.status(404).json({ error: 'Data not found' });
        }

        return res.status(200).json(update);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating data');
    }
});


// Count API
let addCount = 0;
let updateCount = 0;
app.get('/api/count', (req, res) => {
    res.json({ addCount, updateCount });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});