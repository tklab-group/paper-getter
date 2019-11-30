const {venueMap} = require('./config/venue.js')
const {fetchFromDblp} = require('./modules/dblp/apiCaller.js')


const main = async () => {
  if(process.argv.length != 4){
    console.log('command : "node app.js <venue name> <year>"')
    return
  }
  
  const venue = process.argv[2]
  const year = process.argv[3]
  
  const paperData = await fetchFromDblp(venueMap[venue], year)
  
  console.log(paperData)
}

main()
