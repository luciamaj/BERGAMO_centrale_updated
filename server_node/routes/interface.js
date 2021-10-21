let router = require('express').Router();
const fs = require('fs');
const ini = require('ini');
const configIni = ini.parse(fs.readFileSync(__basedir + "/config.ini", 'utf-8'));
const commands = require(__basedir + "/modules/commands.js");
const { getPerifericheDebug, getCanvasDebug, getJoystickDebug } = require(__basedir + "/modules/helpers.js");


router.post('/', function(request,response) {
  let backupConfig = "null";

  try { 
      backupConfig = JSON.parse(fs.readFileSync(__basedir + '/data/backup-config.json', 'utf-8')); } 
  catch (err) {
      console.log(err);
      fsUtilites.writeLogFile(err);
  }

  let peri = getPerifericheDebug();
  let canvas = getCanvasDebug();
  let joy = getJoystickDebug();

  response.render(__basedir + '/views/home.mustache', {info: configIni, backupConfig: backupConfig, periferiche: peri, canvas: canvas, joysticks: joy });
});

router.get('/service/shut-down', async function(request,response) {
  try {
    let resultCdm = await commands.executeCmd('spegni-macchina');
    response.json({"success": resultCdm});
  } catch (err) {
    console.log(err);
    response.json({"success": false});
  }
});

router.get('/service/reboot', async function(request,response) {
  try {
    let resultCdm = await commands.executeCmd('riavvia-macchina');
    response.json({"success": resultCdm});
  } catch (err) {
    console.log(err);
    response.json({"success": false});
  }
});

router.get('/service/sync', async function(request,response) {
  try {
    let resultCdm = await commands.executeCmd('sync-macchina');
    response.json({"success": resultCdm});
  } catch (err) {
    console.log(err);
    response.json({"success": false});
  }
});

module.exports = router;