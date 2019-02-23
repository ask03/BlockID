
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
    var midName = tmpId[1];
    var lastName = tmpId[2];
    var fullName = `${firstName} ${midName} ${lastName}`;

    let newId = {};

    newId.name = fullName;
    newId.nationality = tmpId[3];
    newId.dob = Tools.makeDob(tmpId[5]);
    newId.imgHash = tmpId[4];
    newId.ethnicity = Tools.ethnicity[tmpId[6]].name;
    newId.gender = Tools.getGender(tmpId[7]);

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


}
