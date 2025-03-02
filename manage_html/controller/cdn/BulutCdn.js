
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

class BulutCdn {
    static async upload(req, res) {
        if (!req.file) {
            return res.status(400).send('Dosya yüklenmedi.');
        }

        try {
            const filePath = req.file.path; // Geçici dosya yolu

            if (!fs.existsSync(filePath)) {
                console.error("Dosya bulunamadı:", filePath);
                return res.status(400).json({ error: "Dosya bulunamadı" });
            }

            const fileStream = fs.createReadStream(filePath);
            const formData = new FormData();

            formData.append('file', fileStream, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });

            const uploadUrl = 'https://cdn.bulutcart.com/upload/';

            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    // Gerekirse ek başlıklar buraya eklenebilir
                },
            });

            // Geçici dosyayı sil
            fs.unlinkSync(filePath);

            res.json(response.data);
        } catch (error) {
            console.error('Dosya yükleme hatası:', error.response?.data || error.message);
            res.status(500).send('Dosya yüklenirken hata oluştu.');
        }
    }
}

module.exports = BulutCdn;