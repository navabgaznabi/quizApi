const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const cache = require("memory-cache");

const app = express();

const QuizzesController = require("./controller/QuizzesController");

// Add a logger middleware
app.use(morgan("dev"));

// Add the helmet middleware for securing http headers.
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
	max: 50,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// Use compression middleware
app.use(compression());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Routes
app.post("/quizzes", QuizzesController.createQuizzes);

// Cache all GET requests for 1 min
app.get("*", (req, res, next) => {
	const key = "__express__" + req.originalUrl || req.url;
	const cachedBody = cache.get(key);
	if (cachedBody) {
		return res.json(cachedBody);
	} else {
		res.sendResponse = res.json;
		res.json = (body) => {
			cache.put(key, body, 60 * 1000);
			res.sendResponse(body);
		};
		next();
	}
});

app.get("/quizzes/all", QuizzesController.allQuizzes);

app.get("/quizzes/active", QuizzesController.activeQuiz);
app.get("/quizzes/finished", QuizzesController.finishedQuiz);
app.get("/quizzes/upcoming", QuizzesController.upcomingQuiz);

app.get("/quizzes/:id/result", QuizzesController.getResultById);
app.get("/quizzes/:id", QuizzesController.quizById);

app.all("*", (req, res, next) => {
	res.status(404).json({
		status: "Bad Request",
		message: "The requested URL doesn't exist!!",
	});
});

module.exports = app;
