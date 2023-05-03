const Quizzes = require("../models/quizzesModel");

exports.createQuizzes = async (req, res) => {
	try {
		const newQuiz = await Quizzes.create(req.body);
		res.status(201).json({
			status: "Quiz Created",
			data: newQuiz,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.allQuizzes = async (req, res) => {
	try {
		const quizzes = await Quizzes.find().select("-questions");
		if (!quizzes) {
			return res.status(404).json({
				status: "Failed",
				data: {
					messege: "No Quiz Found.",
				},
			});
		}
		res.status(200).json({
			status: "Success",
			data: {
				quizCount: quizzes.length,
				quizzesList: quizzes,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.quizById = async (req, res) => {
	try {
		const quiz = await Quizzes.findById(req.params.id).select(
			"-questions.rightAnswer"
		);
		if (!quiz) {
			return res.status(404).json({
				status: "Failed",
				data: {
					messege: "Quiz Not Found. Please make sure id is Correct",
				},
			});
		}
		if (quiz.status === "inactive") {
			return res.status(200).json({
				status: "success",
				data: {
					quiz: {
						_id: quiz._id,
						status: quiz.status,
						startDate: quiz.startDate,
						endDate: quiz.endDate,
					},
				},
			});
		}
		res.status(200).json({
			status: "success",
			data: {
				quiz,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.activeQuiz = async (req, res) => {
	try {
		const nowdate = new Date();
		const quizzes = await Quizzes.find({
			startDate: { $lte: nowdate },
			endDate: { $gte: nowdate },
		}).select(["-questions.rightAnswer", "-questions._id"]);
		if (!quizzes) {
			return res
				.status(404)
				.json({ status: "Failed", message: "No active quiz found" });
		}
		res.status(200).json({
			status: "success",
			data: {
				activeQuizCount: quizzes.length,
				quizzes,
			},
		});
	} catch (err) {
		// console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.finishedQuiz = async (req, res) => {
	try {
		const nowdate = new Date();
		const quizzes = await Quizzes.find({
			endDate: { $lte: nowdate },
		});
		if (!quizzes) {
			return res
				.status(404)
				.json({ status: "Failed", message: "No Finshed quiz found" });
		}
		res.status(200).json({
			status: "success",
			data: {
				activeQuizCount: quizzes.length,
				quizzes,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.upcomingQuiz = async (req, res) => {
	try {
		const nowdate = new Date();
		const quizzes = await Quizzes.find({
			startDate: { $gte: nowdate },
		}).select("-questions");
		if (!quizzes) {
			return res
				.status(404)
				.json({ status: "Failed", message: "No Upcoming quiz found" });
		}
		res.status(200).json({
			status: "success",
			data: {
				activeQuizCount: quizzes.length,
				quizzes,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

exports.getResultById = async (req, res) => {
	try {
		const quiz = await Quizzes.findById(req.params.id);
		if (!quiz) {
			return res.status(404).json({
				status: "Failed",
				message: "Quiz not found. Make Sure ID is correct.",
			});
		}

		const timestamp = new Date(quiz.endDate);
		timestamp.setMinutes(timestamp.getMinutes() + 5);
		if (new Date() < timestamp) {
			return res.status(404).json({
				status: "Failed",
				message:
					"Answer will be available after 5 min of quiz end time.",
			});
		}

		res.status(200).json({ status: "Success", questions: quiz.questions });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};
