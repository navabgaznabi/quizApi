const cron = require("node-cron");
const Quizzes = require("./models/quizzesModel");
const mongoose = require("mongoose");

DB =
	"mongodb+srv://navabg321:gZlEuuwBVd5hI6al@cluster0.tjas2zc.mongodb.net/test";

mongoose.connect(DB).then(() => {
	console.log("*****************starting*******************");
	cron.schedule("* * * * * *", async () => {
		try {
			const documents = await Quizzes.find().limit("100");
			documents.forEach((document) => {
				if (
					document.startDate <= Date.now() &&
					document.endDate >= Date.now() &&
					document.status !== "active"
				) {
					console.log("Document Updated: " + document.name);
					document.status = "active";
				}
				if (
					document.endDate < Date.now() &&
					document.status !== "finished"
				) {
					console.log("Document Updated: " + document.name);

					document.status = "finished";
				}
				if (
					document.startDate > Date.now() &&
					document.status !== "inactive"
				) {
					console.log("Document Updated: " + document.name);
					document.status = "inactive";
				}
				document.save();
			});
		} catch (e) {
			console.log(e);
		}
	});
	console.log("******************Stopped********************");
});

// Schedule the cron job to run every minute
