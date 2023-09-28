#Persistent ; Keep the script running
CoordMode, Mouse, Screen ; Set the coordinate mode to screen
CoordMode, Tooltip, Screen ; Set the coordinate mode to screen

; Initialize variables
Clicking := false
X1 := 0
Y1 := 0
X2 := 0
Y2 := 0
Interval :=1
; Define a hotkey to start the area selection
s:: ; start area selection
    Clicking := false
    MouseGetPos, X1, Y1
    Tooltip, Area Selection Started. Click X at the bottom right corner.

return





; Define a hotkey to stop the area selection and click within the selected area
x:: ; end area selection
    Clicking := false
	MouseGetPos, X2, Y2
    Tooltip, Area Selection Completed %X1%  %Y1%  %X2%  %Y2% .
   

    ; Calculate the coordinates of the selected area
    X := (X1 + X2) // 2 ; Calculate the center of the selected area
    Y := (Y1 + Y2) // 2
    Click, %X%, %Y% ; Click at the center of the selected area
return

v:: ; toggle clicking on and off
    Clicking := !Clicking ; Toggle the Clicking state
    if (Clicking)
    {
        Tooltip, Automatic Clicking Started. Press V to stop., %X2%, %Y2% 
        SetTimer, PerformClick, %Interval%
    }
    else
    {
        Tooltip, Automatic Clicking Stopped.
        SetTimer, PerformClick, Off
    }
return

PerformClick:
    Random, ClickX, X1, X2
    Random, ClickY, Y1, Y2
    Click, %ClickX%, %ClickY% ;
   
return


