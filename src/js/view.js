
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
  }

}
