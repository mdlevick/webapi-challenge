const express = require('express');
const Actions = require('./actionModel.js');

const router = express.Router();

// CRUD on Actions

router.get('/', (req, res) => {
    Actions.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the actions' })
    })
});

// post new actions within the Project Router in order to include Project ID

router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action.id);
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
    const actionUpdate = req.body;

    Actions.update(req.action.id, actionUpdate)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the action'} )
    })
});

router.delete('/:id', validateActionId, (req, res) => {
    const { actionId } = req.params;
    console.log(actionId, "req.params")
    Actions.remove(actionId)
    .then(action => {
        res.status(200).json({ message: 'The action has been deleted.' })
    })
    .catch(err => {
        res.status(500).json({ message: 'Error deleting the action' })
    });
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
      res.status(400).json({ message: "missing required description field" });
    } else {
        next();
    }
}

// `validateActionId` validates the action id on every request that expects a action id parameter
// if the `id` parameter is valid, store that project object as `req.project`
// if the `id` parameter does not match any project id in the database, cancel the request and respond with status `400` and `{ message: "invalid action id" }`

function validateActionId(req, res, next) {
    console.log(req.params);
    const { id } = req.params;

    Actions.get(id)
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