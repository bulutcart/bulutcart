
const { createApp } = Vue;
createApp({
    data() {
        return {
            email: "demo2@mailinator.com",
            password: "123456",
            message: "merhaba"
        };
    },
    created() {
        // Uygulama başlatıldığında token kontrolü yap

    },
    methods: {
        async login() {
            try {
                if (!this.email || !this.password) {
                    toastr.error("Lütfen e-posta ve şifreyi girin" );
                    return;
                }

                const response = await axios.post( user_endpoint + "manager/login", {
                    email: this.email,
                    password: this.password
                });
                if (response.data.status === "success") {
                    const token = response.data.data; // JWT token
                    Cookies.set("bulutToken", token, { expires: 1 });
                    toastr.success("Giriş başarılı!");
                    window.location.href = "/home";
                } else {
                    toastr.error("Giriş başarısız! "  + response.data.message);
                }
            } catch (error) {
                console.log(error.message);
                toastr.error( "Teknik bir sorun yaşanıyor. Lütfen daha sonra tekrar deneyiniz.<br>" + error.message);
            }
        },
    },
}).mount("#app");
