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

const ListOfActions = require('./cards/list-of-actions.json');
const ListOfProducts = require('./cards/list-of-products.json');

const ACTION_LIST_TOKEN = 'actionlistToken';
const PRODUCT_LIST_TOKEN = 'productlistToken';

function getFeedbackerName(apiAccessToken) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.name", apiAccessToken);
}

function getFeedbackerEmailAddress(apiAccessToken) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.email", apiAccessToken);
}

function getFeedbackerTelephoneNumber(apiAccessToken) {
  return getInformationFromAlexaApi("/v2/accounts/~current/settings/Profile.mobileNumber", apiAccessToken);
}

function getInformationFromAlexaApi(path, apiAccessToken) {
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

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });
  });
}

function getProducts() {
  let options = {
    method: 'GET',

    protocol: 'https:',
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: '/alexa/products',

    headers: {
      'Accept': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      let chunks_of_data = [];
      if (response.statusCode == 200) {

        response.on('data', (fragments) => {
          chunks_of_data.push(fragments);
        });

        response.on('end', () => {
          let response_body = Buffer.concat(chunks_of_data);
          resolve(response_body.toString());
        });

        response.on('error', (error) => {
          reject(error);
        });
      }
      else {
        reject(response);
      }
    });
  });
}


function getProductFeedbackReply(feedbacker_id, product_id) {
  let options = {
    method: 'GET',

    protocol: 'https:',
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: `/feedbacker/${feedbacker_id}/product/${product_id}/replies`,

    headers: {
      'Accept': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });
  });
}

function getProductsWithAnsweredFeedback(feedbacker_id) {
  let options = {
    method: 'GET',

    protocol: 'https:',
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: `/alexa/products/${feedbacker_id}/replied`,

    headers: {
      'Accept': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });
  });
}

function getReplies(feedbacker_id) {
  let options = {
    method: 'GET',

    protocol: 'https:',
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: `/alexa/feedbacker/${feedbacker_id}/replies`,

    headers: {
      'Accept': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });
  });
}

/**
 * 
 */
function postFeedbacker(feedbacker) {

  const data = JSON.stringify(feedbacker);
  let options = {
    method: 'PUT',

    protocol: 'https:',
    hostname: 'api.myfeedbackbot.com',
    port: 443,
    path: '/feedbacker',

    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    var req = https.request(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(data)
    req.end();
  });
}

function acknowledgeReply(feedback_id) {
  const options = {
    hostname: hostUrl,
    port: 443,
    path: '/feedback',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  return new Promise((resolve, reject) => {
    var req = https.request(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(data)
    req.end();
  });
}

/**
 * 
 */
function postFeedback(feedback) {
  const data = JSON.stringify(feedback);
  console.log("DATA: " + data);

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

  return new Promise((resolve, reject) => {
    var req = https.request(options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);

        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });

    req.on('error', error => {
      console.error(error);
    });

    req.write(data)
    req.end();
  });

}

function getUnacknowledgedReplies() {
  /*httpGet('/alexa/new-replies', (data) => { "DATA" + console.log(data) });*/
}

function saveSessionAttributes(attributesManager, sessionAttributes, speechOutput) {
  sessionAttributes.last_speech_output = speechOutput;
  sessionAttributes.botState = sessionAttributes.botState;
  attributesManager.setSessionAttributes(sessionAttributes);
}

//========== SETUP ==========

var initialSessionAttributes = {
  botState: 'LAUNCH_STATE',
  feedbacker_id: 0,
  product_id: 0,
  product_name: '',
  feedbacker: {}
}


//========== CUSTOM INTENT HANDLER ==========

/**
 * 
 */
const LaunchRequest = {
  canHandle(handlerInput) {
    console.log("LaunchRequest > Tested");

    return Alexa.isNewSession(handlerInput.requestEnvelope) ||
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    console.log("LaunchRequest > Used");
    console.log(handlerInput);
    console.log(handlerInput.requestEnvelope);
    let responseBuilder = handlerInput.responseBuilder;

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();

    const apiAccessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

    const speechOutput = requestAttributes.t('LAUNCH_MESSAGE');

    const feedbacker_name = await getFeedbackerName(apiAccessToken).then((response) => {
      return response;
    }).catch((error) => {
      console.log("ERROR @ getFeedbackerName:" + error);
    });

    const feedbacker_email_address = await getFeedbackerEmailAddress(apiAccessToken).then((response) => {
      return response;
    }).catch((error) => {
      console.log("ERROR @ getFeedbackerEmailAddress:" + error);
    });

    const feedbacker_telephone_number = await getFeedbackerTelephoneNumber(apiAccessToken).then((response) => {
      return response;
    }).catch((error) => {
      console.log("ERROR @ getFeedbackerTelephoneNumber:" + error);
    });

    const feedbacker = {
      feedbacker_name: feedbacker_name,
      feedbacker_email_address: feedbacker_email_address,
      feedbacker_telephone_number: feedbacker_telephone_number
    };

    const feedbacker_id = await postFeedbacker(feedbacker).then((response) => {
      console.log(response);
      let feedbacker = JSON.parse(response);
      return feedbacker[0].feedbacker_id;
    }).catch((error) => {
      console.log("ERROR @ getFeedbackerId:" + error);
    });

    const products = await getProducts().then((response) => {
      return JSON.parse(response);
    }).catch((error) => {
      speechOutput = "Hey, I am your feedback bot. Sadly, I could not reach the feedback server. Please wait until it is reachable again.";
      console.log("ERROR @ getProducts:" + error);
      return [];
    });

    const dynamicEntities = {
      type: "Dialog.UpdateDynamicEntities",
      updateBehavior: "REPLACE",
      types: [{
        "name": "Product",
        "values": products
      }]
    };

    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
      console.log("My device supports APL");
      responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: PRODUCT_LIST_TOKEN,
        document: ListOfProducts
      });
    }

    initialSessionAttributes.feedbacker_id = feedbacker_id;
    initialSessionAttributes.feedbacker = feedbacker;

    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(
        `What would you like to do?`,
        `\r\n- Report Error \r\n- Suggest new Functionality \r\n- Ask Question \r\n- Share Criticism \r\n- Give General Feedback \r\n- Check Replies to given Feedback`
      )
      /*.withAskForPermissionsConsentCard([
        "alexa::profile:name:read",
        "alexa::profile:email:read",
        "alexa::profile:mobile_number:read"
      ])*/
      .reprompt(speechOutput)
      .addDirective(dynamicEntities)
      .getResponse();
  },
};

/**
 * 
 */
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

  async handle(handlerInput) {
    console.log("FeedbackHandler > Used");
    console.log("handlerInput" + handlerInput);
    console.log("handlerInput.requestEnvelope" + handlerInput.requestEnvelope);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let feedback_contact_permission = parseInt(handlerInput.requestEnvelope.request.intent.slots.contact_permission.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    var feedbacker_id = 1;

    if (feedback_contact_permission == 1) {
      feedbacker_id = sessionAttributes.feedbacker_id;
    }

    const product_name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'product');
    let product_id;
    if (product_name != null) {
      if (handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[0].values != null) {
        product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[0].values[0].value.id);
      }
      else if (handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[1].values != null) {
        product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[1].values[0].value.id);
      }
      else {
        product_id = 1;
      }
    }

    const feedback_content = Alexa.getSlotValue(handlerInput.requestEnvelope, 'content');
    const feedback_context = Alexa.getSlotValue(handlerInput.requestEnvelope, 'context');
    const feedback_steps_to_reproduce = Alexa.getSlotValue(handlerInput.requestEnvelope, 'steps_to_reproduce');
    const feedback_criticality = Alexa.getSlotValue(handlerInput.requestEnvelope, 'criticality');
    const feedback_problem = Alexa.getSlotValue(handlerInput.requestEnvelope, 'problem');
    const feedback_solution = Alexa.getSlotValue(handlerInput.requestEnvelope, 'solution');
    const feedback_importance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'importance');
    const feedback_star_rating = Alexa.getSlotValue(handlerInput.requestEnvelope, 'star_rating');

    const allElements = {
      product_id: product_id,
      product_name: product_name,

      feedbacker_id: feedbacker_id,

      feedback_content: feedback_content,
      feedback_context: feedback_context,
      feedback_steps_to_reproduce: feedback_steps_to_reproduce,
      feedback_criticality: feedback_criticality,
      feedback_problem: feedback_problem,
      feedback_solution: feedback_solution,
      feedback_importance: feedback_importance,
      feedback_star_rating: feedback_star_rating
    }

    let speechOutput = requestAttributes.t('FEEDBACK_SUBMIT_MESSAGE');

    var feedback = {};

    const intent = Alexa.getIntentName(handlerInput.requestEnvelope);
    console.log(intent);
    switch (intent) {
      case 'SubmitBugReport':
        feedback = {
          feedback_type_id: 1,
          feedbacker_id: feedbacker_id,
          product_id: product_id,
          feedback_content: feedback_content,
          feedback_context: feedback_context,
          feedback_steps_to_reproduce: feedback_steps_to_reproduce,
          feedback_criticality: feedback_criticality
        };

        if (feedback_contact_permission) {
          speechOutput = requestAttributes.t('SUBMIT_BUG_REPORT');
        }
        else {
          speechOutput = requestAttributes.t('SUBMIT_ANONYMOUS_BUG_REPORT');
        }
        break;

      case 'SubmitFeatureRequest':
        feedback = {
          feedback_type_id: 2,
          feedbacker_id: feedbacker_id,
          product_id: product_id,
          feedback_content: feedback_content,
          feedback_context: feedback_context,
          feedback_problem: feedback_problem,
          feedback_solution: feedback_solution
        };

        if (feedback_contact_permission) {
          speechOutput = requestAttributes.t('SUBMIT_FEATURE_REQUEST');
        }
        else {
          speechOutput = requestAttributes.t('SUBMIT_ANONYMOUS_FEATURE_REQUEST');
        }
        break;

      case 'SubmitQuestion':
        feedback = {
          feedback_type_id: 3,
          feedbacker_id: feedbacker_id,
          product_id: product_id,
          feedback_content: feedback_content,
          feedback_importance: feedback_importance,
        };

        if (feedback_contact_permission) {
          speechOutput = requestAttributes.t('SUBMIT_QUESTION');
        }
        else {
          speechOutput = requestAttributes.t('SUBMIT_ANONYMOUS_QUESTION');
        }
        break;

      case 'SubmitCriticism':
        feedback = {
          feedback_type_id: 4,
          feedbacker_id: feedbacker_id,
          product_id: product_id,
          feedback_content: feedback_content,
          feedback_star_rating: feedback_star_rating,
        };

        if (feedback_contact_permission) {
          speechOutput = requestAttributes.t('SUBMIT_CRITICISM');
        }
        else {
          speechOutput = requestAttributes.t('SUBMIT_ANONYMOUS_CRITICISM');
        }
        break;

      case 'SubmitGeneralFeedback':
        feedback = {
          feedback_type_id: 5,
          feedbacker_id: feedbacker_id,
          product_id: product_id,
          feedback_content: feedback_content,
        };

        if (feedback_contact_permission) {
          speechOutput = requestAttributes.t('SUBMIT_GENERAL_FEEDBACK');
        }
        else {
          speechOutput = requestAttributes.t('SUBMIT_ANONYMOUS_GENERAL_FEEDBACK');
        }
        break;
    }
    console.log("Feedback: " + feedback);
    await postFeedback(feedback).then((response) => {
      console.log(response);
    });

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

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckReplies';
  },

  async handle(handlerInput) {
    console.log("CheckRepliesHandler > Used");
    console.log(handlerInput);
    console.log(handlerInput.requestEnvelope);


    const { attributesManager } = handlerInput;
    let responseBuilder = handlerInput.responseBuilder;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const replies = await getReplies(sessionAttributes.feedbacker_id).then((response) => {
      console.log("Replies Response: " + response);
      if (response != []) {
        return JSON.parse(response);
      }
      else {
        return [];
      }
    }).catch((error) => {
      console.log(error);
      return [];
    });

    let speechOutput;
    let card_header;
    let card_content;

    if (typeof replies !== 'undefined' && replies.length != 0) {

      let feedbacker_id = sessionAttributes.feedbacker_id;
      /*const products_with_answered_feedback = await getProductsWithAnsweredFeedback(feedbacker_id).then((response) => {
        console.log("Products with answered feedback: " + response);
        if (response != []) {
          return JSON.parse(response);
        }
        else {
          return [];
        }
      }).catch((error) => {
        console.log(error);
      });*/
      var string_of_products = replies.map(e => e.company_name + ' ' + e.product_name).join(', ');
      var list_of_products = replies.map(e => e.company_name + ' ' + e.product_name).join(' \r\n ');
      var json_products = [];

      replies.forEach(function(product) {
        let product_id = product.product_id;
        let product_name = product.company_name + ' ' + product.product_name;
        let product_synonym = product.product_name;
        
        let json_product = {
          "id": product_id,
          "name": {
            "value": product_name,
            "synonyms": [product_synonym]
          }
        };
        json_products.push(json_product);
      });
      console.log("JSON PRODUCTS: " + json_products);
      console.log("STRING OF PRODUCTS: " + string_of_products);
      console.log("LIST OF PRODUCTS: " + list_of_products);

      const dynamicEntities = {
        type: "Dialog.UpdateDynamicEntities",
        updateBehavior: "REPLACE",
        types: [{
          "name": "ProductWithReply",
          "values": json_products
        }]
      };

      let products_with_replies = replies.map(e => e.company_name + ' ' + e.product_name).join(', ');
      let products_with_new_replies = replies.map(e => e.company_name + ' ' + e.product_name).join('\n');

      var next_intent_name;

      let number_of_replies = replies.length;
      console.log(number_of_replies);

      if (number_of_replies > 0) {
        next_intent_name = 'ReadReplies';
        speechOutput = `Okay you have ${replies.length} new replies regarding feedback for ${products_with_replies}. What device do you want to select.`;
        //card = new SimpleCard("heading", "body");
      }
      else {
        next_intent_name = 'LaunchRequest';
        speechOutput = `You have no replies`;
      }
      console.log("Next intent name" + next_intent_name);

      sessionAttributes.botState = 'CHECK_REPLIES_STATE';
      saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);
    }
    else {
      speechOutput = "Sorry, you don't have any new replies";
      card_header = "Check Replies"
      card_content = "Sorry, you don't have any new replies";
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(
        card_header,
        card_content
      )
      /*.addDirective(dynamicEntities)
      .addDelegateDirective({
        name: 'ReadReplies',
        confirmationStatus: 'NONE',
        slots: {}
      })*/
      .reprompt(speechOutput)
      .getResponse();
  },
};

const ReadRepliesHandler = {

  canHandle(handlerInput) {
    console.log("ReadRepliesHandler > Tested");

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadReplies';
  },

  async handle(handlerInput) {
    console.log("ReadRepliesHandler > Used");
    console.log(handlerInput);
    console.log(handlerInput.requestEnvelope);

    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    /*let replies = await getReplies(sessionAttributes.feedbacker_id).then((response) => {
      console.log("Replies Response: " + response);
      return JSON.parse(response);
    }).catch((error) => {
      console.log(error);
    });*/

    const product_name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'product');
    let product_id;
    if (product_name != null) {
      if (handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[0].values != null) {
        product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[0].values[0].value.id);
      }
      else if (handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[1].values != null) {
        product_id = parseInt(handlerInput.requestEnvelope.request.intent.slots.product.resolutions.resolutionsPerAuthority[1].values[0].value.id);
      }
      else {
        product_id = 1;
      }
    }

    let replies = await getProductFeedbackReply(sessionAttributes.feedbacker_id, product_id).then((response) => {
      console.log("Single reply: " + response);
      return JSON.parse(response);
    }).catch((error) => {
      console.log(error);
    });

    let feedback_content = '';
    let reply_content = '';
    if (replies.length > 0) {
      reply_content = replies[0].reply_content;
      feedback_content = replies[0].feedback_content;
    }

    var speechOutput = `The reply to your feedback quote "${feedback_content}" is quote "${reply_content}"`;
    const card = '';



    saveSessionAttributes(attributesManager, sessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      /*.withSimpleCard(
        "Reply",
        `Product: ${product}.\r\n ${reply_content}`)*/
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
 * Description: Deals with intents when the user wants to skip a step.
 * Availability: [ALL-States]
 * Effect: Skips the current step or informs the user
 *         that skipping the current step is not possible.
 */
const SkipIntentHandler = {
  canHandle(handlerInput) {
    console.log("SkipIntentHandler > Tested");

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent';

  },
  handle(handlerInput) {
    console.log("SkipIntentHandler > Used");
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();

    let speechOutput = requestAttributes.t('SKIP_MESSAGE');

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(false)
      .getResponse();
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

    let speechOutput = requestAttributes.t('RESTART_MESSAGE');
    let repromptText = requestAttributes.t('LAUNCH_MESSAGE');

    saveSessionAttributes(attributesManager, initialSessionAttributes, speechOutput);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(false)
      .reprompt(repromptText)
      .getResponse();
  },
};

/**
 * Description: This handler accepts all stop intents from the user;
 * Availability: [ALL-States];
 * Effect: Exits the skill and resets the session;
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

    let speechOutput = requestAttributes.t('FALLBACK_MESSAGE');

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
    console.log(`Error full: ${error}`);
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
    bucketName: ffprocess.env.S3_PERSISTENCE_BUCKET,
  });*/
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .withPersistenceAdapter(getPersistenceAdapter())
  .addRequestHandlers(
    LaunchRequest,
    FeedbackHandler,
    CheckRepliesHandler,
    ReadRepliesHandler,

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
