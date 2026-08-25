@echo off
setlocal

:: Encontrar vcvars64.bat
set "VCVARS=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if not exist "%VCVARS%" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
)

if not exist "%VCVARS%" (
    echo Error: vcvars64.bat not found.
    exit /b 1
)

:: Configurar ambiente do MSVC
call "%VCVARS%"

:: Pastas do Raylib (baseado no nome da pasta extraida)
set "RAYLIB_DIR=raylib-5.0_win64_msvc16"
set "INCLUDES=/I %RAYLIB_DIR%\include"
set "LIBS=%RAYLIB_DIR%\lib\raylib.lib user32.lib gdi32.lib winmm.lib shell32.lib"

:: Compilar
cl.exe /MD /EHsc /Zi /W3 src\*.cpp /I include /I vendor %INCLUDES% /link %LIBS% msvcrt.lib /OUT:sanctuary.exe

if %errorlevel% neq 0 (
    echo Build Failed!
    exit /b %errorlevel%
)

echo Build Succeeded! Run sanctuary.exe
endlocal
