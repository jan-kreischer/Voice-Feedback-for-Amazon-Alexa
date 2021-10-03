class FeedbackBot {
  attributesManager; 
  sessionAttributes; 
  
  constructor(attributesManager) {
    sessionAttributes = attributesManager.getSessionAttributes;
  }
  
  start() {
      return "Feedback Bot Started"
  }
  
  repeat() {
      return this.sessionAttributes.last_speech_output || ''
  }
  
  save() {
      this.attributesManager.setSessionAttributes(this.sessionAttributes)
  }
}