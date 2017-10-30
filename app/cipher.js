const CryptoJS = require('crypto-js');

/**
 * sample :: cipher('AES','my message', 'secret key 123');
 *  */ 
function cipher(algorithm, buf, token){
    var encrypted = "";
    var encrypted = CryptoJS[algorithm].encrypt(buf, token);
    return encrypted.toString();
}
/**
 * sample :: decipher('AES','U2FsdGVkX19F1BYOTKnrEEaEIP0jH1kDaN8/6V7CKYU=', 'secret key 123');
 */
function decipher(algorithm, buf, token){
    var decrypted = "";
    decrypted = CryptoJS[algorithm].decrypt(buf, token);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  cipher,
  decipher
};