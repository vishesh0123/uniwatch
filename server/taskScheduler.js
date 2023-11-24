import Queue from "bull";

const dbqueue = new Queue('Queue For Data Fetching and Storing');

dbqueue.process((job, done) => {
    console.log(job.data);
    done();
})

export const runTaskScheduler = () => {

}

dbqueue.on('error', (err) => {
    console.log(err);
})