1. Setup Local Db and run all queries in setupdb.md file in sql editor or sql workbench
2. add local db config to db.config.js file
3. Install redis-stack-server https://redis.io/docs/install/install-stack/windows/
4. run redis server 
5. Add pools you want to track and want to store in local db in poolcache.json add pool address to pools array also in lastupdated array put 0 on that index
6. fisrt run 'npm install' and then  run backend by 'node server/server.js'
wait a minute it will load some data to database
7. run frontend by 'npm run dev'
