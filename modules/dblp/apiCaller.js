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
    let authorExp
    if(paperInfo.authors.author instanceof Array){
      authorExp = paperInfo.authors.author.join(',')
    }else{
      authorExp = paperInfo.authors.author
    }
    returnArr.push({
      title: paperInfo.title,
      author: authorExp,
      url: paperInfo.ee
    })
  }
  return returnArr
}
