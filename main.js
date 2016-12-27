gr(function() {
    var d = new Date();
    var source, animationId;
    var audioContext = new AudioContext;
    var fileReader = new FileReader;
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.connect(audioContext.destination);
    fileReader.onload = function() {
        audioContext.decodeAudioData(fileReader.result, function(buffer) {
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
    document.getElementById('file').addEventListener('change', function(e) {
        fileReader.readAsArrayBuffer(e.target.files[0]);
    });
    const $$ = gr("#main");
    render = function() {
        var spectrums = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(spectrums);
        for (var i = 1; i <= spectrums.length; i++) {
            $$(`#mesh-${i}`).setAttribute("position", `${i/5},${spectrums[i-1]/100},${Math.sin(spectrums[i-1] * d.getTime()/10000)}`);
            $$(`#meshb-${i}`).setAttribute("position", `${-i/5},${spectrums[i-1]/100},${Math.sin(spectrums[i-1] * d.getTime()/10000)}`);
        }
        $$(`#mesh-0`).setAttribute("position", `0,${spectrums[0]/100},0`);


        animationId = requestAnimationFrame(render);
    };
});