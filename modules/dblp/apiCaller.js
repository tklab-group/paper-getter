'use script'
const axios =  require('axios')
const Encoding = require('encoding-japanese')

exports.fetchFromDblp = async (venue, year, minPage) => {
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
      return modifyResponse(hits.hit, minPage)
    }
  }

  return []
}


const modifyResponse = (paperData, minPage) => {
  const returnArr = []
  for(paper of paperData){
    const paperInfo = paper.info
    if(paperInfo.type != 'Conference and Workshop Papers'){
      console.log(`"${paperInfo.title}" is not conference paper`)
      continue;
    }

    // minPage以下のpaperはリストから除外
    const pagesArr = paperInfo.pages.split('-')
    if(pagesArr.length > 2){
      throw `${paperInfo.title} pages is invalid : ${pagesArr.length}`
    }

    const pageSize;
    if(pagesArr.length == 1){
      pageSize = 1;
    }else {
      pageSize = parseInt(pagesArr[1],10) - parseInt(pagesArr[0], 10);
    }

    if(pageSize < minPage){
      console.log(`"${paperInfo.title}" is removed because of page size`)
      continue;
    }

    let authorArr = []

    if(paperInfo.authors.author instanceof Array){
      for(author of paperInfo.authors.author){
        authorArr.push(convertStr(author.text).replace(/ 000[0-9]+/g, ""))
      }
    }else{
      authorArr.push(convertStr(paperInfo.authors.author.text).replace(/ 000[0-9]+/g, ""))
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
