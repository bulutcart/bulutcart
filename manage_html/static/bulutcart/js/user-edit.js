
const { createApp } = Vue;
const bulutApp = createApp({
    data() {
        return {
            user :{store:{}}
        };
    },
    created() {
    },
    mounted(){
        this.loadUserData();
    },
    setup(){
    },
    methods: {
        userSave(){
            axios.put(user_endpoint, this.user, {
                headers: {
                    Authorization: `Bearer ` + getCookie('bulutToken'), // Token kullanıyorsan
                    "Content-Type": "application/json"
                },
            }).then(response => {
                if(response.data.data){
                    response.data.data.imageUrl = bulutHelper.cdnUrl(response.data.data.image)
                    this.user = response.data.data;
                }
                toastr.success(response.data.message);
            }).catch(error => {
                console.error("Hata oluştu:", error);
                toastr.error("Kullanıcı bilgileri güncellenirken hata oluştu.");
            }).finally(() => {
                console.log("İstek tamamlandı.");
            });
        },
        userDisable(){
            this.user.status = 0;
            this.userSave();
        },
        userEnable(){
            this.user.status = 1;
            this.userSave();
        },
        userUpdateImage(file){
            this.user.image = file;
        },
        addNewAddress(){
            this.user.addresses.push({
                name: "Adres İsmi",
                district: "İlçe",
                city: "İl",
                country: "Ülke",
                post_code: "",
                is_default: false
            });
        },
        loadUserData(){
            try {
                axios.get( user_endpoint , {
                    headers: {
                        Authorization: `Bearer ` + getCookie('bulutToken'), // Token kullanıyorsan
                        "Content-Type": "application/json"
                    },
                }).then(response => {
                    response.data.data.imageUrl = bulutHelper.cdnUrl(response.data.data.image)
                    this.user = response.data.data; // Gelen veriyi Vue bileşeninde sakla
                }).catch(error => {
                    console.error("Hata oluştu:", error);
                }).finally(() => {
                    console.log("İstek tamamlandı.");
                });

            } catch (error) {
                toastr.error("Giriş sırasında hata oluştu.");
            }
        }
    },
}).mount("#app");
// Update/reset user image of account page
