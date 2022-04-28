const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// weird import see https://www.npmjs.com/package/node-fetch

const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Written to', path);
    }
    );
}

const pathFromKey = key => `https://www.nrcs.usda.gov/Internet/WCIS/AWS_PLOTS/basinCharts/POR/WTEQ/assocHUCmt_8/${key}.json`

const keys = [
    'kootenai',
    'st._marys',
    'milk',
    'lower_clark_fork',
    'flathead',
    'sun-teton-marias',
    'bitterroot',
    'upper_clark_fork',
    'helena_valley',
    'smith-judith-musselshell',
    'jefferson',
    'madison',
    'gallatin',
    'upper_yellowstone',
    'bighorn',
    'tongue',
    'powder',
]

async function getJson(path) {
    const res = await fetch(path)
    const data = await res.json()
    return data
}

async function main() {
    const compiled = await Promise.all(keys.map(async key => {
        const path = pathFromKey(key)
        const data = await getJson(path)
        data.forEach(d => {
            d.basin = key
        })
        return { key, data }
    }))
    writeJson('mt-snow-water-equivalancy.json', compiled)
}

main()