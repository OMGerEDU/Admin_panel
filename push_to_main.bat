@echo off

set MSG=%~1
if "%MSG%"=="" set MSG=Update

echo Staging changes...
git add .

echo Committing with message: %MSG%
git commit -m "%MSG%"

echo Pushing to main...
git push origin main

echo Done!
pause
