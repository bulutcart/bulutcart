const bulutHelper = {
    cdnUrl: function (file) {
      return 'https://cdn.bulutcart.com/' + file;
    },
    uploadImage: function (file){
        let formData = new FormData();
        formData.append("file", file);

        fetch("/upload-file", {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.status === "success") {
                //$('#uploadedasd123').attr('src', bulutHelper.cdnUrl(data.url));
                $('#data-asd123').val(data.url);
            } else {
                alert("Yükleme başarısız!");
            }
        }).catch(error => console.error("Hata:", error));
    }
}
const avatarId= 'asd123';
if ($('#uploaded' + avatarId)) {
    $('body').on('change', '.account-file-input', function () {
        if (this.files[0]) {
            bulutHelper.uploadImage(this.files[0]);
        }
    });
    /*
    $('body').on('click', '.account-image-reset', function () {
        $('#uploaded' + avatarId).attr('src', $('#uploaded' + avatarId).attr('resetimage'));
        //$('#userImage' + avatarId).val($('#uploaded' + avatarId).attr('resetimage'));
        bulutApp.userUpdateImage(null);
    });
    */

}
