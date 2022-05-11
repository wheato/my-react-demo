const fs = require('fs');

const list = [];

for(let i = 0; i < 10; i++) {
  const json = fs.readFileSync(`./${(i % 10) + 1}.json`);
  const res = JSON.parse(json);
  list.push(...res.data.list);
}

const usedData = list.map(item => {
  return {
    token: item.collection.name,
    token_id: parseInt(item.tokenId),
    image: item.image,
    rarity: item.rarity.ranking,
  }
})

fs.writeFileSync('./mock.json', JSON.stringify(usedData));

