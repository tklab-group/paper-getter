'use script'
const axios =  require('axios')

exports.fetchFromDblp = async (venue, year) => {
  const apiPath = 'http://dblp.org/search/publ/api'
  const query = `venue:${venue}:+year:${year}:`
  const res = await axios.get(apiPath, {
    params: {
      q: query,
      format: 'json',
      h: 1000
    }
  }).catch((err) => {
    return err.response
  })

  if(res.status === 200){
    const hits = res.data.result.hits
    if(hits.hit){
      return modifyResponse(hits.hit)
    }
  }

  return []
}


const modifyResponse = (paperData) => {
  const returnArr = []
  for(paper of paperData){
    const paperInfo = paper.info
    if(paperInfo.type != 'Conference and Workshop Papers'){
      continue;
    }

    returnArr.push({
      title: paperInfo.title,
      authors: paperInfo.authors.author,
      url: paperInfo.ee
    })
  }
  return returnArr
}
