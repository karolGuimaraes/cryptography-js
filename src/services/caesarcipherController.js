const axios = require('axios');
const sha1 = require('js-sha1');
const fs = require('fs');
const FormData = require('form-data');

exports.getEncrypted = async (req, res) => {
	const response = await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=d2be53b4cb4591f19ca1bf97dfc57a94b6079aee');
	answer = response.data;
	answer.decifrado = decipherer(answer);
	answer.cifrado = answer.cifrado.toLowerCase();
	answer.resumo_criptografico = sha1(answer.decifrado);
	fs.writeFileSync('answer.json', JSON.stringify(answer));

	const formData = new FormData();
	formData.append('answer', fs.createReadStream('answer.json'));
	
	const submit_response = await axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=d2be53b4cb4591f19ca1bf97dfc57a94b6079aee', formData, {
		headers: formData.getHeaders(),
	});

	res.send(submit_response.data);
};

const decipherer = (answer) => {
	const alphabet = new Array( 26 ).fill( 1 ).map( ( _, i ) => String.fromCharCode( 97 + i ) );
	let decifrado = '';

	for (let letter of answer.cifrado){
		let index = (alphabet.indexOf(letter) - answer.numero_casas);
		decifrado += alphabet.indexOf(letter) < 0 ? letter : alphabet[ index >= 0 ? index : (alphabet.length + index) ]
	}

	return decifrado;
}