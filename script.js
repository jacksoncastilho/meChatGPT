const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.lang = 'pt-BR';
recognition.continuous = true;

document.getElementById('submit').addEventListener('click', startRecognition);

function startRecognition() {

    recognition.start();

    var stranscript = '';

    recognition.onresult = (event) => {
        stranscript += event.results[event.results.length - 1][0].transcript;
        document.getElementById('q').value = stranscript.trim();

        var interval = setInterval(() => {
            stranscript = '';
            document.getElementById('q').value = stranscript.trim();
            recognition.stop();
            clearInterval(interval);
        }, 10000);

    }

    recognition.onend = () => {
        console.log('Speech recognition service disconnected');
    }
}
