const {venueMap} = require('./config/venue.js')
const {fetchFromDblp} = require('./modules/dblp/apiCaller.js')
const {createObjectCsvWriter} = require('csv-writer');

const csvHeader = ["title", "author", "url"]


const main = async () => {
  if(process.argv.length != 4){
    console.log('command : "node app.js <venue name> <year>"')
    return
  }
  
  const venue = process.argv[2]
  const year = process.argv[3]
  
  const paperData = await fetchFromDblp(venueMap[venue], year)
  
  const csvFilePath = `./output/${venue}-${year}.csv`
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: csvHeader,
    encoding:'utf8'
  })
  csvWriter.writeRecords(paperData)
}

main()
