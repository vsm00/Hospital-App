const express = require('express');
const fs = require('fs');
const app = express();
const data = require('./hospital.json');
app.use(express.json());

// ...................................Read Operation(GET)......................................
app.get('/hospital', (req, res) =>  res.send(data));

//...................................Create Operation(POST)......................................
app.post('/hospital', (req, res) => {
    data.push(req.body);
    fs.writeFile("hospital.json", JSON.stringify(data), (err, resp) => {
        if (err) {
            res.send('Data cannot be writtten');

        } else {
            res.send('Data Entered');
        }
    })
});

//...................................Update/Replace Operation(PUT)......................................
app.put('/hospital/:name', (req, res) => {
    let name = req.params.name;
    data.forEach((item) => {
        if (item.name == name) {
            item.patient_count = req.body.patient_count;
            item.location = req.body.location;
        }
    })

    fs.writeFile("hospital.json", JSON.stringify(data), (err, resp) => {
        if (err) {
            res.send("Data could not be updated");
        } else res.send("Data updated");
    })
});

//...................................Delete Operation(DELETE)......................................
app.delete('/hospital/:name', (req, res) => {
    let name = req.params.name;
    let value = data.filter(item => item.name !== name);
    fs.writeFile("hospital.json", JSON.stringify(value), (err, resp) => {
        if (err) {
            res.send("The information cannot be deleted.");
        } else res.send("Delete Operation Completed");
    })
});

//....................................Port Number : 3000 ............................................
app.listen(3000);
console.log("Server listening to port 3000 !");