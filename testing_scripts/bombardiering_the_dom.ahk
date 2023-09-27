


Loop
{
    WinGetPos, X, Y, Width, Height, Concept Explorer
    Random, ClickX, X, X+Width
    Random, ClickY, Y+300, Y+Height-300
    ControlClick, x%ClickX% y%ClickY%, Concept Explorer
    Sleep 20
   
    
    ; Check if the "Q" key is pressed
    if GetKeyState("Q", "P")
    {
        MsgBox Exiting the script.
        ExitApp ; Exit the script
    }
}