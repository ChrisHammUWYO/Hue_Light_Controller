# Hue_Light_Controller
An HTML5/Javascript application that lets you control the Philips Hue Lights around the house. This is a working product that uses JSON requests to communicate with the Bridge. 

To run the Application, double-click on the 'Homepage_r3.html' file. Make sure that the files 'Hue_Light_Controller_CSS.css' and 'Hue_Light_JS_Functions.js' are in the same folder as the Homepage_r3 file, or else the application will not function correctly.

# Quick start Authenticated user directions #
Philips has a friendly built-in interface for developers to generate an
authenticated user.  All it requires is physical access to the device, and the
device's IP address.

* order and timing matters in the following steps.  Read through them before you
start.

1. visit this url on your device:
`http://your_device_ip/debug/clip.html`.
This will open the Hue Bridge test interface.

2. set the 'clip api debugger' line to `/api/`

3. set the 'message body' to `{"devicetype":"my_hue_app#chris_hamm_javascript"}`

4. push the center button on your Hue Bridge.

5. within 30 seconds of pushing the button on your Bridge, click 'post' in the Hue Bridge test interface.

6. in the 'command response' window, you will now see your username, which you can use in the 'authenticated user' web page.

* More complete instructions on the developor test api can be found 
[here](https://developers.meethue.com/documentation/getting-started)

