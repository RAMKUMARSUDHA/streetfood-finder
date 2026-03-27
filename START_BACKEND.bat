@echo off
echo Starting Street Food Finder Backend...
cd /d C:\projects\street-food-finder\backend
mvn clean spring-boot:run "-Dfile.encoding=UTF-8"
pause
