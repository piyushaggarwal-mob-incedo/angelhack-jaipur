'use strict';

var config = require('./myfunction');
const Alexa = require("alexa-sdk");
var stringSimilarity = require('string-similarity');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    console.log(event);
    console.log(JSON.stringify(event));
    alexa.execute();
};

let repromptText = "Students! I am here to help you.";

const handlers = {
    'LaunchRequest': function () {
        this.attributes["myScore"]=0;
        this.attributes["questionNumber"]=0;
        this.attributes["enNumber"]=0;

        var welcomeHelpMessage="Welcome to <break time='0.2s'/> 5th Standard Classroom. I am your Teacher. My Name is Angel Hack. Good Morning Students. How are you?";
        this.response.speak(welcomeHelpMessage).listen(repromptText);
        this.emit(':responseReady');

    },
    'Greetings': function(){
        var greetMessage="Great. Lets start with Morning Prayer. <break time='0.5s'/> Students <break time='0.2s'/> Please stand up on your Place and fold your hands. <break time='1s'/> Prayer Starts. <break time='1s'/>  <audio src='https://s3.amazonaws.com/appcms-test-results/prayerone.mp3' /> <break time='0.5s'/> Prayer Ends. ";
        var continueGreetMessage=greetMessage+"<break time='0.4s'/> Students! <break time='0.4s'/> Today We Will be studying <break time='0.4s'/> C.B.S.E <break time='0.4s'/> Chapte 4 named <break time='0.7s'/> An Indian <break time='0.4s'/> American Woman in Space <break time='0.5s'/> Kalpana Chawla <break time='0.4s'/>";
        this.response.speak(continueGreetMessage).listen(repromptText);
        this.emit(':responseReady');
    },
    'chooseSubject':function(){
        var firstSubjectQuestion="Lets start with General Knowledge. <break time='0.5s'/> Listen Question Carefully <break time='0.5s'/>. I am a scientist and politician who served my country as president from <break time='0.4s'/> 2002 <break time='0.2s'/>to <break time='0.2s'/> 2007.<break time='0.5s'/> I was also given a title of India’s Rocket Man. <break time='0.4s'/> Who am I";
        var optionsFirstQuestion= firstSubjectQuestion + " <break time='0.4s'/> Option one <break time='0.4s'/>" + config.myQuestionAnswers[0].optionsone[0] + "<break time='0.4s'/> option two <break time='0.4s'/>" + config.myQuestionAnswers[0].optionsone[1] + "<break time='0.4s'/> option three <break time='0.4s'/>" + config.myQuestionAnswers[0].optionsone[2] + " <break time='0.4s'/> option four <break time='0.4s'/> " + config.myQuestionAnswers[0].optionsone[3];
        this.response.speak(optionsFirstQuestion).listen(repromptText);
        this.emit(':responseReady');
    },
    'chooseAnswer': function () {

        var myOptionAnswer = this.event.request.intent.slots.myNumber.value;

        if(this.attributes["questionNumber"]==0){
            this.attributes["questionNumber"]=this.attributes["questionNumber"]+1;
            if(myOptionAnswer==config.myQuestionAnswers[0].answerone){
                this.attributes["myScore"]=this.attributes["myScore"]+1;
            }
            var moveNext=" <break time='0.5s'/>Lets Move to Next Subject English. <break time='0.2s'/> Students, Listen to Passage Carefully and answer the Questions accordingly.<break time='0.2s'/>"
            var Passage = moveNext + "Passage Begins <break time='0.8s'/> Ritesh went to Angel Hack hackathon with his friends. His Mother buy him the tickets. Ritesh showed a really good idea in hackathon and won the Hackathon.<break time='0.5s'/> Passage Ends"
            var answerQuestions= Passage + "<break time='0.5s'/> Questionare Time <break time='0.5s'/> What is the Name of Hackathon in which Ritesh Went <break time='0.5s'/>"
            var optionsFirstQuestion= answerQuestions + "<break time='0.4s'/> Option one <break time='0.4s'/>" + config.myQuestionAnswers[1].optionsone[0] + "<break time='0.4s'/> option two <break time='0.4s'/>" + config.myQuestionAnswers[1].optionsone[1] + " option three <break time='0.6s'/>" + config.myQuestionAnswers[1].optionsone[2] + " option four <break time='0.6s'/>" + config.myQuestionAnswers[1].optionsone[3];
            this.response.speak(optionsFirstQuestion).listen(repromptText);
            this.emit(':responseReady');
        }
         if(this.attributes["questionNumber"]==1){
            this.attributes["questionNumber"]=this.attributes["questionNumber"]+1;

            if(myOptionAnswer==config.myQuestionAnswers[1].answerone){
                this.attributes["myScore"]=this.attributes["myScore"]+1;
            }

            var moveNext=" <break time='0.5s'/> Lets Move to Next Subject Maths. <break time='0.5s'/> Students, Listen to Question Carefully and Answer the Quesion."
            var answerQuestions= moveNext + "<break time='0.5s'/> Mike is 5 years old. Mike's mother's age is 7 times his age. <break time='0.5s'/> What is his mother's age?<break time='0.5s'/>"
            var optionsFirstQuestion= answerQuestions + "<break time='0.5s'/>Option one <break time='0.4s'/>" + config.myQuestionAnswers[2].optionsone[0] + " option two <break time='0.4s'/>" + config.myQuestionAnswers[2].optionsone[1] + " option three <break time='0.4s'/>" + config.myQuestionAnswers[2].optionsone[2] + " option four <break time='0.4s'/>" + config.myQuestionAnswers[2].optionsone[3];
            this.response.speak(optionsFirstQuestion).listen(repromptText);
            this.emit(':responseReady');
        }

        if(this.attributes["questionNumber"]==2){
            this.attributes["questionNumber"]=this.attributes["questionNumber"]+1;
            if(myOptionAnswer==config.myQuestionAnswers[2].answerone){
                this.attributes["myScore"]=this.attributes["myScore"]+1;
            }
            var finalScore="<break time='0.5s'/> Your Final Score is <break time='0.5s'/>" + this.attributes["myScore"] + "<break time='0.5s'/> We have sent the detailed Report to your Parents<break time='0.5s'/>";
            let exitMessage = '<break time="0.2s"/> Thats All for the Day <break time="0.5s"/> See you Tomorrow. School Bell Starts <audio src="https://s3.amazonaws.com/appcms-test-results/bellone.mp3" /> <break time="0.2s"/>';
            var mMessage = finalScore + exitMessage;
            this.response.speak(mMessage)
            this.emit(':responseReady');
        }
  
    },
    'AMAZON.HelpIntent': function () {
        let helpMessage = "Angel Hack Hackathon";
        this.response.speak(helpMessage).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function () {
        this.response.speak(repromptText).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        this.response.speak(repromptText).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        let exitMessage = 'Thanks You For Using My Classroom.<break time="0.2s"/> Look Forward to see you again <break time="0.2s"/>.';
        this.response.speak(exitMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        let exitMessage = '<break time="0.2s"/>See you Tomorrow. School Bell Starts <audio src="https://s3.amazonaws.com/appcms-test-results/bellone.mp3" /> <break time="0.2s"/>.';
        this.response.speak(exitMessage);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak("Unable To Understand. Please try again")
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('Session ended');
    }
};



