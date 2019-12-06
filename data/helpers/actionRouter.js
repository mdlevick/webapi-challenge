const express = require('express');
const Actions = require('./actionModel.js');

const router = express.Router();


router.get('/', (req, res) => {
    Actions.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err, { message: 'Error retrieving the actions' })
    })
});


router.get('/:actionId', validateActionId, (req, res) => {
    res.status(200).json(req.action);
});

router.put('/:actionId', validateActionId, validateAction, (req, res) => {
    const actionUpdate = req.body;

    Actions.update(req.action.id, actionUpdate)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err, { message: 'Error retrieving the action'} )
    })
});

router.delete('/:actionId', validateActionId, (req, res) => {
    const { actionId } = req.params;
    Actions.remove(actionId)
    .then(action => {
        res.status(200).json(action, { message:  'The action has been deleted.' })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err, { message: 'Error deleting the action' })
    });
});

function validateProjectId(req, res, next) {
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
        res.status(500).json(err, { message: "failed to retrieve project by id" });
    });
};


function validateProject(req, res, next) {
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


function validateActionId(req, res, next) {
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
        res.status(500).json(err, { message: "failed to retrieve action by id" });
    });
};


function validateAction(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.description) {
        res.status(400).json({ message: "missing required description field" })
    } else if (!req.body.notes) {
        res.status(400).json({ message: "missing required notes field" })
    } else {
        next();
    }
  }

module.exports = router;