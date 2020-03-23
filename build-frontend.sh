cd frontend
npm i
npm run-script build
cd ..
rm -rf /var/www/html/OneNight/
mv frontend/build /var/www/html/OneNight/