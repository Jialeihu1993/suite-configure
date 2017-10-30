class Property {
  constructor(originalVal, currentVal, type,testVal) {
    this.originalVal = originalVal;
    this.currentVal = currentVal;
    this.type = type;
    this.testVal = testVal;  //testVal was the value when ldap/email service test succeeded
  }

  isChanged() {
    return this.originalVal != this.currentVal;
  }

  toString() {
    return this.currentVal ? this.currentVal: '';
  }

 toBoolean() {
  let that = this;

  function toggleToBoolean(){
    if(that.currentVal == 'true' || that.currentVal === true){
      return true;
    }else{
      return false;
    }
  } 
  return toggleToBoolean();
  } 

  // distinguish between navigation(page) object and property object in redux store
  isProperty() {
    return true;
  }
}
export default Property;