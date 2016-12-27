gr(function() {
    const $$ = gr("#main");
    const number = 32;
    for (var i = 1; i <= number; i++) {
        $$("scene").append(`<mesh id="mesh-${i}" geometry="circle" color="white" scale="0.1" />`);
    }

    var request = new XMLHttpRequest();
    request.open('GET', './sample.mp3', true);
    request.responseType = 'arraybuffer';
    request.send();

    var source, animationId;
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.connect(audioContext.destination);
    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            console.log(request.response);
            if (source) {
                source.stop();
                cancelAnimationFrame(animationId);
            }
            source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(analyser);
            source.start(0);
            animationId = requestAnimationFrame(render);
        });
    };
    const render = function() {
        var spectrums = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(spectrums);
        for (var i = 1; i <= number; i++) {
            $$(`#mesh-${i}`).setAttribute("position", `${i/5},${spectrums[i-1]/100},0`);
        }
        animationId = requestAnimationFrame(render);
    };
});