const db = 'art25285_keyvalues'
// only table is kv
//user project name value

// export async function doFetch(sql) {
//   let resp = await fetch(
//     'https://www.artspace7.com.au/dsql/json_helper_get.php?db=' +
//       db +
//       '&sql=' +
//       sql,
//   )
//   return await resp.json()
// }

// ------ new ---------

const db_base = 'art25285_'

// export async function doFetchGet(db, sql) {
//   let resp = await fetch(
//     `https://www.artspace7.com.au/dsql/json_helper_get.php?db=${db_base}${db}&sql=${sql}`,
//   )
//   return await resp.json()
// }

export async function doFetchPost(db, sql) {
  let formData = new FormData()
  formData.append('db', db_base + db)
  formData.append('sql', encodeURI(sql))  // encodeURIComponent
  //formData.append('noenc', 'true') 

  let resp = await fetch(
    `https://www.artspace7.com.au/dsql/json_helper_post.php`,
    {
      method: 'POST',
      body: formData,
    },
  )
  let j = await resp.json()  // await?
  //console.log(j)
  return j
}

