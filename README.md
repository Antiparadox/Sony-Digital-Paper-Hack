20181121 
Special Thanks to  shankerzhiwu and his/her friend at XDA( who discover the special id resistor to crack Diag)  yanzi(HappyZ)( who wrote the complete step-by-step Interactive py) janten( who initiates the commandline tool for web APIs), this device has been rooted.
Please refer to https://github.com/HappyZ/dpt-tools  for complete tutorial.


2018109 Beta V1.1

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// This is a customized Digital Paper App for loading any firmware into Sony Digital Paper | DPT-RP1 / DPT-CP1

IMPORTANT: load your firmware into dir /User/library/Application Supports/Sony Corporation/Digital Paper App/DigitalPaperApp, then edit the SoftWareUpdateHandler.js file under DPA/app/scripts/Model/View/Handler/SoftWareUpdateHandler.js, with the file path to your firmware @line 716 and @line 375

cd into DPA folder, run "asar p <file path to /app/> app.asar"

Replace the app.asar file under dir DigitalPaperApp/Contents/Resources/ with the provided app.asar file under DPA folder, then launch the Digital Paper App.

you will be prompted to update, follow all procedures, and the update file would be immediately transferred into Digital Paper, bypassing validation and certificates. 

Then the Device will install update pkg and reboot.

If it says "Update Error", this is because the Firmware version has not been changed, 

You can download the official firmware update for DPT-RP1 under firmware 1.4.01, this is the official version.

This is only tested on MacOS, success is not guaranteed on Windows and other OS.

Load your firmware at your own risk, you may potentially lose your warranty for this device.




Antiparadox//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////