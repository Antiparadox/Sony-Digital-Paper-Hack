2018922 Beta V1.0

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// This is a customized Digital Paper App for loading any firmware into Sony Digital Paper | DPT-RP1 / DPT-CP1

IMPORTANT: load your firmware into dir /User/library/Application Supports/Sony Corporation/Digital Paper App/DigitalPaperApp, then edit the SoftWareUpdateHandler.js file under DPA/app/scripts/Model/View/Handler/SoftWareUpdateHandler.js, with the file path to your firmware @line 716 and @line 375

cd into DPA folder, run "asar p <file path to /app/> app.asar"

Replace the app.asar file under dir DigitalPaperApp/Contents/Resources/ with the provided app.asar file under DPA folder, then launch the Digital Paper App.

You can download the official firmware update for DPT-RP1 under firmware 1.4.01, this is the official version.

This is only tested on MacOS, success is not guaranteed on Windows and other OS.

Load your firmware at your own risk, you may potentially lose your warranty for this device.

Antiparadox//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////