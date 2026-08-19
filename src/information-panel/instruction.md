# Overview

Wafer Wireboard is a host app that lets you connect Web Audio apps as nodes and play them together.

This app was built as a demonstration for `Wafer`, a plugin platform for Web Audio.

The synths, effects, sequencers, and other small apps that run inside it are called units.

Place units on the board, connect them, and send audio through the graph to hear how the framework works. It includes several original units, along with units based on existing open-source Web Audio apps.

# Usage

## Move the view

![capture2](/images/capture2.png)

Drag an empty area of the board to move the view.

Drag the zoom bar on the right edge up or down to zoom the view in or out. On a PC, you can also zoom using the mouse wheel.

## Add a unit

![capture1](/images/capture1.png)

Drag a unit from the list on the left and drop it into the main board area.

## Move a unit

![capture8c](/images/capture8c.png)

Drag the top bar of a unit's frame to move it.

## Remove a unit

![capture8b](/images/capture8b.png)

Tap the trash icon in the upper-right corner of a unit to remove it from the board.

## Connect units

![capture4](/images/capture4.png)

![capture5](/images/capture5.png)

Each unit has output ports at the top and input ports at the bottom. The signal flow is basically from bottom to top.

The ports are color-coded: yellow for audio signals, light blue for note signals, and pink for automation signals. Ports of the same color can be connected.

Tap an output port to connect it to the nearest input port.
You can also drag from an output port to connect it to any other compatible port.

When a signal is connected, tap its output port to disconnect it.

## Play a synthesizer

![capture7](/images/capture7.png)

The main board always contains an output node and a keyboard node. To play a synthesizer, place a unit between them and connect the units together.

You can play the keyboard note with the on-screen keys.

## Play a scene

![capture9](/images/capture9.png)

Sequencers and drum machines can sync to the host timing.

Place a sequencer or drum machine unit, connect it to the output, then press play button to start the sequence.

## Use midi keyboard

![capture10](/images/capture10.png)

To use a midi keyboard, press the keyboard icon button in the upper-right corner of the screen. The first connected MIDI IN device in the list will be used.

The built-in keyboard unit sends notes from both the on-screen keyboard UI and the MIDI keyboard.

## Built in keyboard auto connection feature

![capture11](/images/capture11.png)

The built-in keyboard unit has a feature that automatically switch its connection to the nearest unit when moved. To enable this, press the arrow icon in the upper-left corner of the unit.

## Shared URL

![capture12](/images/capture12.png)

The scene states can be embedded into sharable URL.
To get a shareable URL, tap the share icon in the upper-right corner.

The URL uses a domain name that includes the app's build number, so it remains pinned to the version of the app that was current when the URL was generated.

# Source Code

Wireboard source code:

[https://github.com/yahiro07/wafer-wireboard](https://github.com/yahiro07/wafer-wireboard)

Wafer framework source code:

[https://github.com/yahiro07/wafer](https://github.com/yahiro07/wafer)
