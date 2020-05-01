const {venueMap} = require('./config/venue.js')
const {fetchFromDblp} = require('./modules/dblp/apiCaller.js')
const fs = require('fs')
const csvStringify = require('csv-stringify')

const csvHeader = ["title", "url", "author",]


const main = async () => {
  if(process.argv.length != 4){
    console.log('command : "node app.js <venue name> <year>"')
    return
  }
  
  const venue = process.argv[2]
  const year = process.argv[3]
  
  const paperData = await fetchFromDblp(venueMap[venue], year)

  const csvFilePath = `./output/${venue}-${year}.tsv`
  
  csvStringify(paperData, 
    {
      header: true, 
      columns: csvHeader,
      delimiter: '\t'
    }, 
    (err, data) => {
      fs.writeFile(csvFilePath, data, (e) => {
        if(e) console.log(e)
      })
    }
  )
}

main()
