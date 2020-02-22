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
const hostUrl = 'api.myfeedbackbot.com';

function httpGet(query, callback) {
  var options = {
    host: hostUrl,
    port: 443,
    path: '/' + encodeURIComponent(query),
    method: 'GET',
  };

  var req = https.request(options, res => {
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
      return responseString;
    });
    return responseString;
  });
  req.end();
}

function postFeedback(feedbacker_id, product_id, feedback_type_id, feedback_content) {
  var feedback = {};
  feedback.feedbacker_id = feedbacker_id
  feedback.product_id = product_id;
  feedback.feedback_type_id = feedback_type_id;
  feedback.feedback_content = feedback_content;
  const data = JSON.stringify(feedback);

  const options = {
    hostname: hostUrl,
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

function getUnacknowledgedReplies() {
  httpGet('/alexa/new-replies', (data) => { "DATA" + console.log(data) });
}

function saveSessionAttributes(attributesManager, sessionAttributes, speechOutput) {
  sessionAttributes.last_speech_output = speechOutput;
  sessionAttributes.botState = sessionAttributes.botState;
  attributesManager.setSessionAttributes(sessionAttributes);
}

//========== SETUP ==========

const initialSessionAttributes = {
  botState: 'SELECT_ACTION_STATE',
  product_id: 0,
  product_name: '',
  feedback_type_id: 0,
  feedback_type_name: '',
  feedback_content: ''
}


//========== CUSTOM INTENT HANDLER ==========

const LaunchRequest = {
  canHandle(handlerInput) {
    console.log("LaunchRequest > Tested");

    return Alexa.isNewSession(handlerInput.requestEnvelope) ||
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    console.log("LaunchRequest > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    var sessionAttributes = {};

    var speechOutput = "";

    /*if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_CONFIRM');
        sessionAttributes.botState = "SKILL_CONFIGURATION_STATE_CONFIRM";
    }
    else {
        speechOutput = requestAttributes.t('INITIAL_STATE');
        sessionAttributes.botState = 'INITIAL_STATE';
    }*/
    speechOutput = requestAttributes.t('SELECT_ACTION_STATE_ENTER');
    sessionAttributes.botState = 'SELECT_ACTION_STATE';


    //sessionAttributes.last_speech_output = speechOutput;
    //attributesManager.setSessionAttributes(sessionAttributes);

    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const SelectActionHandler = {
  canHandle(handlerInput) {
    console.log("SelectActionHandler > Tested");

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    /*let stateCanHandleIntent = false;
    if (sessionAttributes.botState) {
        switch(sessionAttributes.botState) {
            case 'SELECT_ACTION':
                stateCanHandleIntent = true;  
                break;
        }
    }*/

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectAction';
  },
  async handle(handlerInput) {
    console.log("SelectActionHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const action_type = handlerInput.requestEnvelope.request.intent.slots.action_type.value;
    const action_id = handlerInput.requestEnvelope.request.intent.slots.action_type.resolutions.resolutionsPerAuthority[0].values[0].value.id;

    let speechOutput = '';
    switch (action_id) {
      case 1:
      case '1':
        sessionAttributes.botState = 'SELECT_DEVICE_STATE';
        speechOutput = requestAttributes.t('SELECT_DEVICE_STATE_ENTER');
        break;
      case 2:
      case '2':
        sessionAttributes.botState = 'CHECK_REPLIES_STATE';
        speechOutput = requestAttributes.t('CHECK_REPLIES_STATE_ENTER');
        console.log(getUnacknowledgedReplies());
        break;
      case 3:
      case '3':
        sessionAttributes.botState = 'SKILL_CONFIGURATION_STATE';
        speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_ENTER');
        break;
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  }
}


const YesIntentHandler = {
  canHandle(handlerInput) {
    console.log("YesIntentHandler > Tested");

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    let stateCanHandleIntent = false;
    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'INITIAL_STATE':
        case 'SKILL_CONFIGURATION_STATE_CONFIRM':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent &&
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
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
      switch (sessionAttributes.botState) {
        case 'SKILL_CONFIGURATION_STATE_CONFIRM':
        case 'CONTACT_PREFERENCES_STATE_CONFIRM':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent &&
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
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
    console.log("SkillConfigurationHandler > Tested");
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    var stateCanHandleIntent = false;
    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'SKILL_CONFIGURATION_STATE':
          stateCanHandleIntent = true;
      }
    }

    return stateCanHandleIntent &&
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'SkillConfigurationIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'SkillConfiguration');
  },

  handle(handlerInput) {
    console.log("SkillConfigurationHandler > Used");

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedbacker_name = handlerInput.requestEnvelope.request.intent.slots.feedbacker_name.value;
    sessionAttributes.feedbacker_name = feedbacker_name;

    const feedbacker_email_address = handlerInput.requestEnvelope.request.intent.slots.feedbacker_email_address.value;
    sessionAttributes.feedbacker_email_address = feedbacker_email_address;

    sessionAttributes.botState = 'SELECT_ACTION_STATE';
    attributesManager.setSessionAttributes(sessionAttributes);

    let speechOutput = requestAttributes.t('SKILL_CONFIGURATION_STATE_EXIT') + requestAttributes.t('SELECT_ACTION_STATE_ENTER');

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
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
      switch (sessionAttributes.botState) {
        case 'SELECT_DEVICE_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectDevice';
  },

  handle(handlerInput) {
    console.log("SelectDeviceHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const product_name = handlerInput.requestEnvelope.request.intent.slots.device_name.value;
    sessionAttributes.product_name = product_name;

    const product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.device_name.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.product_id = product_id;

    //let speechOutput = `Thank you very much. So you want to give feedback regarding your ${product_name}. What type of feedback do you have? Is it a bug report, a feature request, a question, criticism or general feedback.`;
    let speechOutput = requestAttributes.t('SELECT_DEVICE_STATE_EXIT') + product_name + '.' + requestAttributes.t('SELECT_FEEDBACK_TYPE_STATE_ENTER');

    sessionAttributes.botState = 'SELECT_FEEDBACK_TYPE_STATE';
    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const SelectFeedbackTypeHandler = {

  canHandle(handlerInput) {
    console.log("SelectFeedbackTypeHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'SELECT_FEEDBACK_TYPE_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent &&
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectFeedbackType';
  },

  handle(handlerInput) {
    console.log("SelectFeedbackTypeHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();


    const feedback_type_name = handlerInput.requestEnvelope.request.intent.slots.feedback_type.value;
    sessionAttributes.feedback_type_name = feedback_type_name;

    const feedback_type_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.feedback_type.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.feedback_type_id = feedback_type_id;

    let speechOutput = '';
    switch (feedback_type_id) {
      case 1:
        speechOutput = requestAttributes.t('ADMIT_BUG_REPORT_STATE_ENTER');
        sessionAttributes.botState = 'ADMIT_BUG_REPORT_STATE';
        break;
      case 2:
        console.log("case 2 invoked!");
        speechOutput = requestAttributes.t('ADMIT_FEATURE_REQUEST_STATE_ENTER');
        sessionAttributes.botState = 'ADMIT_FEATURE_REQUEST_STATE';
        break;
      case 3:
        speechOutput = requestAttributes.t('ADMIT_QUESTION_STATE_ENTER');
        sessionAttributes.botState = 'ADMIT_QUESTION_STATE';
        break;
      case 4:
        speechOutput = requestAttributes.t('ADMIT_CRITICISM_STATE_ENTER');
        sessionAttributes.botState = 'ADMIT_CRITICISM_STATE';
        break;
      case 5:
        speechOutput = requestAttributes.t('ADMIT_GENERAL_FEEDBACK_STATE_ENTER');
        sessionAttributes.botState = 'ADMIT_GENERAL_FEEDBACK_STATE';
        break;
    }

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const AdmitBugReportHandler = {

  canHandle(handlerInput) {
    console.log("AdmitBugReportHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'ADMIT_BUG_REPORT_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent &&
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectFeedbackType';
  },

  handle(handlerInput) {
    console.log("SelectFeedbackTypeHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_type_name = handlerInput.requestEnvelope.request.intent.slots.feedback_type.value;
    sessionAttributes.feedback_type_name = feedback_type_name;

    const feedback_type_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.feedback_type.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.feedback_type_id = feedback_type_id;

    let speechOutput = 'test';
    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const AdmitFeatureRequestHandler = {

  canHandle(handlerInput) {
    console.log("AdmitFeatureRequestHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'ADMIT_FEATURE_REQUEST_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent;
  },

  handle(handlerInput) {
    console.log("AdmitQuestionHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
    sessionAttributes.feedback_content = feedback_content;

    postFeedback(1, sessionAttributes.product_id, sessionAttributes.feedback_type_id, sessionAttributes.feedback_content);
    let speechOutput = requestAttributes.t('ADMIT_QUESTION_STATE_EXIT');
    sessionAttributes.botState('END');

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const AdmitQuestionHandler = {

  canHandle(handlerInput) {
    console.log("AdmitQuestionHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'ADMIT_QUESTION_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent;
  },

  handle(handlerInput) {
    console.log("AdmitQuestionHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
    sessionAttributes.feedback_content = feedback_content;

    postFeedback(1, sessionAttributes.product_id, sessionAttributes.feedback_type_id, sessionAttributes.feedback_content);
    let speechOutput = requestAttributes.t('ADMIT_QUESTION_STATE_EXIT');
    sessionAttributes.botState('END');

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const AdmitCriticismHandler = {

  canHandle(handlerInput) {
    console.log("AdmitCriticismHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'ADMIT_CRITICISM_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent;
  },

  handle(handlerInput) {
    console.log("AdmitCriticismHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
    sessionAttributes.feedback_content = feedback_content;

    let speechOutput = requestAttributes.t('ADMIT_CRITICISM_STATE_EXIT') + requestAttributes.t('SELECT_CONTACT_PREFERENCES_STATE_ENTER');
    sessionAttributes.botState('');

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const AdmitGeneralFeedbackHandler = {

  canHandle(handlerInput) {
    console.log("AdmitGeneralFeedbackHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'ADMIT_GENERAL_FEEDBACK_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent;
  },

  handle(handlerInput) {
    console.log("AdmitGeneralFeedbackHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
    sessionAttributes.feedback_content = feedback_content;

    let speechOutput = requestAttributes.t('ADMIT_GENERAL_FEEDBACK_STATE_EXIT') + requestAttributes.t('SELECT_CONTACT_PREFERENCES_STATE_ENTER');
    sessionAttributes.botState('SELECT_CONTACT_PREFERENCES_STATE');

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const SelectContactPreferencesHandler = {

  canHandle(handlerInput) {
    console.log("SelectContactPreferencesHandler  > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'SELECT_CONTACT_PREFERENCES_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return stateCanHandleIntent;
  },

  handle(handlerInput) {
    console.log("SelectContactPreferencesHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const feedback_content = handlerInput.requestEnvelope.request.intent.slots.feedback_content.value;
    sessionAttributes.feedback_content = feedback_content;

    let speechOutput = requestAttributes.t('ADMIT_GENERAL_FEEDBACK_STATE_EXIT') + requestAttributes.t('SELECT_CONTACT_PREFERENCES_STATE_ENTER');
    sessionAttributes.botState('SELECT_CONTACT_PREFERENCES_STATE');

    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

/*const ElicitContactInformationHandler = {

  canHandle(handlerInput) {
    console.log("ElicitContactInformationHandler > Tested");
    // handle feedback only after the bot has been started
    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState &&
      sessionAttributes.botState === 'ELICIT_CONTACT_INFORMATION') {
      console.log("ElicitContactInformationHandler can handle this intent");
      stateCanHandleIntent = true;
    }
    return stateCanHandleIntent &&
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'ElicitContactInformationIntent' ||
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
};*/

/*const SubmitInformationHandler = {

  canHandle(handlerInput) {
    console.log("SubmitInformationHandler TESTED")

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState && sessionAttributes.botState === 'SUBMIT_INFORMATION') {
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
    this.http.post < global.any > (url, { 'feedback_content': feedback_content, 'feedbacker_id': feedbacker_id, 'product_id': product_id }).subscribe(data => {
      console.log(data);
    });

    sessionAttributes.botState = 'END';
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak('Thank you i received your feedback. ')
      .reprompt('Thank you I received your feedback.')
      .getResponse();
  },
};*/

//========== SKILL CONFIGURATION ==========
const CheckRepliesHandler = {

  canHandle(handlerInput) {
    console.log("CheckRepliesHandler > Tested");

    let stateCanHandleIntent = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.botState) {
      switch (sessionAttributes.botState) {
        case 'SELECT_DEVICE_STATE':
          stateCanHandleIntent = true;
          break;
      }
    }

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectDevice';

  },

  handle(handlerInput) {
    console.log("SelectDeviceHandler > Used");
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();


    const device_name = handlerInput.requestEnvelope.request.intent.slots.device_name.value;
    sessionAttributes.device_name = device_name;

    const device_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.device_name.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.device_id = device_id;

    var speechOutput = `Thank you very much. So you want to give feedback regarding your ${device_name}. What type of feedback do you have? Is it a bug report, a feature request, a question, criticism or general feedback.`;

    sessionAttributes.botState = 'SELECT_FEEDBACK_TYPE_STATE';
    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

//========== SKILL CONFIGURATION ==========

//========== DEFAULT INTENTS ==========

/**
 * 
 */
const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
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

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },

  handle(handlerInput) {
    console.log("HelpIntentHandler > Used");

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const requestAttributes = attributesManager.getRequestAttributes();
    
    let help_message = sessionAttributes.botState + '_HELP';
    console.log(help_message);
    
    var speechOutput = requestAttributes.t(help_message) || requestAttributes.t('HELP_MESSAGE');
    /*switch (sessionAttributes.botState) {
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
    }*/
    

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .withShouldEndSession(false)
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


    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent';

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
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    var speechOutput = requestAttributes.t('RESTART_MESSAGE') + requestAttributes.t('SELECT_ACTION_STATE_ENTER');

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

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' ||
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
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
  },
  handle(handlerInput) {
    console.log("FallbackIntentHandler > Used")
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();

    let speechOutput = requestAttributes.t('FALLBACK_INTENT_MESSAGE');

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
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
    console.log(handlerInput);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let speechOutput = requestAttributes.t('UNHANDLED_INTENT_MESSAGE');

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
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

    SelectActionHandler,
    SelectDeviceHandler,
    SelectFeedbackTypeHandler,

    AdmitBugReportHandler,
    AdmitFeatureRequestHandler,
    AdmitQuestionHandler,
    AdmitCriticismHandler,
    AdmitGeneralFeedbackHandler,

    //GiveFeedbackIntentHandler,
    SelectContactPreferencesHandler,
    //SubmitInformationHandler,

    CheckRepliesHandler,

    SkillConfigurationHandler,

    YesIntentHandler,
    NoIntentHandler,

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
