try {
	const mongoose = require("mongoose");

	const questionSchema = new mongoose.Schema(
		{
			question: {
				type: String,
				required: true,
			},
			options: {
				type: [String],
				required: true,
				validate: {
					validator: function (arr) {
						return arr.length >= 1 && arr.length <= 4;
					},
					message:
						"Question options must have at least 1 and at most 4 items",
				},
			},
			rightAnswer: {
				type: Number,
				required: true,
				min: 0,
			},
		},
		{
			versionKey: false, // exclude __v field
			id: false,
		}
	);

	const QuizSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
			},
			questions: {
				type: [questionSchema],
				required: true,
				validate: {
					validator: function (arr) {
						return arr.length >= 1;
					},
					message: "Quiz must have at least 1",
				},
			},
			startDate: {
				type: Date,
				required: true,
			},
			endDate: {
				type: Date,
				required: true,
			},
			createAt: {
				select: false,
				type: Date,
				default: Date.now,
			},
		},
		{
			versionKey: false,
			toJSON: { virtuals: true },
			toObject: { virtuals: true },
		}
	);

	// Define the virtual field for status
	QuizSchema.virtual("status").get(function () {
		const now = new Date();
		if (now < this.startDate) {
			return "inactive";
		} else if (now >= this.startDate && now < this.endDate) {
			return "active";
		} else {
			return "finished";
		}
	});

	module.exports = mongoose.model("Quiz", QuizSchema);
} catch (err) {
	console.log("Error:", err);
}
