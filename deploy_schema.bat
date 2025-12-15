@echo off
echo ==========================================
echo      Supabase Schema Deployment
echo ==========================================
echo.
echo.
echo Generating SQL script you can paste into Supabase SQL Editor...
echo.

node scripts/deploy_schema.js

echo.
echo Done. Scroll up, copy the SQL block, and paste it into Supabase Dashboard -> SQL Editor.
echo.
pause
