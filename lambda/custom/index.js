/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
const Alexa = require('ask-sdk-core');
const https = require('https');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const languageStrings = {
  'en': require('./languageStrings')
};
const hostUrl = 'api.myfeedbackbot.com';

function getFeedbackerName(apiAccessToken, callback) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.name", apiAccessToken, callback);
}

function getFeedbackerEmailAddress(apiAccessToken, callback) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.email", apiAccessToken, callback);
}

function getFeedbackerTelephoneNumber(apiAccessToken, callback) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.mobileNumber", callback);
}

function getInformationFromAlexaApi(path, apiAccessToken, callback) {
  let options = {
    method: 'GET',

    protocol: 'https:',
    hostname: 'api.eu.amazonalexa.com',
    port: 443,
    path: path,

    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + apiAccessToken
    }
  };
  return httpsGet(options, callback);
}

function httpsGet(options, callback) {
  let req = https.get(options, res => {
    res.setEncoding('utf8');
    var responseString = "";

    res.on('data', chunk => {
      responseString = responseString + chunk;
    });

    res.on('end', () => {
      callback(responseString);
      return responseString;
    });
    console.log("Response string:" + responseString);
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
  /*httpGet('/alexa/new-replies', (data) => { "DATA" + console.log(data) });*/
}

function postFeedbacker() {

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

    const apiAccessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;



    var feedbacker_name, feedbacker_email_address, feedbacker_telephone_number;

    getFeedbackerName(apiAccessToken, function (name) { feedbacker_name = name });
    getFeedbackerEmailAddress(apiAccessToken, function(email_address) { feedbacker_email_address = email_address });
    getFeedbackerTelephoneNumber(apiAccessToken, function(telephone_number) { feedbacker_telephone_number = telephone_number });

    console.log("FeedbackerName: " + feedbacker_name);
    console.log("FeedbackerEmailAddress: " + feedbacker_email_address);
    console.log("FeedbackerTelephoneNumber: " + feedbacker_telephone_number);

    var speechOutput = "";

    speechOutput = requestAttributes.t('SELECT_ACTION_STATE_ENTER');
    sessionAttributes.botState = 'SELECT_ACTION_STATE';

    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withAskForPermissionsConsentCard([
        "alexa::profile:name:read",
        "alexa::profile:email:read",
        "alexa::profile:mobile_number:read"
      ])
      .reprompt(speechOutput)
      .getResponse();
  },
};

const SelectActionHandler = {
  canHandle(handlerInput) {
    console.log("SelectActionHandler > Tested");

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelectAction';
  },
  async handle(handlerInput) {
    console.log("SelectActionHandler > Used");
    console.log(handlerInput);
    console.log(handlerInput.requestEnvelope);

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
};

/*const SkillConfigurationHandler = {

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
    console.log(handlerInput.requestEnvelope);

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
};*/

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
    console.log(handlerInput.requestEnvelope);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const product_name = handlerInput.requestEnvelope.request.intent.slots.product_name.value;
    sessionAttributes.product_name = product_name;

    const product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product_name.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.product_id = product_id;

    //let speechOutput = `Thank you very much. So you want to give feedback regarding your ${product_name}. What type of feedback do you have? Is it a bug report, a feature request, a question, criticism or general feedback.`;
    let speechOutput = requestAttributes.t('SELECT_DEVICE_STATE_EXIT') + product_name + '. ' + requestAttributes.t('SELECT_FEEDBACK_TYPE_STATE_ENTER');

    sessionAttributes.botState = 'SELECT_FEEDBACK_TYPE_STATE';
    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

const FeedbackHandler = {

  canHandle(handlerInput) {
    console.log("FeedbackHandler > Tested");

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'SubmitBugReport' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'SubmitFeatureRequest' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'SubmitQuestion' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'SubmitCriticism' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'SubmitGeneralFeedback');
  },

  handle(handlerInput) {
    console.log("FeedbackHandler > Used");
    console.log(handlerInput);
    console.log(handlerInput.requestEnvelope);

    let speechOutput = 'Thank you very much your feedback got submitted';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(speechOutput)
      .getResponse();
  },
};

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
    console.log(handlerInput.requestEnvelope);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();


    const product_name = handlerInput.requestEnvelope.request.intent.slots.product_name.value;
    sessionAttributes.product_name = product_name;

    const product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product_name.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    sessionAttributes.product_id = product_id;

    var speechOutput = `Thank you very much. So you want to give feedback regarding your ${product_name}. What type of feedback do you have? Is it a bug report, a feature request, a question, criticism or general feedback.`;

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
 * Availability: [ALL-States],
 * Effect: Restarts the skill but does not reset the session
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

    let speechOutput = requestAttributes.t('STOP_MESSAGE');
    return handlerInput.responseBuilder
      .speak(speechOutput)
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
    console.log(handlerInput.requestEnvelope);

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
    console.log(handlerInput.requestEnvelope);

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

    FeedbackHandler,

    CheckRepliesHandler,

    //SkillConfigurationHandler,

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
