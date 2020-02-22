module.exports = {
  translation: {
    SELECT_ACTION_STATE_ENTER: 'Do you want to give feedback, check for replies to given feedback or configure your skill?',
    SELECT_ACTION_STATE_HELP: 'Please select at first what you want to do. Do you either want to give feedback, check for replies or configure your skill?',
    SELECT_ACTION_STATE_SKIP: 'Sorry, you cannot skip this step.',
    SELECT_ACTION_STATE_EXIT: '',
    
    SKILL_CONFIGURATION_STATE_CONFIRM: 'We saw that you are using our skill for the first time. Would you like to configure the skill at first. To configure the skill say yes, and to directly continue with giving feedback say no',
    SKILL_CONFIGURATION_STATE_SKIP: "Ok, so we skip the initial configuration and go on with the next step.",
    SKILL_CONFIGURATION_STATE_ENTER: "Okay please provide your email address and name now",
    SKILL_CONFIGURATION_STATE_EXIT: "Thank you very much. You skill is configured now.",
    SKILL_CONFIGURATION_STATE_HELP: "To configure your skill you just need to provide your name and your email address. You can also skip this step by saying skip or stop the conversation by saying stop.",

    SELECT_DEVICE_STATE_ENTER: 'Please select the device you would like to give feedback to. Do you want give Feedback regarding your Amazon Echo Dot, Amazon Fire TV Stick, Philips Hue Light or Xiaomi Mi Band',
    SELECT_DEVICE_STATE_HELP: "Please tell me the name of your device that you want to talk about. Do you want talk about your Amazon Echo Dot, Amazon Fire TV Stick, Philips Hue Light or Xiaomi Mi Band? You can also stop the conversation by saying stop.",
    SELECT_DEVICE_STATE_SKIP: "Sorry, I really need to know what device we are talking about. Therefore, you cannot skip this step. You can still stop the conversation by saying stop.",
    SELECT_DEVICE_STATE_EXIT: "Thank you very much. So you want to give feedback regarding your ",
    
    SELECT_FEEDBACK_TYPE_STATE_ENTER: `What type of feedback do you have? Is it a bug report, a feature request, a question, criticism or general feedback?`,
    SELECT_FEEDBACK_TYPE_STATE_HELP: 'Do you want to give feedback regarding an error that you encountered then you have to say bug report. If its regarding a new interesting feature that you would like to have it is a feature request. It can also be a question or cirticism. If you are not sure just say general feedback',
    SELECT_FEEDBACK_TYPE_STATE_SKIP: '',
    SELECT_FEEDBACK_TYPE_STATE_EXIT: '',
    
    ADMIT_BUG_REPORT_STATE_ENTER: 'Okay, so you want to report an error. Three  Information are the most important to use to effecticly process address your bug',
    ADMIT_BUG_REPORT_STATE_HELP: 'admit bug report state help',
    ADMIT_BUG_REPORT_STATE_SKIP: '',
    ADMIT_BUG_REPORT_STATE_EXIT: '',
    
    ADMIT_FEATURE_REQUEST_STATE_ENTER: 'Okay, so you found an interesting new feature that we should implement? ',
    ADMIT_FEATURE_REQUEST_STATE_HELP: 'admit feature request state help',
    ADMIT_FEATURE_REQUEST_STATE_ENTER: '',
    ADMIT_FEATURE_REQUEST_STATE_EXIT: '',
    
    ADMIT_QUESTION_STATE_ENTER: 'You can tell me your question now',
    ADMIT_QUESTION_STATE_HELP: 'admit question state help',
    ADMIT_QUESTION_STATE_SKIP: '',
    ADMIT_QUESTION_STATE_EXIT: 'Alright, your question will be send to the developers and they will reach out to you and help you to resolve your issue.',
    
    ADMIT_CRITICISM_STATE_ENTER: 'You are welcome to share your criticism with me',
    ADMIT_CRITICISM_STATE_HELP: 'admit criticism state help',
    ADMIT_CRITICISM_STATE_SKIP: '',
    ADMIT_CRITICISM_STATE_EXIT: '',
    
    ADMIT_GENERAL_FEEDBACK_STATE_ENTER: 'Okay, I am listening. Please tell me your you feedback.',
    ADMIT_GENERAL_FEEDBACK_STATE_HELP: 'You can now tell me your feedback',
    ADMIT_GENERAL_FEEDBACK_STATE_SKIP: '',
    ADMIT_GENERAL_FEEDBACK_STATE_EXIT: 'Thank you very much for your feedback. ',
    
    SELECT_CONTACT_PREFERENCES_STATE_ENTER: 'Do you allow the developers to contact you in case of further questions. If not your transcribed feedback would be sent anonymously. ',
    SELECT_CONTACT_PREFERENCES_STATE_HELP: 'select contact preferences state help',
    SELECT_CONTACT_PREFERENCES_STATE_SKIP: 'Okay, your feedback will be submitted anonymously.',
    SELECT_CONTACT_PREFERENCES_STATE_EXIT: 'Thank you verym much, your feedback was send to the developers',
    
    CHECK_REPLIES_STATE_ENTER: 'Okay, let me check. Alright, you have 3 new replies. One regarding your Xiaomi Mi Band, one regarding your Philips Hue Light and one regarding your Amazon Echo Dot. Which one do you want to hear?',
    CHECK_REPLIES_STATE_HELP: 'check replies state help',
    CHECK_REPLIES_STATE_SKIP: '',
    CHECK_REPLIES_STATE_EXIT: '',
    
    SKILL_CONFIGURATION_NO_MESSAGE: "Okay, so we skip the initial configuration. You can still give your feedback now",
    SKILL_CONFIGURATION_SKIP_MESSAGE: "Okay, so we skip the initial configuration. You can still give your feedback now",
        
    SELECT_FEEDBACK_TYPE_MESSAGE: "What is your concern? Do you want to submit a bug report, a feature request, a question or criticism?",
    
    FALLBACK_MESSAGE: "Sorry, I wasn´t able to conclude what to do next. Could you please rephrase your ",
    EXIT_MESSAGE: 'Ok! See you the next time!',
    HELP_MESSAGE: 'Sorry, I can´t help you with this.',
    STOP_MESSAGE: 'Ok! Bye!',
    CONTINUE_MESSAGE: 'Say yes to start or no to quit. ',
    ERROR_MESSAGE: 'Sorry, an error occurred. ',
    RESTART_MESSAGE: "Okay, let's start all over again. ",
    YES_MESSAGE: 'Great! Is it an alexa compatible device or a third party device. ',
    UNHANDLED_INTENT_MESSAGE: "Sorry, I don't understand. Can you please rephrase what you said.", 
    FALLBACK_INTENT_MESSAGE: "Sorry, I don't understand. Can you please rephrase what you said."
  }
};
