There are several limitations to the Mixer. Most have to do with the limitation of the browser, or limitations with the interpretation of browser code.

* _Make sure WebGL/ Hardware acceleration is available and enabled._

If you have no hardware acceleration available or it is disable the mixer simply won't run properly. There is no option or settings that lets the mixer work on software rendering alone.

* _When in doubt use Chrome, The mixer relies heavily on WebGL and a number of control interfaces._

Although WebGL is available in most browsers, I've found that only Chrome, and to a certain degree Firefox support all the functions necessary to run the mixer.
particularly controlling the mixer with MIDI or a Gamepad are features that rely on (sometimes experimental) support by the Chrome browser.


* _Distortion effect only works directly on sources._

The distortion effect needs a Sampler2D to projects it's UV coordinates on. Effects and Mixers don't have those. So a distortion effect always needs to be chained directly to a source.


* _Shaders allow up to 16 sources._

On most systems, the Shader-buffer allows for a maximum of 16 textures. As all sources require a texture-slot to operate, that means that within the mixer there is a maximum of 16 slots available.
Note that the FeedbackEffect also uses a sampler, and counts against your maximum number of shaders.


* _Autoplay, Webcam, Microphone, Gamepad, and Midi-controllers require https:// ._

If you run the mixer on your website, make sure that you have a certificate installed.
A number of functions will only work when https is available and enabled. These include the webcam (and subsequently the microphone!), Gamepad control, Midi Control, and Autoplay functionality.


* _Mobile browsers require interaction to start_

Due to loading concerns, it is not possible to autoplay video on a mobile
device. Make sure that you have some kind of 'play'-functionality in place
that serves as some kind of interaction. There is some first-start code
in place in the sources, but that doesn't work on all platforms.
Call _firstRun_ on the sources to utilize this behavior.


* ~~_iOS does not allow for more than one video to play simultaneous (gif is fine though)_~~

~~Apple has decided, in all their wisdom, that you should not be allowed to play multiple videos on one page. Even though Apple has finally allowed to
play inline video on mobile devices, it is still not allowed to play 2 or more videos simultaneously.
Luckily Apple does allow as many gif sources as you'd like, so when you
target Apple devices build your mixers with only one videoSource max.~~

Apple has fixed this as of iOS 11.x, mix along on iPhone!


* _Seeking and loading (remote) video delays the video and results in hiccups_

Loading Video or seeking in a Video over the internet is usually fast enough for most purposes, however, doing so in realtime leads to noticeable delays in your mix. Especially when you want to jump around in a video the 400ms delays really get annoying.

I've tried a number of settings and options through Amazon S3 and Cloudflare but I haven't been able to get the delay(s) down to an acceptable level. Which leads me to start working on a '[MultipleVideoSource](https://virtualmixproject.com/docs/reference/Source_MultiVideoSource.html)', that works around this problem, by loading a video into multiple HTMLMediaElements which are exchanged with each other when jumping through the video. It works, but has other concerns, like memory bloat.


* _AudioAnalysis can be too resource intensive for most Mobile devices_

I've noticed a significant delay in performance when using the Audio-Analysis Add-on in my mixers on Mobile. Now truth be told, I've tested this only with 3-year-old mobile devices, but still, performance on those devices is underwhelming. Try to use the BPM Addon instead if you target mobile devices or work with a set BPM.
