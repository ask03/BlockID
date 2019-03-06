
Tools = {

  ethnicity:{
      1: {name: "Asian", value: 1},
      2: {name: "Caucasian", value: 2},
      3: {name: "Black", value: 3},
      4: {name: "Latino", value: 4},
      5: {name: "Pacific Islander", value: 5},
  },

  formatId: function(tmpId) {
    var firstName = tmpId[0];
    var lastName = tmpId[1];
    var fullName = `${firstName} ${lastName}`;

    let newId = {};

    newId.name = fullName;
    newId.nationality = tmpId[2];
    newId.dob = Tools.makeDob(tmpId[4]);
    newId.imgHash = tmpId[3];
    newId.ethnicity = Tools.ethnicity[tmpId[5]].name;
    newId.gender = Tools.getGender(tmpId[6]);

    return newId;
  },

  makeDob: function(dob) {
    var rawString = String(dob);
    var dobMonth = rawString.slice(0,2);
    var dobDay = rawString.slice(2,4);
    var dobYear = rawString.slice(4,8);
    var dobString = `${dobMonth}/${dobDay}/${dobYear}`;
    return dobString;
  },

  getGender: function(gender) {
    if(gender == true) {
      return "Male"
    }

    return "Female"
  },

  getUserName: function() {

  }


}
