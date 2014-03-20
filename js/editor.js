(function (global, document) {

    function init () {
        var addButton = document.getElementById("add");
        addButton.addEventListener("click", onAddClick);

        var addSound = document.getElementById("add-audio");
        addSound.addEventListener("click", record);

        var publish = document.getElementById("publish");
        publish.addEventListener("click", publishSlides);

        initTinyMCE();
    }

    function initTinyMCE () {
        tinymce.init({
            selector: "section",
            theme: "modern",
            add_unload_trigger: false,
            schema: "html5",
            inline: true,
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste"
            ],
            toolbar1: "styleselect | bold italic | alignleft aligncenter alignright alignjustify",
            toolbar2: "bullist numlist outdent indent | link image media bbcue",
            statusbar: true,
            fixed_toolbar_container: "#toolbar",
            menubar: false,
            setup: function(editor) {
                editor.addButton('bbcue', {
                    text: 'Section BB-Cue',
                    icon: true,
                    onclick: function() {
                        var resp = prompt('Write the time for this section');
                        var node = editor.selection.getNode().parentNode;
                        node.setAttribute('data-bccue', resp);
                    }
                });
            }
        });
    }

    function onAddClick () {
        var template = "<h1>A NEW SLIDE</h1>\
                    <h3>An awesome one.</h3>\
                    <p>Sample text.</p>"
        var element = document.createElement('section');
        element.innerHTML = template;
        var slides = document.getElementsByClassName('slides')[0];
        slides.appendChild(element);
        initTinyMCE();
        Reveal.next();
        tinyMCE.activeEditor.focus();
    }

    function record() {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            audio_context = new AudioContext;
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            console.log(e);
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
            console.log('No live audio input: ' + e);
        });
    }

    function startUserMedia(stream) {
        stream_G = stream;
        var input = audio_context.createMediaStreamSource(stream);
        recorder = new Recorder(input);
        recorder.record();
        console.log('Recorder initialised.');

        var addSound = document.getElementById("add-audio");
        addSound.removeEventListener("click", record);
        addSound.addEventListener("click", stopRecord);
    }

    function stopRecord() {
        stream_G.stop();
        var addSound = document.getElementById("add-audio");
        var audio = document.getElementById("browsercast-audio");
        addSound.addEventListener("click", record);
        recorder.stop();
        recorder.exportWAV(function(s) {
            console.log(s, window.URL);
            audio.src = window.URL.createObjectURL(s);
        });
    }

    function publishSlides() {
        var filename = 'js/browsercast.js';
        $.getScript(filename);
    }

    init();
})(window, window.document);