const setEnv = () => {
const fs = require('fs');
const writeFile = fs.writeFile;
const targetPath = './src/environments/environment.ts';
const colors = require('colors');
require('dotenv').config({
    path: 'src/environments/.env'
});
// `environment.ts` file structure
const envConfigFile = `export const environment = {
apiKey: '${process.env.API_KEY}',
production: true,
};
`;
writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
    console.error(err);
    throw err;
    }
})};
setEnv();