const secrets = require("./db/secrets.js");
let Agenda = require("agenda");

// set the collection where the jobs will be save
// the collection can be name anything
let url = process.env.DB_URL; // DB_URL="mongodb://127.0.0.1:27017/test-db"
let agenda = new Agenda({
  db: { address: process.env.DB_URL, collection: "jobs" },
});

// list the different jobs availale throughout your app
let jobTypes = ["archiveRideJob"];

// loop through the job_list folder and pass in the agenda instance to
// each job so that it has access to its API.
jobTypes.forEach((type) => {
  // the type name should match the file name in the jobs_list folder
  require("./jobs_list/" + type)(agenda);
});

if (jobTypes.length) {
  // if there are jobs in the jobsTypes array set up
  agenda.on("ready", async () => await agenda.start());
}

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
