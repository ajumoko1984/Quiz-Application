let correctAnswer,
    correctNumber = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
    incorrectNumber = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

document.addEventListener('DOMContentLoaded', function() {
     loadQuestion();

     eventListeners();
});
 
eventListeners = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer);
    document.querySelector('#clear-storage').addEventListener('click', clearResults);
}

// eventListeners = () => {
//     document.querySelector('#dark-mode').addEventListener('click', darkMode );
// }

//LOADS A NEW QUESTION FROM AN API
loadQuestion = () => {
    // const url = 'https://opentdb.com/api.php?amount=1';
    const url = 'https://opentdb.com/api.php?amount=50&category=19&difficulty=hard&encode=url3986'
    fetch(url)
          .then(data => data.json())
          .then(result => displayQuestion(result.results));
     }

     //DISPLAYS THE QUESTION HTML FROM API

     displayQuestion = questions => {

            //CREATE THE HTML QUESTION
      const questionHTML = document.createElement('div');
      questionHTML.classList.add('col-12');

      questions.forEach(question => {
        
          //READ THE CORRECT ANSWER
          correctAnswer = question.correct_answer;

          //INJECT THE CORRECT ANSWER IN THE POSSIBLE ANSWERS
          let possibleAnswers = question.incorrect_answers;
          possibleAnswers.splice(Math.floor(Math.random() * 3 ), 0, correctAnswer);


          //ADD THE HTML FOR THE CORRECT QUESTION

          questionHTML.innerHTML = `
          <div class="row justify-content-between heading">
               <p class="category">Category: ${question.category}</p>
               <div class="totals">
                 <span class="badge badge-primary">${correctNumber}</span>
                 <span class="badge badge-danger">${incorrectNumber}</span>
               </div>
               </div>
               <h2 class="text-center">${question.question}
          `;
      //GENERATE THE HTML FOR POSSIBLE ANSWERS
          const answerDiv = document.createElement('div');
          answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4');
          possibleAnswers.forEach(answer => {
               const answerHTML = document.createElement('li');
               answerHTML.classList.add('col-12','col-md-5');
               answerHTML.textContent = answer;
               //ATTACH AN EVENT CLICK WHEN THE ANSWER IS CLICKED
               answerHTML.onclick = selectAnswer;
               answerDiv.appendChild(answerHTML);
           


          });

          questionHTML.appendChild(answerDiv) ;

          //RENDER IN THE HTML
          document.querySelector('#app').appendChild(questionHTML);

      })
     }

     //WHEN THE ANSWER IS SELECTED
selectAnswer = (e) => {

    //REMOVE THE PREVIOUS ANSWER CLASS FOR THE ANSWER
    if(document.querySelector('.active')) {
        const activeAnswer = document.querySelector('.active');
        activeAnswer.classList.remove('active');
    }

    //ADD THE CURRENT ANSWER
    e.target  .classList.add('active');
}

//CHECKS IF THE ANSWER IS CORRECT AND 1 ANSWER IS SELECTED
validateAnswer = () => {
    if(document.querySelector('.questions .active')) {
        //EVERYTHING IS FINE ,CHECK IF THE ANSWER IS CORRECT OR NOT
        checkAnswer();
        
    } else {
        //the user did not select anything
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
        errorDiv.textContent = 'Please select 1 answer';
        //select the queston div to insert the alert
        const questionDiv = document.querySelector('.questions');
        questionDiv.appendChild(errorDiv);


        //REMOVE THE ERROR
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000 );
    }
 }

 //CHECK IF THE ANSWER IS CORRECT OR NOT
 checkAnswer = () => {
     const userAnswer = document.querySelector('.questions .active');
    
     if(userAnswer.textContent === correctAnswer ) {
         correctNumber++;
     } else {
         incorrectNumber++;
     }  

     //SAVE INTO THE LOCALSTORAGE
     saveIntoStorage();

     //CLEAR PREVIOUS HTML
     const app = document.querySelector('#app');
     while(app.firstChild) {
         app.removeChild(app.firstChild);
     }

     //LOAD A NEW QUESTION
     loadQuestion();
 }

 //SAVES CORRECT OR INCORRECT TOTALS IN STORAGE
 saveIntoStorage = () => {
     localStorage.setItem('quiz_game_correct', correctNumber);
     localStorage.setItem('quiz_game_incorrect', incorrectNumber);
 }

 //CLEAR RESULTS FROM THE STORAGE

 clearResults = () => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 5000);
 }


 
// darkMode = () => {

// }