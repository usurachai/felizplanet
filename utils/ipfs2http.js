import axios from 'axios'

function ipfs2http(ipfsURI) {
  return ipfsURI.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
}

export async function scUri2image (base64) {
  console.log("base64", base64)
  const json = await (await axios.get(base64)).data
  let imageData = {}
  if (json.image) {
    imageData.uri = ipfs2http(json.image)
  }
  if (json.name) {
    imageData.name = json.name
  }
  console.log("json", json)
  return imageData
}

export default async function meta2image (ipfsURI) {
  const rURI = ipfs2http(ipfsURI)
  const json = await (await axios.get(rURI)).data
  let imageURI = ''
  if (json.image) {
    imageURI = ipfs2http(json.image)
  }
  console.log(json)
  return imageURI
}