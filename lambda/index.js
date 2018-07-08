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
        var welcomeHelpMessage="Good Morning Students";
        this.response.speak(welcomeHelpMessage).listen(welcomeHelpMessage);
        this.emit(':responseReady');
    },
    'Greetings': function(){
        var startMessage="Welcome to <break time='0.2s'/> 5th Standard Classroom. I am your Teacher <break time='0.4s'/> <prosody volume='loud'></prosody>";
        var greetMessage= startMessage + "<break time='1s'/> Lets start with Morning Prayer. <break time='0.5s'/> Students! <break time='0.2s'/> Please stand up . <break time='1s'/> <audio src='https://s3.amazonaws.com/appcms-test-results/lp.mp3' /> <break time='0.5s'/> Students! Please sit down <break time='0.5s'/>";
        var continueGreetMessage= greetMessage+"<break time='1s'/> Today We Will Study <break time='0.3s'/> History <break time='0.3s'/> Chapter 4 <break time='0.2s'/> Name of the chapter is <break time='0.5s'/> An Indian American Woman in Space <break time='0.5s'/> Kalpana Chawla <break time='0.5s'/>. Paragraph One <break time='1s'/>";
        var passageChapter= continueGreetMessage + config.chapterFour;
        
        var passageEnds= passageChapter + "<break time='0.5s'/>  Now you can ask your Questions?";
        
        var ex="<break time='0.6s'/> Now Let's Start today's <break time='0.1s'/> Exercise.<break time='0.5s'/> Listen carefully<break time='0.6s'/> Where was Kalpana Chawla Born?";
        
        console.log(passageEnds);

        this.response.speak(passageEnds).listen(ex);
        this.emit(':responseReady');
    },
    'Questions':function(){


        var optionsArray = ["born Kalpana","born kalpana chawla","kalpana chawla","chawla","kalpana","marry","married","Jean Pierre Harrison","flight instructor"]
        
        var myOptionAnswer = this.event.request.intent.slots.pName.value;

        var textMatches = stringSimilarity.findBestMatch(myOptionAnswer, optionsArray);

        var questionAnswerText=" ";

        if(textMatches.bestMatch.target.toLowerCase()==optionsArray[0].toLowerCase() || textMatches.bestMatch.target.toLowerCase()==optionsArray[1].toLowerCase()){
            questionAnswerText="Kalpana Chawla was born on <break time='0.3s'/> 17 March 1962";
        }else if(textMatches.bestMatch.target.toLowerCase()==optionsArray[2].toLowerCase() || textMatches.bestMatch.target.toLowerCase()==optionsArray[3].toLowerCase() || textMatches.bestMatch.target.toLowerCase()==optionsArray[4].toLowerCase()){
            questionAnswerText= "Kalpana Chawla was" + "<break time='0.3s'/> a research scientist at"+ "<break time='0.3s'/> NASA";
        }else if(textMatches.bestMatch.target==optionsArray[5].toLowerCase() || textMatches.bestMatch.target==optionsArray[6].toLowerCase()){
            questionAnswerText="Kalpana Chawla was married to flight instructor <break time='0.3s'/> Jean Pierre Harrison.";
        }else if(textMatches.bestMatch.target.toLowerCase()==optionsArray[7].toLowerCase()){
            questionAnswerText="Jean Pierre Harrison was a Flight instructor";
        }else if(textMatches.bestMatch.target.toLowerCase()==optionsArray[8].toLowerCase()){
            questionAnswerText= "A flight instructor is a person who teaches others to fly aircraft";
        }
        else{
            questionAnswerText="Kalpana Chawla was" + "<break time='0.3s'/> a research scientist at"+ "<break time='0.3s'/> NASA";
        }


        var ex="<break time='0.7s'/> Now Lets Start today's <break time='0.3s'/> Exercise.<break time='0.5s'/> Listen carefully<break time='0.6s'/> Where was Kalpana Chawla Born?";

        var myReprompt="Where was Kalpana Chawla Born?";
        var moreQuesions = questionAnswerText +  ex;
        this.response.speak(moreQuesions).listen(myReprompt);
        this.emit(':responseReady');
    },
    'regionAnswer': function(){
        var filteredArray=["karnal","Haryana","karnal Haryana"];
        var regionAnswer=" ";
        // if(this.event.request.intent.slots.myCity.hasOwnProperty("value")){
        //     regionAnswer=this.event.request.intent.slots.myCity.value;
        // }

        if(this.event.request.intent.slots.myRegion.hasOwnProperty("value")){
            regionAnswer=this.event.request.intent.slots.myRegion.value;
        }

        var textMatches = stringSimilarity.findBestMatch(regionAnswer, filteredArray);
        
        if(textMatches.bestMatch.rating>0.4){
            this.attributes["myScore"]=this.attributes["myScore"]+1;
        }

       var nextQuestionText="<break time='0.6s'/>Let's move to next Question <break time='0.6s'/>" +
        "In Which Year Kalpana Chawla was selected as trainee in NASA"
        this.response.speak(nextQuestionText).listen("In Which Year Kalpana Chawla was selected as trainee in NASA");
        this.emit(':responseReady');
    },
    'trainSelected':function(){

        var yearSelected="1213";

        if(this.event.request.intent.slots.trainSelecetd.hasOwnProperty("value")){
            yearSelected=this.event.request.intent.slots.trainSelecetd.value;
        }

        var resultArray = yearSelected.split(" ");

        if(resultArray[0]=="1994" || resultArray[0]=="9094"){
            this.attributes["myScore"]=this.attributes["myScore"]+1;
        }

        var finalScore="<break time='0.5s'/> <break time='0.5s'/> Your Final Score is <break time='0.5s'/>" + this.attributes["myScore"] + "<break time='0.5s'/> We have sent the detailed Report of your test to your Parents<break time='0.5s'/>";
        let exitMessage = '<break time="0.2s"/> Thats All for the Day <break time="0.5s"/> See you Tomorrow. <audio src="https://s3.amazonaws.com/appcms-test-results/two.mp3"/> <break time="0.2s"/>';
        var mMessage = finalScore + exitMessage;
        this.response.speak(mMessage)
        this.emit(':responseReady');

    },
    'AMAZON.YesIntent': function () {
        var exerciseStart="Now Lets Start today's <break time='0.3s'/> Exercise.<break time='0.5s'/> Listen the Questions carefully<break time='0.6s'/> When was Kalpana Chawla Born?";
        this.response.speak(exerciseStart).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        var exerciseStart="Now Lets Start today's <break time='0.3s'/> Exercise. <break time='0.5s'/> Listen the Questions carefully<break time='0.6s'/> When was Kalpana Chawla Born?";
        this.response.speak(exerciseStart).listen(repromptText);
        this.emit(':responseReady');
    },
    'NotIntent': function () {
        var exerciseStart="Now Lets Start today's <break time='0.3s'/> Exercise. <break time='0.5s'/>Listen the Questions carefully<break time='0.6s'/> When was Kalpana Chawla Born?";
        this.response.speak(exerciseStart).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        let helpMessage = "Angel Hack Hackathon";
        this.response.speak(helpMessage).listen(repromptText);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        let exitMessage = 'Thanks You For Using My Classroom.<break time="0.2s"/> Look Forward to see you again <break time="0.2s"/>.';
        this.response.speak(exitMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        let exitMessage = '<break time="0.2s"/>See you Tomorrow.<audio src="https://s3.amazonaws.com/appcms-test-results/two.mp3"/> <break time="0.2s"/>';
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



