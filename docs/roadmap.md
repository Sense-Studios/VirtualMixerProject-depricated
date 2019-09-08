* More Effects! starting with a Blur Effect
* Yes I know, I node editor.
* wipes through distortion effects
* extend feedback effects
* Text-source
* image-source
* SVG-source
* mixer and controller generator (kind of works)
* rewrite the core in Typescript (I know)
* consider replacing THREE.js with reGL

#### MultipleVideoSource

~The MultiVideoSource allows for playback of video files in the Mixer project.
It is very similar to the regular video source, however, it used multiple references to the video file.
In doing so it allows for very fast jumping through the video even when it is loading from a remote server.
The main features are random jumping and a cue list, allowing for smart referencing in video files.~

I've tested this idea in public/compositions/demo_midi_source, and it seems to
work above expectation, but I'm not sure if this also has to do with loaded data.
Still, locally it should work great.


#### layout and composition abstraction

Describe compositions as below. Serves as input for trackers/ sequencers

```
  var my_renderer = {
    my_source_1 = {
      type = VideoSource,
      src = "somefile.mp4"
    },
    my_source_2 = {
      type = GifSource,
      src = "somefile.gif"
    },
    my_mixer_1 = {
      type = Mixer,
      src1 = my_source_1,
      src1 = my_source_2,
      pod: 0.5,
      mixmode: 1,
      blendmode: 1
    }
  }
```

#### And yes, a node editor. I know.
