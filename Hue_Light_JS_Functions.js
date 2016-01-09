/** Hue_Light_JS_Functions.js 
Chris Hamm
12/15/2015
Revision 3
**/

var myBridgeIP; 
var myAuthenticatedUsername; 
var URLAddress; 
var listOfLightsObj; //array that contains all of the lights that have been loaded
function extractBridgeInfo()
{
	myBridgeIP = document.getElementById("Bridge_IP_Input").value; //get the IP address of the bridge
	myAuthenticatedUsername = document.getElementById("Authenticated_Username_Input").value; //get the authenticated username

	//check for invalid input in bridgeIP box
	var errorString = "";
	var credentialsError = false;
	if(myBridgeIP.length < 1) //if empty string is passed in
	{
		credentialsError = true;
		errorString += "<br> ERROR: Bridge IP Field cannot be empty.";
	}
	if(myBridgeIP.length < 7) //smallest IP address is 7 characters
	{
		credentialsError = true;
		errorString += "<br> ERROR: Invalid Bridge IP address (Too short). IP address must be between (and including) 7 and 15 characters in length.";
	}
	if(myBridgeIP.length > 15) //largest IP address is 15 characters
	{
		credentialsError = true;
		errorString += "<br> ERROR: Invalid Bridge IP address (Too Long). IP address must be between (and including) 7 and 15 characters in length.";
	}

	//check for invalid input in authenticated username box
	if(myAuthenticatedUsername.length < 1)//if empty string is passed in
	{
		credentialsError = true;
		errorString += "<br> ERROR: Authenticated Username Field cannot be empty.";
	}

	if(credentialsError === true)//if error was found, change info window
	{
		document.getElementById("Info_Window").innerHTML = "<p style='color:red'>" + errorString + "<br> Fix errors, then try again. </p>";
	}
	else //no errors found
	{
		document.getElementById("Info_Window").innerHTML = "Connecting to router...";
		getAllLightsInfo();
	}
} /*end of extractBridgeInfo function --------------------------------------------------------------------------------------------------------------*/

function getAllLightsInfo()
{
	try 
	{
		var timeoutVar = setTimeout(function throwTimeoutError() {throw "Timeout";}, 3000); //set to 3 seconds
		URLAddress = "http://" + myBridgeIP + "/api/" + myAuthenticatedUsername + "/lights"; //set the URL to get all light info
		var jsonResponse = jsonGET();
		listOfLightsObj = JSON.parse(jsonResponse);
		clearTimeout(timeoutVar); //stop the timeout variable
		changeLightSelectionOptions();
		getSelectedLightInfo();
		enableChangableProperties(); //remove disabled feature from selects and textboxes in changable properties section
		document.getElementById("Info_Window").innerHTML = "Light info has been loaded" + "<br>" + 
														"Select which light you want to change, then press the 'Select Light' button." + "<br>" + 
														"Change the property you wish to change" + "<br>" +
														"Then press 'Apply changes' button";
	} //end of try block
	catch(e)
	{
		if(e.message == "Timeout")
		{
			document.getElementById("Info_Window").innerHTML = "<p style='color:red'> Error: Timed Out. <br> Check to make sure IP address is correct. </p>";
		}
		else
		{
			document.getElementById("Info_Window").innerHTML = "<p style='color:red'> ERROR: There was an exception thrown while making the JSON GET request or parsing the JSON response. <br> Check to make sure your IP address is correct. <br>" + e.message + "</p>";
		}
		
	}
	
}//end of get all lights info -------------------------------------------------------------------------------------------------------------------------

function changeLightSelectionOptions()
{
	var temp = "";
	//change light 1's options
	temp = listOfLightsObj["1"]["name"];
	document.getElementById("Light_1").innerHTML = temp;

	//change light2 options
	temp = listOfLightsObj["2"]["name"];
	document.getElementById("Light_2").innerHTML = temp;

	//change light 3 options
	temp = listOfLightsObj["3"]["name"];
	document.getElementById("Light_3").innerHTML = temp;

	//change light 4's options
	temp = listOfLightsObj["4"]["name"];
	document.getElementById("Light_4").innerHTML = temp;

	//change light 5's options
	temp = listOfLightsObj["5"]["name"];
	document.getElementById("Light_5").innerHTML = temp;
}//end of changeLightSelectionOptions

function enableChangableProperties()
{
	//enable the 'select light' dropdown menu
	document.getElementById("Selected_Light").disabled=false;
	//enable 'select light' button
	document.getElementById("Select_Light_Button").disabled=false;
	//enable turned on t/f dropdown menu
	document.getElementById("Selected_Light_State_On_Dropdown_Menu").disabled=false;
	//brightness textbox is enabled by getSelectedLightInfo()
	//hue textbox is enabled by getSelectedLightInfo()
	//saturation textbox is enabled by getSelectedLightInfo()
	//enable effect dropdown menu
	document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").disabled=false;
	
}//end of enableChangeableProperties

function getSelectedLightInfo()
{
	var selectedLightNumber;
	if(document.getElementById("Selected_Light").value == 'Light_1')
	{
		selectedLightNumber = "1";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_2')
	{
		selectedLightNumber = "2";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_3')
	{
		selectedLightNumber = "3";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_4')
	{
		selectedLightNumber = "4";
	}
	else
	{
		selectedLightNumber = "5";
	}

	document.getElementById("Selected_Light_Number").innerHTML = "Light Number: " + selectedLightNumber;
	document.getElementById("Selected_Light_Name").innerHTML = "Light Name: " + listOfLightsObj[selectedLightNumber]["name"];
	document.getElementById("Selected_Light_Type").innerHTML = "Light Type: " + listOfLightsObj[selectedLightNumber]["type"];
	document.getElementById("Selected_Light_Model_ID").innerHTML = "Model ID: " + listOfLightsObj[selectedLightNumber]["modelid"];
	document.getElementById("Selected_Light_Manufacturer_Name").innerHTML = "Manufacturer Name: " + listOfLightsObj[selectedLightNumber]["manufacturername"];
	document.getElementById("Selected_Light_SWVersion").innerHTML = "SWVersion: " + listOfLightsObj[selectedLightNumber]["swversion"];
	document.getElementById("Selected_Light_Unique_ID").innerHTML = "Unique ID: " + listOfLightsObj[selectedLightNumber]["uniqueid"];
	//reseting option to the correct value for state on
	var currentSelectedLightStateOnValue = listOfLightsObj[selectedLightNumber]["state"]["on"];
	if(currentSelectedLightStateOnValue ===true)
	{
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value=true;
	}
	else    
	{
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value=false;
	}

	document.getElementById("Selected_Light_State_Brightness").innerHTML = "<form>Brightness (min=0 max=254): <input type='text' name='Selected_Light_State_Brightness_Textbox' id='Selected_Light_State_Brightness_Textbox' value='" + listOfLightsObj[selectedLightNumber]["state"]["bri"] + "'></form>";
	document.getElementById("Selected_Light_State_Hue").innerHTML = "<form>Hue (min=0 max=65535): <input type='text' name='Selected_Light_State_Hue_Textbox' id='Selected_Light_State_Hue_Textbox' value='" + listOfLightsObj[selectedLightNumber]["state"]["hue"] + "'></form>" ;
	document.getElementById("Selected_Light_State_Saturation").innerHTML = "<form>Saturation (min=0 max=254): <input type='text' name='Selected_Light_State_Saturation_Textbox' id='Selected_Light_State_Saturation_Textbox' value='"  + listOfLightsObj[selectedLightNumber]["state"]["sat"] + "'></form>";
	//document.getElementById("Selected_Light_Color_Temp").innerHTML = "<form>Color Temperature (min=2000 max=6500): <input type='text' name='Selected_Light_Color_Temp_Textbox' id='Selected_Light_Color_Temp_Textbox' value='" + listOfLightsObj[selectedLightNumber]["ct"] + "'> K</form>";
	//resetting effect option to the correct value
	var currentSelectedLightStateEffectValue = listOfLightsObj[selectedLightNumber]["state"]["effect"];
	if(currentSelectedLightStateEffectValue === "none")
	{
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value="none";
	}
	else if(currentSelectedLightStateEffectValue === "colorloop")
	{
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value="colorloop";
	}
	else
	{
		console.log("ERROR: invalid Selected Light State Effect Value: '" + currentSelectedLightStateEffectValue + "'");
	}
}//end of getSelectedLightInfo

function useApplyChangesButton()
{
	var selectedLightNumber; //this is repeated code!!!!!!!!!!
	if(document.getElementById("Selected_Light").value == 'Light_1')
	{
		selectedLightNumber = "1";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_2')
	{
		selectedLightNumber = "2";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_3')
	{
		selectedLightNumber = "3";
	}
	else if(document.getElementById("Selected_Light").value == 'Light_4')
	{
		selectedLightNumber = "4";
	}
	else
	{
		selectedLightNumber = "5";
	}
	//console.log("selectedLightNumber: " + selectedLightNumber);

	/*check to make sure all input values are legal values*/
	var foundIllegalValue = false;
	var outputErrorString = "";
	
	//check for valid turned on value
	var inputTurnedOnValue = document.getElementById("Selected_Light_State_On_Dropdown_Menu").value;
	if(inputTurnedOnValue == 'true')
	{
		console.log("Turned On input value is valid");
	}
	else if(inputTurnedOnValue == 'false')
	{
		console.log("Turned On input value is valid");
	}
	else
	{
		console.log("ERROR: Illegal Turned On input value: '" + inputTurnedOnValue +"'");
		foundIllegalValue= true;
		outputErrorString += "Invalid Turned On Value. Turned On value must be either 'true' or 'false'.";
	}
	//chack for valid brightness value
	var inputBrightnessValue = document.getElementById("Selected_Light_State_Brightness_Textbox").value;
	if((inputBrightnessValue >= 0) && (inputBrightnessValue < 255))
	{
		console.log("Brightness input value is valid");
	}
	else
	{
		console.log("ERROR: Illegal Brightness Value: '" + inputBrightnessValue + "'");
		foundIllegalValue=true;
		outputErrorString += "<br> Invalid Brightness Value. Brightness Value must be between (and including the numbers) 0 and 254.";
	}
	//check for valid hue value
	var inputHueValue = document.getElementById("Selected_Light_State_Hue_Textbox").value;
	if((inputHueValue >= 0) && (inputHueValue < 65536))
	{
		console.log("Hue input value is valid");
	}
	else
	{
		console.log("ERROR: Illegal Hue Value: '" + inputHueValue + "'");
		foundIllegalValue=true;
		outputErrorString += "<br> Invalid Hue Value. Hue value must be between (and including the numbers) 0 and 65535.";
	}
	//check for valid saturation value
	var inputSaturationValue = document.getElementById("Selected_Light_State_Saturation_Textbox").value;
	if((inputSaturationValue >= 0) && (inputSaturationValue < 255))
	{
		console.log("Saturation Input value is valid");
	}
	else
	{
		console.log("ERROR: Illegal Saturation value: '" + inputSaturationValue +"'");
		foundIllegalValue=true;
		outputErrorString += "<br> Invalid Saturation Value. Saturation value must be between (and including the numbers) 0 and 254.";
	}
	//check for valid effect value
	var inputEffectValue = document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value;
	if(inputEffectValue === ("none"))
	{
		console.log("Effect input is valid");
	}
	else if(inputEffectValue === ("colorloop"))
	{
		console.log("Effect input is valid");
	}
	else
	{
		console.log("ERROR: Illegal Effect value: '" + inputEffectValue +"'");
		foundIllegalValue=true;
		outputErrorString += "<br> Invalid Effect Value. Effect value must be either 'none' or 'colorloop'.";
	}
	//check for valid Color Temp value
	/**
	var inputColorTempValue = document.getElementById("Selected_Light_Color_Temp_Textbox").value;
	if((inputColorTempValue >= 2000) && (inputColorTempValue < 6501))
	{
		console.log("Color Temp input is valid");
	}
	else
	{
		console.log("ERROR: Illegal Color Temp Value: '" + inputColorTempValue + "'");
		foundIllegalValue= true;
		outputErrorString += "<br> Invalid Color Temp value. Color Temp value must be between (and including the numbers) 2000 and 6500.";
	} */

	//if errors, print out error message, else send json request
	if(foundIllegalValue === true)
	{
		document.getElementById("Info_Window").innerHTML = "<p style='color:red'>" + outputErrorString + "<br> Fix errors, then try again. </p>";
	}
	else
	{
		document.getElementById("Info_Window").innerHTML = "Processing json request...";
		//change values of stored light info
		applyChangesToLightInfo(selectedLightNumber,inputTurnedOnValue,inputBrightnessValue,inputHueValue,inputSaturationValue,inputEffectValue);
		//send request
		jsonPUT(selectedLightNumber);
		//display finishing message
		document.getElementById("Info_Window").innerHTML = "Finished Request. Information was sent to Light.";
	}

}//end of useApplyChangesButton

function useSetColorValueButton(selectedPredefinedLightColor)
{
	//var selectedPredefinedLightColor = document.getElementById("Predefined_Color_Dropdown_Menu").value;
	//if(selectedPredefinedLightColor === ("None"))
	//{
	//	console.log("Predefined Light Color 'None' selected. No changes will be made.");
	//}
	//else 
	if(selectedPredefinedLightColor === ("Red"))
	{
		console.log("Predefined Light Color 'Red' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Hue_Textbox").value = 0;
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else if(selectedPredefinedLightColor === ("Yellow"))
	{
		console.log("Predefined Light Color 'Yellow' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Hue_Textbox").value = 12750;
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else if(selectedPredefinedLightColor === ("Green"))
	{
		console.log("Predefined Light Color 'Green' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Hue_Textbox").value = 25500;
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else if(selectedPredefinedLightColor === ("Blue"))
	{
		console.log("Predefined Light Color 'Blue' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Hue_Textbox").value = 46920;
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else if(selectedPredefinedLightColor === ("Purple"))
	{
		console.log("Predefined Light Color 'Purple' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Hue_Textbox").value = 56100;
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else if(selectedPredefinedLightColor === ("White"))
	{
		console.log("Predefined Light Color 'White' selected.");
		document.getElementById("Selected_Light_State_On_Dropdown_Menu").value = "true";
		document.getElementById("Selected_Light_State_Saturation_Textbox").value = 0;
		document.getElementById("Selected_Light_State_Brightness_Textbox").value = 254;
		document.getElementById("Selected_Light_State_Effect_Dropdown_Menu").value = "none";
		console.log("Finished changing the light settings.");
	}
	else
	{
		console.log("ERROR: Illegal input for Predefined Light Color");
	}

	document.getElementById("Info_Window").innerHTML = "Predefined Color values have been set. <br> Press the 'Apply Changes' button to change the light to that color.";
}//end of useSetColorValueButton

function applyChangesToLightInfo(selectedLightNumber,turnedOnValue, brightnessValue, hueValue, saturationValue, effectValue)
{
	listOfLightsObj[selectedLightNumber]["state"]["on"] = turnedOnValue;
	listOfLightsObj[selectedLightNumber]["state"]["bri"] = brightnessValue;
	listOfLightsObj[selectedLightNumber]["state"]["hue"] = hueValue;
	listOfLightsObj[selectedLightNumber]["state"]["sat"] = saturationValue;
	listOfLightsObj[selectedLightNumber]["state"]["effect"] = effectValue;
	console.log("new light settings have been saved");
}//end of applychangestolightinfo

/**
function convertKelvinToMired(input_Kelvin)
{
	var solution = (1000000/input_Kelvin);
	console.log("kelvin to mired solution: " + solution);
	return solution;
}//end of convert Kelvin to Mired
*/

function jsonGET()
{
	var Httpreq = new XMLHttpRequest(); //make new http request
	Httpreq.open("GET",URLAddress,false); //make get request with url
	Httpreq.send(null); //send the request
	return Httpreq.responseText;	
	
}//end of jsonGET

function jsonPUT(input_Selected_Light_Number)
{
	//setup temporary outbound URL address
	//var tempOutboundURL = "http://" + myBridgeIP + "/api/" + myAuthenticatedUsername + "/lights";
	var tempOnValue = listOfLightsObj[input_Selected_Light_Number]["state"]["on"];
	var tempBrightnessValue = parseInt(listOfLightsObj[input_Selected_Light_Number]["state"]["bri"]);
	var tempHueValue = parseInt(listOfLightsObj[input_Selected_Light_Number]["state"]["hue"]);
	var tempSaturationValue = parseInt(listOfLightsObj[input_Selected_Light_Number]["state"]["sat"]);
	var tempEffectValue = listOfLightsObj[input_Selected_Light_Number]["state"]["effect"];
	var tempOutboundCommand = '{"on":' + tempOnValue + ', "bri":' + tempBrightnessValue + ', "hue":' + tempHueValue + ', "sat":' + tempSaturationValue + ', "effect":"' + tempEffectValue + '"}';
	console.log("jsonPUT tempOutboundCommand: '" + tempOutboundCommand + "'");
	var Httpreq = new XMLHttpRequest();
	Httpreq.open('PUT', URLAddress + "/" + input_Selected_Light_Number + "/state", true);
	console.log("urlAddress: '" + URLAddress + "/" + input_Selected_Light_Number + "/state'");
	Httpreq.onreadystatechange = function ()
	{
		if(Httpreq.readyState == 4)
		{
			if(Httpreq.status==200)
			{
				console.log("Successful JSON Reply: " + Httpreq.responseText);

			}
			else
			{
				console.log("Error " + Httpreq.status);
			}
		}
	}
	Httpreq.send(tempOutboundCommand);
}//end of jsonPUT
