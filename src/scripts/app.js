$(document).ready(function() {
    var quiz = {};
    quiz.questions = [];
    quiz.atQuestion = undefined;
    quiz.quizBlock = $('#quiz_block');
    quiz.questionsBlock = $('#quiz_questions');
    quiz.loadSounds = function() {
        createjs.Sound.registerSound("assets/sounds/thunder.mp3", 1);
    };
    quiz.loadQuestions = function() {
        $.getJSON("questions.json", function(json) {
            quiz.questions = json;

            var readyForAction = buildDOMTree(quiz.questions);

            function buildDOMTree(questions) {
                // loop through questions and set the html up
                var block = quiz.questionsBlock;
                $.each(questions, function(idx, question) {
                    var node = $('<div>').addClass('quiz-question');
                    node.append($('<h3>').text(question.title));

                    // loop through answers and set the element up
                    var answersBlock = $('<div>').addClass('quiz-answers');
                    $.each(question.answers, function(idx, answer) {
                        var answerDiv = $('<div>').addClass('quiz-answer').attr('name', idx);
                        answerDiv.append($('<button>').addClass('quiz-button').text(answer.text));
                        answersBlock.append(answerDiv);
                    });
                    node.append(answersBlock);

                    block.append(node);
                });

                return block;
            }

            // listeners
            $('.quiz-answer').click(function () {
                quiz.checkAnswer(this);
            });

            //debugging
            quiz.goToQuestion(1);

        });
    };
    quiz.goToQuestion = function(number) {
        // if we try to navigate to a question out of bounds
        if (number == quiz.questions.length+1) {
            finishQuiz();
        }

        quiz.atQuestion = number;
        $('#quiz_block_panel h4')[0].innerHTML = 'QUESTION '+number+' OF '+quiz.questions.length;
        $('.quiz-question').map(function(idx) {
            // ++ cuz of zero index
            if (++idx != number) {
                $(this).hide();
            } else {
                $(this).fadeIn();
            }
        });
    };
    quiz.checkAnswer = function (element) {
        // the element name holds the answerId
        var answerId = $(element).attr('name');

        if (quiz.questions[quiz.atQuestion-1].answers[answerId].isCorrect) {
            //correct answer!
            $(element).find('.quiz-button').addClass('quiz-button-correct');
        } else {
            $(element).find('.quiz-button').addClass('quiz-button-incorrect');
        }

        setTimeout(function () {
            quiz.goToQuestion(++quiz.atQuestion);
        }, 1000);
    };




    quiz.loadQuestions();
    quiz.loadSounds();


    // debugging
    $('#quiz_intro').fadeOut();
    quiz.quizBlock.fadeIn();

    // start quiz on user click
    $('#quiz_start').click(function() {
        createjs.Sound.play(1);
        // fade out intro text
        $('#quiz_intro').fadeOut(function() {
            createjs.Sound.stop(1);

            // fade in the questions
            quiz.goToQuestion(1);
            quiz.quizBlock.fadeIn();
        });
    });




});
