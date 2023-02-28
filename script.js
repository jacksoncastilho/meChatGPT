const q = document.getElementById('q');
document.getElementById('submitListen').addEventListener('click', startRecognition);
document.getElementById('submitText').addEventListener('click', sendQuestinText);

var stranscript = '';

function startRecognition() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;

    recognition.start();

    recognition.onresult = (event) => {
        var sRetorno = event.results[event.results.length - 1][0].transcript;
        stranscript += `Eu: ${sRetorno} \n\n`;

        q.value = stranscript.trim();

        var interval = setInterval(() => {
            recognition.stop();

            chatGpt(sRetorno);

            clearInterval(interval);
        }, 5000);

    }
}

function sendQuestinText() {
    var question = document.getElementById('question');
    if (question.value.trim() != "") {
        stranscript += `Eu: ${question.value} \n\n`;

        q.value = stranscript;

        chatGpt(question.value);

        question.value = '';
    }
}

function chatGpt(message) {
    //Chave da API
    const apiKey = '';

    var oHttp = new XMLHttpRequest();
    oHttp.open('POST', 'https://api.openai.com/v1/completions');
    oHttp.setRequestHeader('Accept', 'application/json');
    oHttp.setRequestHeader('Content-Type', 'application/json');
    oHttp.setRequestHeader('Authorization', 'Bearer ' + apiKey)

    var data = {
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 2048,
        temperature: 0
    };

    oHttp.send(JSON.stringify(data));

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {
            var oJson = {}

            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                console.log('Error: ' + ex.message)
            }

            if (oJson.error && oJson.error.message) {
                console.log('Error: ' + oJson.error.message);
            } else if (oJson.choices && oJson.choices[0].text) {
                var s = oJson.choices[0].text;

                if (s == '') s = 'No response';

                var a = s.replace('?', '');
                var b = a.replace('\n\n', '');
                var c = b.replace('R', 'Resposta');

                stranscript += `${c}\n\n`;

                q.value = stranscript;

                startSpeak(c);
            }
        }
    };
}

function startSpeak(textSpeak) {

    const voices = window.speechSynthesis?.getVoices();

    const brVoice = voices?.find((voice) => /pt-BR/.test(voice.lang));

    const utterance = new SpeechSynthesisUtterance();

    utterance.text = textSpeak;
    utterance.lang = 'pt-BR';
    utterance.voice = brVoice;
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
}