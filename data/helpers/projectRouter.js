const express = require('express');
const Projects = require('./projectModel.js');
const Actions = require('./actionModel.js');

const router = express.Router();

// CRUD on Projects

router.get('/', (req, res) => {
    Projects.get()
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the projects' })
    })
});

router.post('/', validateProject, (req, res) => {
    // console.log("router.post", req.body);

    const project = req.body;

    Projects.insert(project)
    .then(project => {
        res.status(201).json(project)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error creating the project'} )
    })
});

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project);
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const projectUpdate = req.body;

    Projects.update(req.project.id, projectUpdate)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the project'} )
    })
});

router.delete('/:id', validateProjectId, (req, res) => {
    const { id } = req.params;
    Projects.remove(id)
    .then(project => {
        res.status(200).json({ message: 'The project has been deleted.' })
    })
    .catch(err => {
        res.status(500).json({ message: 'Error deleting the project' })
    });
});

// CRUD on Actions within projects route

router.get('/:id/actions', validateProjectId, (req, res) => {
    const { id } = req.params;

    Projects.getProjectActions(id) 
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json( { message: 'Error retrieving the actions' })
    })
});

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    let newAction = req.body;
    // console.log(newPost);
    newAction = {
        ...newAction,
        project_id: req.project.id
    }
    Actions.insert(newAction)
    .then(action => {
        res.status(201).json(action)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error adding the action' })
    })
});

//custom middleware

// `validateProjectId` validates the project id on every request that expects a project id parameter
// if the `id` parameter is valid, store that project object as `req.project`
// if the `id` parameter does not match any project id in the database, cancel the request and respond with status `400` and `{ message: "invalid project id" }`

function validateProjectId(req, res, next) {
    // console.log(req.params);
    const { id } = req.params;

    Projects.get(id)
    .then(project => {
        if (project) {
            req.project = project;
            next();
        } else {
            res.status(400).json({ message: "invalid project id" })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "failed to retrieve project by id" });
    });
};


// `validateProject` validates the `body` on a request to create a new project
// if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing project data" }`
// if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
// if the request `body` is missing the required `description` field, cancel the request and respond with status `400` and `{ message: "missing required description field" }`

function validateProject(req, res, next) {
    // console.log("validateProject", req.body);
    if (!req.body) {
      res.status(400).json({ message: "missing project data" });
    } else if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else if (!req.body.description) {
      res.status(400).json({ message: "missing required decription field" });
    } else {
        next();
    }
}

// `validateActionId` validates the action id on every request that expects a action id parameter
// if the `id` parameter is valid, store that project object as `req.project`
// if the `id` parameter does not match any project id in the database, cancel the request and respond with status `400` and `{ message: "invalid action id" }`

function validateActionId(req, res, next) {
    // console.log(req.params);
    const { actionId } = req.params;

    Actions.get(actionId)
    .then(action => {
        if (action) {
            req.action = action;
            next();
        } else {
            res.status(400).json({ message: "invalid action id" })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "failed to retrieve action by id" });
    });
};

// `validateAction` validates the `body` on a request to create a new action
// if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing action data" }`
// if the request `body` is missing the required `description` field, cancel the request and respond with status `400` and `{ message: "missing required description field" }`
// if the request `body` is missing the required `notes` field, cancel the request and respond with status `400` and `{ message: "missing required notes field" }`


function validateAction(req, res, next) {
    // let missingFields = []
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.description) {
        // missingFields.push("description")
        res.status(400).json({ message: "missing required description field" })
    } else if (!req.body.notes) {
        // missingFields.push("notes")
        // let response = concat strings of the total missing fields
        res.status(400).json({ message: "missing required notes field" })
    } else {
        next();
    }
  }

module.exports = router;