<h1># Introduction:</h1>
This API project is a Express application that allows users to create and participate in timed quizzes. The API offers functionalities for creating a quiz, getting the active, finshed, and upcoming quizzes, getting quiz results, and retrieving all quizzes. The quizzes created by users are stored in a database, and the API should handle errors and return appropriate error responses.

<h1># Functionalities:</h1>

1. Create a Quiz:
To create a quiz, users need to send a POST request to the API with the following fields:

Endpoint: GET /quizzes
payload = {
    name: A required string field representing the name of the quiz.
    questions: A required array of questionSchema objects representing the questions in the quiz. The length of this array must be at least 1.
    startDate: A required date field representing the start date of the quiz.
    endDate: A required date field representing the end date of the quiz.
}

Question Schema Represent the schema of questions in above payload.
questionSchema:  {
    question: A required string field representing the actual question.
    options: A required array of strings representing the options for the question. The length of this array must be between 1 and 4.
    rightAnswer: A required integer field representing the index of the correct option in the options array.
}

Endpoint: GET /quizzes/all
Functionality: Returns all quizzes stored in the database.

Endpoint: GET /quizzes/active
Functionality: Returns all quizzes that are currently active, i.e., quizzes that have a start date in the past and an end date in the future.

Endpoint: GET /quizzes/finished
Functionality: Returns all quizzes that have ended, i.e., quizzes that have an end date in the past.

Endpoint: GET /quizzes/upcoming
Functionality: Returns all quizzes that have not yet started, i.e., quizzes that have a start date in the future.

Endpoint: GET /quizzes/:id/result
Functionality: Returns the results of a quiz for a given quiz ID.

Endpoint: GET /quizzes/:id
Functionality: Returns a quiz for a given quiz ID.
