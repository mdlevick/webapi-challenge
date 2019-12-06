const express = require('express');
const Projects = require('./projectModel.js');
const Actions = require('./actionModel.js');

const router = express.Router();


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
    let actionUpdate = req.body;
    actionUpdate = {
        ...actionUpdate,
        project_id: req.project.id
    }
    Actions.update(actionUpdate)
    .then(action => {
        res.status(201).json(action)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error adding the action' })
    })
});

router.get('/:id/actions/:actionId', validateProjectId, validateActionId, (req, res) => {
    res.status(200).json(req.action);
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
        res.status(500).json({ message: "failed to retrieve project by id" });
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