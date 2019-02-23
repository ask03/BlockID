
View = {

  populateIdModal: function(id) {

    var idList = $('#tabContent-idList');
    var imgDiv = $('#tabContent-imgDiv');
    idList.empty();
    imgDiv.empty();
    idList.append(`<p>${id.name}</p>`);
    idList.append(`<p>${id.nationality}</p>`)
    idList.append(`<p>${id.dob}</p>`);
    idList.append(`<p>${id.ethnicity}`);
    idList.append(`<p>${id.gender}`);
    imgDiv.append(`<img src="https://ipfs.infura.io/ipfs/${id.imgHash}" class="img-fluid"/>`)

  },

  populateIdPane: function(id, userName) {

    var imgHolderDiv = $('#imgHolderDiv');
    var nameDiv = $('#nameDiv');
    var userNameDiv = $('#userNameDiv');
    var insert = ""
    imgHolderDiv.append(`<img src="https://ipfs.infura.io/ipfs/${id.imgHash}" class="img-fluid"/>`)
    nameDiv.append( `<p> ${id.name} </p>`);
    insert = "<p>" + id.nationality + "</p>"
    nameDiv.append(insert);
    nameDiv.append("<p>" + id.dob + "</p>")
    nameDiv.append("<p>" + id.ethnicity + "</p>")
    nameDiv.append("<p>" + id.gender + "</p>")
    userNameDiv.append("<p>&nbsp;&nbsp;"+userName+"</p>");

  },

  appendViewableId: function(userName) {

    $('#list-tab').append(`<a class="list-group-item list-group-item-action" id="${userName}list" data-toggle="list"
    href="#list-${userName}" role="tab" aria-controls="${userName}" onClick="App.loadImgForView(this);">${userName}</a>`)

  }

}
