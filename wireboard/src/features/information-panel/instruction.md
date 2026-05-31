# What's this?

Wireboard is a host app that lets you connect Web Audio apps as nodes and play them together.

This app was built as a demonstration for `webaudio-unit-system`, a component system for Web Audio. The synths, effects, sequencers, and other small apps that run inside it are called units.

Place units on the board, connect them, and send audio through the graph to hear how the framework works. It includes several synth units made by the author, along with units based on open-source Web Audio apps.

# Usage

## Add a unit

![whole-app-view-with-drag-drop-arrow](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

Drag a unit from the list on the left and drop it into the main board area.

## Move a unit

![unit-card-with-annotated-grip](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

Each unit has a grip icon on the right edge of its frame. Drag this grip to move the unit around the board.

## Move the view

Use the mouse wheel to zoom in and out. Hold the wheel button and drag to pan around the board.

## Connect units

![vertical-two-unit-cards-with-output-port-annotated](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)
![vertical-two-unit-cards-connected](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

Each unit has two ports on its left side. The upper port, marked with a triangle icon, is the output port. The lower port is the input port.

Tap an output port to connect it to the nearest input port above it. Tap the same output port again to disconnect it.

Currently, each output port can connect to only one input port. However, multiple output ports can connect to the same input port.

The connection target is determined by the current unit positions. Move units before connecting them if you want to control which input the output connects to.

## Remove a unit

![unit-card-with-annotated-trash-icon](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

Tap the trash icon in the upper-right corner of a unit to remove it from the board.

## Play a synthesizer

![edit-area-with-keyboard-synth-output-setup](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

The main board always contains an output node and a keyboard node. To play a synthesizer, place a unit between them and connect the units together.

You can play the keyboard node with the on-screen keys. If a MIDI keyboard is connected in your environment, it's also enabled for input.

## Play a scene

![edit-area-with-drum-machine-output-setup](https://cdn.jsdelivr.net/gh/yahiro07/synth-rd-2604@e7412ad3c307307a23f603935ffb5b8630a39a20/images/no-image.png)

The main board includes BPM controls and a play button. Sequencers and drum machines can sync to the host timing.

Place a sequencer or drum machine unit, connect it to the output, then press play to start the sequence.

# Source Code

Wireboard source code:

https://github.com/yahiro07/mini-groove/wireboard

Web Audio unit system source code:

https://github.com/yahiro07/webaudio-unit-system
