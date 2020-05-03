const axios = require('axios');
const sha1 = require('js-sha1');
const fs = require('fs');
const FormData = require('form-data');

exports.getEncrypted = async (req, res) => {
	const response = await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=d2be53b4cb4591f19ca1bf97dfc57a94b6079aee');
	answer = response.data;
	answer.decifrado = decipherer(answer);
	answer.resumo_criptografico = sha1(answer.decifrado);
	fs.writeFileSync('answer.json', JSON.stringify(answer));

	res.send(submit_answer());
};

function decipherer(answer) {
	const alphabet_array = new Array( 26 ).fill( 1 ).map( ( _, i ) => String.fromCharCode( 97 + i ) );
	let decifrado = '';

	const alphabet = new Proxy(alphabet_array, {
    get(target, prop) {
			if (!isNaN(prop)) {
				prop = parseInt(prop, alphabet_array.lengt);
				if (prop < 0) {
					prop += target.length;
				}
			}
      return target[prop];
    }
	});

	for (let letter of answer.cifrado){
		decifrado += alphabet_array.indexOf(letter) < 0 ? letter : alphabet[ (alphabet_array.indexOf(letter) - answer.numero_casas) ]
	}

	return decifrado;
}

async function submit_answer(){
	const formData = new FormData();
	const answer = fs.createReadStream('./answer.json');

	formData.append('answer', answer);

	const response = await axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=d2be53b4cb4591f19ca1bf97dfc57a94b6079aee', formData, {
		headers: {'Content-Type': 'multipart/form-data'},
	});

	console.log(response);
	return response.data;
}