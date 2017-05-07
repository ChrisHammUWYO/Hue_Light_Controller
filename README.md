# Hue_Light_Controller
An HTML5/Javascript application that lets you control the Philips Hue Lights around the house. This is a working product that uses JSON requests to communicate with the Bridge. 

To run the Application, double-click on the 'Homepage_r3.html' file. Make sure that the files 'Hue_Light_Controller_CSS.css' and 'Hue_Light_JS_Functions.js' are in the same folder as the Homepage_r3 file, or else the application will not function correctly.

# Generating an authenticate user #
Philips has a friendly built-in interface for developers to generate an
authenticated.  All it requires is physical access to the device, and the the
device's IP address.
## Quick start Authenticate user directions ##
visit this url on your device:

`http://your_device_ip/debug/clip.html`.

This will open the Hue Bridge test interface.

set the 'clip api debugger' line to `/api/`

set the 'message body' to `{"devicetype":"my_hue_app#chris_hamm_javascript"}`

push the center button on your Hue Bridge.

click 'post' in the Hue Bridge test interface.

in the 'command response' window, you will now see your username, which you 
can use in the 'authenticated user' web page.
