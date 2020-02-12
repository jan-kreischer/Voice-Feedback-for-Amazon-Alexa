/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
const Alexa = require('ask-sdk-core');
var http = require('http'); 
var https = require('https');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const languageStrings = {
  'en': require('./languageStrings')
}
/*const baseUrl = 'myfeedbackbot.com:8081';

*/
/*function httpPost(query, callback) {
    var options = {
        host: 'numbersapi.com',
        path: '/' + encodeURIComponent(query),
        method: 'GET',
    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        
        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        
        //return the data when streaming is complete
        res.on('end', () => {
            console.log(responseString);
            callback(responseString);
        });

    });
    req.end();
}*/

/*function httpGet(query, callback) {
    var options = {
        host: 'numbersapi.com',
        path: '/' + encodeURIComponent(query),
        method: 'GET',
    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        
        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        
        //return the data when streaming is complete
        res.on('end', () => {
            console.log(responseString);
            callback(responseString);
        });

    });
    req.end();
}*/

/*const initialSessionAttributes.botState = 'INITIAL_STATE'
const initialSessionAttributes.device_id = 0
const initialSessionAttributes.feedback_type_id = 0
const initialSessionAttributes.feedback_content = ''*/
/*
const https = require('https')

const data = JSON.stringify({
  todo: 'Buy the milk'
})

const options = {
  hostname: 'whatever.com',
  port: 443,
  path: '/todos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()
*/

function postFeedback(product_id, feedbacker_id, feedback_type_id, feedback_content) {
  const data = JSON.stringify({
    product_id: 1,
    feedbacker_id: 1,
    feedback_type_id: 1,
    feedback_content: "I hope alexa can post things to my api."
  })
  
  const options = {
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: '/feedback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  req.on('error', error => {
    console.error(error);
  });
  
  req.write(data)
  req.end();
}


function slotValue(slot, useId){
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}

const initialSessionAttributes = {
  botState: 'SKILL_CONFIGURATION_STATE_CONFIRM',
  device_id: 0,
  feedback_type_id: 0,
  feedback_content: ''
}


function saveSessionAttributes(attributesManager, sessionAttributes, speechOutput) {
  sessionAttributes.last_speech_output = speechOutput;
  attributesManager.setSessionAttributes(sessionAttributes);
}

//========== CUSTOM INTENT HANDLER ==========

const LaunchRequest = {
  canHandle(handlerInput) {
    console.log("LaunchRequest > Tested");
    
    return Alexa.isNewSession(handlerInput.requestEnvelope) 
        || Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    console.log("LaunchRequest > Used");
    console.log(handlerInput.requestEnvelope)
    console.log(handlerInput);
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    var sessionAttributes = {};

  
    /*sessionAttributes.botState = 'INITIAL_STATE';
    sessionAttributes.device_name = '';
    sessionAttributes.device_company = '';
    
    sessionAttributes.feedback_type = '';
    sessionAttributes.feedback_content = '';*/
    
    var speechOutput = "";

    if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_CONFIRM');
        sessionAttributes.botState = "SKILL_CONFIGURATION_STATE_CONFIRM";
    }
    else {
        speechOutput = requestAttributes.t('INITIAL_STATE');
        sessionAttributes.botState = 'INITIAL_STATE';
    }
    
    //sessionAttributes.last_speech_output = speechOutput;
    //attributesManager.setSessionAttributes(sessionAttributes);
    
    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);  
        
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};



const YesIntentHandler = {
  canHandle(handlerInput) {
    console.log("YesIntentHandler > Tested");
    
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    let stateCanHandleIntent = false;
    if (sessionAttributes.botState) {
        switch(sessionAttributes.botState) {
            case 'INITIAL_STATE':
            case 'SKILL_CONFIGURATION_STATE_CONFIRM':
                stateCanHandleIntent = true;  
                break;
        }
    }

    return stateCanHandleIntent 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
  },
  
  handle(handlerInput) {
    console.log("YesIntentHandler > Used");
    console.log(handlerInput.requestEnvelope);
    console.log(handlerInput);
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    var speechOutput = "";
    switch (sessionAttributes.botState) {
      case 'SKILL_CONFIGURATION_STATE_CONFIRM': 
        speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_ENTER');
        sessionAttributes.botState = 'SKILL_CONFIGURATION_STATE';
        break;
      
      case 'REQUEST_CONTACT_PREFERENCES_STATE':
        speechOutput = requestAttributes.t('Do you want to be informed by alexa or by email. Say yes for alexa and via traditional channels like email or telephone');
        sessionAttributes.botState = 'SKILL_CONFIGURATION_STATE';
        break;
    }
    
    sessionAttributes.last_speech_output = speechOutput;
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};



const NoIntentHandler = {
  canHandle(handlerInput) {
    console.log("NoIntentHandler > Used");
    
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    var stateCanHandleIntent = false;
    if (sessionAttributes.botState) {
        switch(sessionAttributes.botState) {
            case 'SKILL_CONFIGURATION_STATE_CONFIRM':
            case 'CONTACT_PREFERENCES_STATE_CONFIRM':
                stateCanHandleIntent = true;  
                break;
        }
    }

    return stateCanHandleIntent 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    console.log("NoIntentHandler > Used");
    console.log(handlerInput.requestEnvelope);
    console.log(handlerInput);
        
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    var sessionAttributes = attributesManager.getSessionAttributes();
    
    var speechOutput = "";
    var shouldSessionEnd = false;

    switch (sessionAttributes.botState) {
        case 'INITIAL_STATE':
            sessionAttributes.botState = 'ENDED';
            speechOutput = "Ok. See you the next time!";
            shouldSessionEnd = true;
            break;
            
            
        case 'SKILL_CONFIGURATION_STATE_CONFIRM':
            speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_SKIP') + " " + requestAttributes.t('SELECT_DEVICE_STATE_ENTER');
            shouldSessionEnd = false;
            sessionAttributes.botState = 'SELECT_DEVICE_STATE';
            break;
            
        case 'SKILL_CONFIGURATION':
            speechOutput = "Okay so we skip the configuration. You can give your feedback now";
            shouldSessionEnd = false;
            sessionAttributes.botState = 'FEEDBACK_LOOP';
            break;
            
            
        case 'FEEDBACK_LOOP':
            speechOutput = "blablabla";
            sessionAttributes.botState = 'FEEDBACK_LOOP';
            break;
            
            
        case 'ELICIT_CONTACT_INFORMATION':
            speechOutput = "Okay, the informaion is compelte now. I will submit your feedback now.";
            sessionAttributes.botState = 'SUBMIT_INFORMATION';
            break;
            
        default:
            break;
    }
    
    //sessionAttributes.last_speech_output = speechOutput;
    //attributesManager.setSessionAttributes(sessionAttributes);
    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput); 
    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const SkillConfigurationHandler = {

    canHandle(handlerInput) {
        console.log("SkillConfigurationHandler TESTED")
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        var stateCanHandleIntent = false;
        if (sessionAttributes.botState) {
            switch(sessionAttributes.botState) {
                case 'SKILL_CONFIGURATION_STATE':
                    stateCanHandleIntent = true;
            }
        }

        return stateCanHandleIntent 
            && handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'SkillConfigurationIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'SkillConfiguration');
    },

    handle(handlerInput) {
        console.log("SkillConfigurationHandler STARTED")
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
    
        const feedbacker_name = handlerInput.requestEnvelope.request.intent.slots.feedbacker_name.value;
        sessionAttributes.feedbacker_name = feedbacker_name;
        
        const feedbacker_email_address = handlerInput.requestEnvelope.request.intent.slots.feedbacker_email_address.value;
        sessionAttributes.feedbacker_email_address = feedbacker_email_address;

        sessionAttributes.botState = 'FEEDBACK_LOOP';
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak('Thank you very much. Your skill is now configured and you can give your feedback now.')
            .reprompt('Thank you very much. You skill is configured and you can give your feedback now.')
            .getResponse();
    },
};

const SelectDeviceHandler = {

    canHandle(handlerInput) {
        console.log("SelectDeviceHandler > Tested");

        let stateCanHandleIntent = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        if (sessionAttributes.botState) {
            switch(sessionAttributes.botState) {
                case 'SELECT_DEVICE_STATE':
                    stateCanHandleIntent = true;  
                    break;
            }
        }
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectDevice' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectDeviceIntent');
    },

    handle(handlerInput) {
        console.log("SelectDeviceHandler > Used");
        console.log(handlerInput);
        console.log(handlerInput.requestEnvelope);
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
    
    
        const device_name = handlerInput.requestEnvelope.request.intent.slots.device_name.value;
        sessionAttributes.device_name = device_name;
        
        const device_id = handlerInput.requestEnvelope.request.intent.slots.device_name.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        sessionAttributes.device_id = device_id;
        
        attributesManager.setSessionAttributes(sessionAttributes);
        
        postFeedback(1,1,1,1);
        
        var speakOutput = `Thank you very much. So you want to give feedback regarding your ${device_name}. What type of feedback do you have? Is it a bug report, a feature request, a question or praise and criticism.`;

        sessionAttributes.botState = 'SELECT_FEEDBACK_TYPE_STATE';
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};


const GiveFeedbackIntentHandler = {

    canHandle(handlerInput) {
        // handle feedback only after the bot has been started
        let stateCanHandleIntent = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.botState && 
            sessionAttributes.botState === 'FEEDBACK_LOOP')
        {
            console.log("GiveFeedbackIntentHandler can handle this intent");
            stateCanHandleIntent = true;
        }
        return stateCanHandleIntent 
            && handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'GiveFeedbackIntent' ||
               handlerInput.requestEnvelope.request.intent.name === 'GiveFeedback')
    },

    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
    
        const feedback_type = handlerInput.requestEnvelope.request.intent.slots.feedback_type.value;
        sessionAttributes.feedback_type = feedback_type;
        const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
        sessionAttributes.feedback_content = feedback_content;

        sessionAttributes.botState = 'ELICIT_CONTACT_INFORMATION';
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak('Thank you i received your feedback. To enable the developer to contact you wee need your contact information. Do you allow the developer to contact you in case of any backquestions? Yes or no?')
            .reprompt('Thank you i received your feedback. To enable the developer to contact you wee need your contact information. Do you allow the developer to contact you in case of any ba')
            .getResponse();
    },
};

const ElicitContactInformationHandler = {

    canHandle(handlerInput) {
        console.log("ElicitContactInformationHandler > Tested");
        // handle feedback only after the bot has been started
        let stateCanHandleIntent = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.botState && 
            sessionAttributes.botState === 'ELICIT_CONTACT_INFORMATION')
        {
            console.log("ElicitContactInformationHandler can handle this intent");
            stateCanHandleIntent = true;
        }
        return stateCanHandleIntent 
            && handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'ElicitContactInformationIntent' ||
               handlerInput.requestEnvelope.request.intent.name === 'ElicitContactInformation');
    },

    handle(handlerInput) {
        console.log("ElicitContactInformationHandler > Used");
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
    
        //const feedback_type = handlerInput.requestEnvelope.request.intent.slots.feedback_type.value;
        //sessionAttributes.feedback_type = feedback_type;
        //const feedback_type = handlerInput.requestEnvelope.request.intent.slots.feedback_type.;
        //sessionAttributes.feedback_type = feedback_type;
        //const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
        //sessionAttributes.feedback_content = feedback_content;

        sessionAttributes.botState = 'SUBMIT_INFORMATION';
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak('Thank you very much. Do you want me to send your feedback to the developers now')
            .reprompt('Thank you very much. Do you want me to send your feedback to the developers now')
            .getResponse();
    },
};

const SubmitInformationHandler = {

    canHandle(handlerInput) {
        console.log("SubmitInformationHandler TESTED")

        let stateCanHandleIntent = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.botState && sessionAttributes.botState === 'SUBMIT_INFORMATION')
        {
            stateCanHandleIntent = true;
        }
        return stateCanHandleIntent;
    },

    handle(handlerInput) {
        console.log("SubmitInformationHandler STARTED")
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
    
        var feedback_content = sessionAttributes.feedback_content || "Empty feedback content";
        var feedbacker_id = 0;
        var product_id = 0;
        var url = "https://api.myfeedbackbot.com/feedback"
        this.http.post<global.any>(url, { 'feedback_content': feedback_content, 'feedbacker_id': feedbacker_id, 'product_id': product_id}).subscribe(data => {
            console.log(data);
        });
        
        sessionAttributes.botState = 'END';
        attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak('Thank you i received your feedback. ')
            .reprompt('Thank you I received your feedback.')
            .getResponse();
    },
};

//========== DEFAULT INTENTS ==========

/**
 * 
 */
const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    var speechOutput = sessionAttributes.last_speech_output || 'Nothing found to repeat';
    
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

/**
 * Availability: [ALL-States],
 * Effect: Presents the user with a help message
 *         based on the current state.
 */
const HelpIntentHandler = {
  canHandle(handlerInput) {
    console.log("HelpIntentHandler > Tested");
    
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  
  handle(handlerInput) {
    console.log("HelpIntentHandler > Used");
    
    //const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const requestAttributes = attributesManager.getRequestAttributes();
    
    var speechOutput = '';
    switch(sessionAttributes.botState) {
      case 'SKILL_CONFIGURATION_STATE':
        speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_HELP')
        break;
        
      case 'SELECT_DEVICE_STATE':
        speechOutput = requestAttributes.t('SELECT_DEVICE_STATE_HELP')
        break;
        
      case 'ELICIT_DEVICE_INFORMATION':
        speechOutput = 'We really need your device information, so you cannot skip this step. But you can cancel giving feedback by saying cancel.';
        break;
        
      case 'FEEDBACK_LOOP':
        speechOutput = 'You can always cancel giving feedback by saying stop';
        break;
        
      case 'ELICIT_CONTACT_INFORMATION':
        speechOutput = 'You dont need to provide contact information. You can skip this step by saying skip';
        break;
    }
    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
};

/**
 * Availability: [ALL-States],
 * Effect: Skips the current step or informs the user
 *         that skipping the current step is not possible.
 */
const SkipIntentHandler = {
  canHandle(handlerInput) {
    console.log("SkipIntentHandler > Tested");
    

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent';
          
  },
  handle(handlerInput) {
    console.log("SkipIntentHandler > Used");
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    var speechOutput = "";
    var shouldSessionEnd = false;
    
    switch (sessionAttributes.botState) {
        case 'OPENED':
            sessionAttributes.botState = 'ENDED';
            speechOutput = "Ok. See you the next time!";
            shouldSessionEnd = true;
            break;
            
            
        case 'REQUEST_SKILL_CONFIGURATION':
        case 'SKILL_CONFIGURATION':
            speechOutput = requestAttributes.t('SKILL_CONFIGURATION_NO_MESSAGE');
            shouldSessionEnd = false;
            sessionAttributes.botState = 'FEEDBACK_LOOP';
            break;
        
        
        case 'ELICIT_DEVICE_INFORMATION':
            speechOutput = "You can not skip this step. So giving feedback will be stopped";
            shouldSessionEnd = false;
            sessionAttributes.botState = 'END';
            break;
            
            
        case 'ELICIT_CONTACT_INFORMATION':
            speechOutput = "Sad to hear that you dont want to be contacted";
            shouldSessionEnd = false;
            sessionAttributes.botState = 'SUBMIT_INFORMATION';
            break;
            
            
        default:
            break;
    }
    
    sessionAttributes.last_speech_output = speechOutput;
    attributesManager.setSessionAttributes(sessionAttributes);
        
    return handlerInput.responseBuilder
      .speak(shouldSessionEnd)
      .withShouldEndSession(false);
  },
};

/**
 * 
 */
const RestartIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    var speechOutput = "Restart Message"
    
    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(false)
      .getResponse();
  },
};

/**
 * Availability: [ALL-States],
 * Effect: Exits the skill and resets session
 */
const StopIntentHandler = {
  canHandle(handlerInput) {
    console.log("StopIntentHandler > Tested")
    
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' ||
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent');
  },
  handle(handlerInput) {
    console.log("StopIntentHandler > Used")
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    
    //attributesManager.setSessionAttributes({})
    
    return handlerInput.responseBuilder
      .speak('Ok, goodbye!')
      .withShouldEndSession(true)
      .getResponse()

  },
};

/**
 * Availability: [ALL-States],
 * Effect:
 */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    console.log("FallbackIntentHandler > Tested")
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent' 
  },
  handle(handlerInput) {
    console.log("FallbackIntentHandler > Used")
    return handlerInput.responseBuilder
      .speak('')
      .reprompt('Fallback Intent')
      .getResponse();
  },
};

/**
 * Availability: [ALL-States],
 * Effect: 
 */
const UnhandledIntentHandler = {
  canHandle() {
    console.log("UnhandledIntentHandler > Tested")
    return true;
  },
  handle(handlerInput) {
    console.log("UnhandledIntentHandler > Used")
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    return handlerInput.responseBuilder
      .speak('Unhandled Intent')
      .reprompt('Unhandled Intent')
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak(`Error: ${error.message}`)
      .reprompt(`Error: ${error.message}`)
      .getResponse();
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: Alexa.getLocale(handlerInput.requestEnvelope),
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

function getPersistenceAdapter() {
   // Determines persistence adapter to be used based on environment
    const s3Adapter = require('ask-sdk-s3-persistence-adapter');
    /*return new s3Adapter.S3PersistenceAdapter({
      bucketName: process.env.S3_PERSISTENCE_BUCKET,
    });*/
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .withPersistenceAdapter(getPersistenceAdapter())
  .addRequestHandlers(
    LaunchRequest,
    
    YesIntentHandler,
    NoIntentHandler,
    
    SkillConfigurationHandler,
    SelectDeviceHandler,
    GiveFeedbackIntentHandler,
    ElicitContactInformationHandler,
    SubmitInformationHandler,
    
    RepeatIntentHandler,
    HelpIntentHandler,

    SkipIntentHandler,
    RestartIntentHandler,
    StopIntentHandler,
    
    FallbackIntentHandler,
    UnhandledIntentHandler,
        
    SessionEndedRequest
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
