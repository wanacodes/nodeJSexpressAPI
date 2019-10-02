const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

// main method in express
// app.get();
// app.post();
// app.put();
// app.delete();

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query);
});

app.post('/api/courses', (req, res) => {

    // const schema = {
    //     name: Joi.string().min(3).required()
    // };

    // const result = Joi.validate(req.body, schema);

    // if (result.error) {
    //     // 400 bad request
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    const { error } = validateCourse(req.body)

    if (error) {
        // 400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name, // to use this must enable express.json()
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // look up the course
    // if not exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    // Validate
    // if invalid, return 404 - Bad Request
    // const schema = {
    //     name: Joi.string().min(3).required()
    // };

    // const result = Joi.validate(req.body, schema);
    //const result = validateCourse(req.body);
    const { error } = validateCourse(req.body)

    if (error) {
        // 400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }
    // Update course
    // Return the updated course
    course.name = req.body.name;
    res.send(course)
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Not exist, return 404 error
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course)
})

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
