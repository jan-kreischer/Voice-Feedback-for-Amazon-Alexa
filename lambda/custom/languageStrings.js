/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

/*module.exports = {
    en: {
        translation: {
            WELCOME_MSG: 'Welcome Jan, you can say Hello or Help. Which would you like to try?',
            HELLO_MSG: 'Hello World!',
            HELP_MSG: 'You can say hello to me! How can I help?',
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intentName}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, I had trouble doing what you asked. Please try again.'
        }
    }
}*/

module.exports = {
  translation: {
    SKILL_NAME: 'Feedbacker',
    
    INITIAL_STATE: 'Hey, you want to give feedback regarding one of your smart devices?',
    LAUNCH_WELCOME_MESSAGE: 'Hey, you want to give feedback regarding one of your smart devices?',
    LAUNCH_WELCOME_REPROMPT: 'Say yes to start or no to quit.',
    
    SKILL_CONFIGURATION_STATE_CONFIRM: 'We saw that you are using our skill for the first time. Would you like to configure the skill at first. To configure the skill say yes, and to directly continue with giving feedback say no',
    SKILL_CONFIGURATION_STATE_SKIP: "Ok, so we skip the initial configuration and go on with the next step.",
    SKILL_CONFIGURATION_STATE_ENTER: "Okay please provide your email address and name now",
    SKILL_CONFIGURATION_STATE_EXIT: "",
    SKILL_CONFIGURATION_STATE_HELP: "To configure your skill you just need to provide your name and your email address. You can also skip this step by saying skip or stop the conversation by saying stop.",

    SELECT_COMPANY_STATE_ENTER: 'Please tell me at first what company is the device made by',
    SELECT_COMPANY_STATE_HELP: 'Please tell me at first what company is the device made by',
    SELECT_COMPANY_STATE_SKIP: 'Please tell me at first what company is the device made by',
    SELECT_COMPANY_STATE_EXIT: 'Please tell me at first what company is the device made by',
    
    SELECT_DEVICE_STATE_ENTER: 'Please select the device you would like to give feedback to. Do you want give Feedback regaring your Amazon Echo Dot, Amazon Fire TV Stick, Philips Hue Light or Xiaomi Mi Band',
    SELECT_DEVICE_STATE_HELP: "Please tell me the name of your device that you want to talk about. You can also skip this step by saying skip or stop the conversation by saying stop.",
    SELECT_DEVICE_STATE_SKIP: "Sorry, I really need to know what device we are talking about. Therefore, you cannot skip this step. You can still stop the conversation by saying stop.",
    SELECT_DEVICE_STATE_EXIT: "",
    
    ELICIT_DEVICE_INFORMATION_WELCOME_MESSAGE: 'Please tell me now what device we are talking about.',
    ELICIT_DEVICE_INFORMATION_WELCOME_REPROMPT: 'For example you could say, I want to give feedback regarding my Fire TV Stick from Amazon',
    
    SKILL_CONFIGURATION_NO_MESSAGE: "Okay, so we skip the initial configuration. You can still give your feedback now",
    SKILL_CONFIGURATION_SKIP_MESSAGE: "Okay, so we skip the initial configuration. You can still give your feedback now",
        
    SELECT_FEEDBACK_TYPE_MESSAGE: "What is your concern? Do you want to submit a bug report, a feature request, a question or praise and criticism?",
    
    FALLBACK_MESSAGE: "Sorry, I wasn´t able to conclude what to do next. Could you please rephrase your ",
    EXIT_MESSAGE: 'Ok! See you the next time!',
    STOP_MESSAGE: 'Ok! Bye!',
    CONTINUE_MESSAGE: 'Say yes to start or no to quit.',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    YES_MESSAGE: 'Great! Is it an alexa compatible device or a third party device.'
  }
};
