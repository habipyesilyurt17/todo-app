const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

router.get("/getAllTodos", async(req, res) => {
  if (!req.isAuth) {
    res.status(401).json({
      message: "Unauthenticated",
    });
  }
  const todos = await Todo.find({creator: req.userId});
  res.status(200).json({
    todos: todos,
  });
});

router.post("/createTodo", (req, res) => {
  if (!req.isAuth) {
    res.status(401).json({
      message: "Unauthenticated",
    });
  }
  const todo = new Todo({
    todo: req.body.todo,
    creator: req.userId,
    completed: false
  });
  todo
    .save()
    .then((result) => {
      res.status(201).json({
				message: "Todo created",
				todo: result.todo,
        creator: result.creator,
        _id: result.id,
        completed: result.completed
			})
    })
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.patch("/:todoId", (req, res) => {
  if (!req.isAuth) {
    res.status(401).json({
      message: "Unauthenticated",
    });
  }
  const id = req.params.todoId;

  Todo.updateOne({_id: id}, req.body).then(result => {
    res.status(200).json({
      message: "Todo updated"
    })
  }).catch(err => {
    console.log(err);
  })
})
 
router.delete("/:todoId", (req, res) => {
  if (!req.isAuth) {
    res.status(401).json({
      message: "Unauthenticated",
    });
  }
  const id = req.params.todoId;
  Todo.remove({_id: id}).then(result => {
    res.status(200).json({
      message: "Todo deleted"
    })
  }).catch(err => {
    console.log(err)
  })
})

module.exports = router;
