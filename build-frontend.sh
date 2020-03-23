cd frontend
npm i
npm run-script build
cd ..
rm -rf backend/build/
mv frontend/build backend/build/