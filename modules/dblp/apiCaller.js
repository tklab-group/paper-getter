'use script'
const axios =  require('axios')
const Encoding = require('encoding-japanese')

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

    let authorArr = []

    if(paperInfo.authors.author instanceof Array){
      for(author of paperInfo.authors.author){
        authorArr.push(convertStr(author.text).replace(" 0001", ""))
      }
    }else{
      authorArr.push(convertStr(paperInfo.authors.author.text).replace(" 0001", ""))
    }

    const authorExp = authorArr.join(',')

    returnArr.push({
      title: paperInfo.title,
      author: authorExp,
      url: paperInfo.ee
    })
  }
  return returnArr
}


/**
 * なぜかutf-8 -> utf-8変換しないと文字化けする
 * @param {}} str 
 */
const convertStr = (str) => {
  const convertData = Encoding.convert(str, {
    to: 'utf-8',
    from: 'utf-8',
    type: 'string',
  });
  return convertData
}
