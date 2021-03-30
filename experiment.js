
    // the problem 1: This script not work better... audio data is printed in canvas but not in good proportion (find log of "cutsqnt").
    // the problem 2: It's very slow.


    // micro-libs // get style

    const getElementCssRole = (element, property) =>
    {
        var getviaview = (e,p) => { return document.defaultView.getComputedStyle(e,null).getPropertyValue(p); };
        var getviarole = (e,p) => { if(e.currentStyle) { return e.currentStyle[ p.replace(/\-(\w)/g, (strMatch, p1) => { return p1.toUpperCase(); }) ]; } else { return 0 } };
        return (document.defaultView && document.defaultView.getComputedStyle) ? getviaview(element,property) : getviarole(element,property);
    }

    //not working - experiment javascript sound bar visualizer via canvas

    let  audio       = playerbox.getElementsByTagName('audio')[0],
         graph       = playerbox.querySelectorAll('.graph>canvas')[0];  

    audio.load();

    audio.oncanplay = () =>
    {
      
      // print audio
      if(graph)
      {

          // set audio cross reading
          window.AudioContext = window.AudioContext || window.webkitAudioContext;

          // read audio data
          fetch( audio.currentSrc )
          .then( response => response.arrayBuffer() )
          .then( arrayBuffer => new AudioContext().decodeAudioData(arrayBuffer) )
          .then( audioBuffer => drawaudio(audioBuffer) );

          function drawaudio(audioBuffer)
          {

              // setup the canvas

              let pad = ~~( (parseInt(getElementCssRole(graph.parentNode,'padding-top')) + parseInt(getElementCssRole(graph.parentNode,'padding-bottom')))/2 ),
                  dpr = (window.devicePixelRatio || 1);

              graph.width = graph.offsetWidth * dpr;
              graph.height = (graph.offsetHeight + pad * 2) * dpr;

              //setup the drawer

              let drawer = graph.getContext("2d");

              drawer.scale(dpr, dpr);
              drawer.translate(0, graph.offsetHeight / 2 + pad);

              // split buffer

              let databuffer  = audioBuffer.getChannelData(0),                        // get a main channel
                  cutrange    = ~~( (parseInt(screen.width)-graph.offsetWidth)*25 ),  // make proportion
                  cutsqnt     = ~~( databuffer.length / cutrange );                   // make step bar data

              console.log( cutsqnt );

              // save chunks list

              let chunkslist = []; for (let chunk = 0; chunk < cutsqnt; chunk++) chunkslist.push(databuffer[Math.abs(chunk * cutrange)]);

              // normalize chunks

              let median = Math.pow( Math.max(...chunkslist), -1); chunkslist.map(x => x * median);

              // draw the line segments

              let space = 4,
                  radius = 100,
                  barWidth  = (graph.offsetWidth/cutsqnt)-space,
                  barHeight = graph.offsetHeight,
                  x,
                  y;

              // drawer.fillStyle = "#000";

              for (let i = 0; i < chunkslist.length; i++)
              {

                   let rectWidth = barWidth,
                       rectHeight = chunkslist[i]*barHeight,

                       rectX = (rectWidth*i)+(space*i),
                       rectY = -chunkslist[i]*(barHeight/2); //centered

                   // rectRadius = (Math.min(Math.max(rectWidth-1,1),Math.max(rectHeight-1,1),radius));

                   // drawer.lineJoin = "round";
                   // drawer.lineWidth = rectRadius;
                   // drawer.strokeRect(rectX+(rectRadius/2), rectY+(rectRadius/2), rectWidth-rectRadius, rectHeight-rectRadius);
                   // drawer.fillRect(rectX+(rectRadius/2), rectY+(rectRadius/2), rectWidth-rectRadius, rectHeight-rectRadius);

                   drawer.fillRect(rectX, rectY, rectWidth, rectHeight);

              }

          }

      }
      
    }

